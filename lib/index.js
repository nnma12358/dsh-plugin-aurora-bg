/**
 * dsh-plugin-aurora-bg — Host half.
 *
 * 参考 dsh-skin-master 的做法：**不依赖 settings 服务**，自己开一条 HTTP 路由并落盘，
 * 因此 web 端与 dsh desktop（0.1.1 / 0.2.1）行为一致，刷新、重启都能记住。
 *
 *   GET  /aurora-bg/settings        → { ok, value: { mode, url } }
 *   POST /aurora-bg/settings        → 写入 { mode, url }
 *   POST /aurora-bg/asset?name=x    → 上传背景图（原始二进制），返回 { ok, url }
 *   GET  /aurora-bg/asset/<name>    → 回传背景图（带 Range，供大图流式读取）
 *
 * 存储（在 harness home 下，与 profile 解耦）：
 *   <home>/dsh-plugin-aurora-bg/settings.json
 *   <home>/dsh-plugin-aurora-bg/assets/<safe-name>
 *
 * 大图不再以 data URL 塞进配置：客户端会把 >256KB 的 data URL 上传成资产，
 * 配置里只留一个同源路径，页面也就不会每次加载都解析几 MB 的 base64。
 */
import { fileURLToPath } from 'node:url'
import { basename, dirname, extname, join, resolve } from 'node:path'
import { createReadStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'

export const name = 'aurora-bg'
export const inject = ['webServer']

const ROUTE = '/aurora-bg'
const DATA_DIR = 'dsh-plugin-aurora-bg'
const MAX_SETTINGS_BYTES = 4 * 1024 * 1024
const MAX_ASSET_BYTES = 64 * 1024 * 1024

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
}

/** 解析 harness home：DSH_HOME → profile 布局推断 → ~/.dsh */
function resolveHome(ctx) {
  const env = process.env.DSH_HOME
  if (env && env.trim()) return resolve(env.trim())
  try {
    const profileDir = fileURLToPath(ctx.baseUrl)
    const name = basename(profileDir)
    if ((name === 'web' || name === 'desktop') && basename(dirname(profileDir)) === 'profiles') {
      return dirname(dirname(profileDir))
    }
  } catch { /* 退回默认 home */ }
  return join(homedir(), '.dsh')
}

function readBody(req, limit, asJson) {
  return new Promise((ok, fail) => {
    const chunks = []
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > limit) {
        fail(new Error(`body exceeds ${limit} bytes`))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      const buffer = Buffer.concat(chunks)
      if (!asJson) return ok(buffer)
      const raw = buffer.toString('utf8')
      try {
        ok(raw ? JSON.parse(raw) : {})
      } catch (error) {
        fail(new Error(`invalid JSON body: ${error.message}`))
      }
    })
    req.on('error', fail)
  })
}

/** 只保留白名单字段，避免把任意 JSON 灌进配置。 */
function sanitize(value) {
  const source = value && typeof value === 'object' ? value : {}
  const rawBlur = source.blur
  const blur = typeof rawBlur === 'number' && Number.isFinite(rawBlur)
    ? Math.max(0, Math.min(60, Math.round(rawBlur)))
    : 16
  const rawAlpha = source.panelAlpha
  const panelAlpha = typeof rawAlpha === 'number' && Number.isFinite(rawAlpha)
    ? Math.max(0, Math.min(90, Math.round(rawAlpha)))
    : 18
  return {
    mode: typeof source.mode === 'string' && source.mode ? source.mode : 'aurora',
    url: typeof source.url === 'string' ? source.url : '',
    /** 背景模糊半径（px），0 表示不模糊。 */
    blur,
    /** 面板透明度总开关（0~90）：越小面板越透、背景图越清楚。 */
    panelAlpha,
  }
}

const safeName = (value) => String(value ?? '').replace(/[^A-Za-z0-9._-]/g, '_')

export function apply(ctx) {
  const home = resolveHome(ctx)
  const dataDir = join(home, DATA_DIR)
  const assetsDir = join(dataDir, 'assets')
  const settingsPath = join(dataDir, 'settings.json')

  const loadSettings = () => {
    try {
      return sanitize(JSON.parse(readFileSync(settingsPath, 'utf8')))
    } catch {
      return null
    }
  }

  const saveSettings = (value) => {
    const clean = sanitize(value)
    try {
      mkdirSync(dataDir, { recursive: true })
      writeFileSync(settingsPath, JSON.stringify(clean, null, 2) + '\n')
      return { ok: true, value: clean }
    } catch (error) {
      return { ok: false, message: `背景设置保存失败：${error.message}` }
    }
  }

  const saveAsset = (name, buffer) => {
    const safe = safeName(name) || 'asset.bin'
    try {
      mkdirSync(assetsDir, { recursive: true })
      writeFileSync(join(assetsDir, safe), buffer)
      return { ok: true, url: `${ROUTE}/asset/${encodeURIComponent(safe)}`, bytes: buffer.length }
    } catch (error) {
      return { ok: false, message: `背景图保存失败：${error.message}` }
    }
  }

  const assetFile = (name) => {
    const safe = safeName(name)
    if (!safe) return null
    const file = join(assetsDir, safe)
    return existsSync(file) ? file : null
  }

  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix',
    path: ROUTE,
    handler: async (req, res) => {
      const url = new URL(req.url ?? '/', 'http://local')
      const suffix = url.pathname.slice(ROUTE.length) || '/'
      const method = req.method ?? 'GET'
      const send = (status, body) => {
        res.writeHead(status, {
          'content-type': 'application/json; charset=utf-8',
          'cache-control': 'no-store',
        })
        res.end(JSON.stringify(body))
      }

      try {
        if (suffix === '/settings' && method === 'GET') {
          send(200, { ok: true, value: loadSettings() })
          return
        }
        if (suffix === '/settings' && method === 'POST') {
          const result = saveSettings(await readBody(req, MAX_SETTINGS_BYTES, true))
          send(result.ok ? 200 : 400, result)
          return
        }
        if (suffix === '/asset' && method === 'POST') {
          const name = url.searchParams.get('name') || 'asset.jpg'
          const result = saveAsset(name, await readBody(req, MAX_ASSET_BYTES, false))
          send(result.ok ? 200 : 400, result)
          return
        }
        if (suffix.startsWith('/asset/') && (method === 'GET' || method === 'HEAD')) {
          const file = assetFile(decodeURIComponent(suffix.slice('/asset/'.length)))
          if (!file) {
            send(404, { ok: false, error: { code: 'not-found', message: 'asset not found' } })
            return
          }
          const total = statSync(file).size
          const headers = {
            'content-type': MIME[extname(file).toLowerCase()] ?? 'application/octet-stream',
            'accept-ranges': 'bytes',
            'cache-control': 'no-cache',
          }
          let start = 0
          let end = total - 1
          let status = 200
          const range = /^bytes=(\d*)-(\d*)$/.exec(String(req.headers.range ?? '').trim())
          if (range && (range[1] !== '' || range[2] !== '')) {
            if (range[1] === '') {
              start = Math.max(total - Number(range[2]), 0)
            } else {
              start = Number(range[1])
              end = range[2] === '' ? total - 1 : Math.min(Number(range[2]), total - 1)
            }
            if (start >= total || start > end) {
              res.writeHead(416, { 'content-range': `bytes */${total}` })
              res.end()
              return
            }
            status = 206
            headers['content-range'] = `bytes ${start}-${end}/${total}`
          }
          headers['content-length'] = String(end - start + 1)
          res.writeHead(status, headers)
          if (method === 'HEAD') {
            res.end()
            return
          }
          const stream = createReadStream(file, { start, end })
          stream.on('error', () => { try { res.destroy() } catch { /* ignore */ } })
          stream.pipe(res)
          return
        }
        send(404, { ok: false, error: { code: 'not-found', message: `${method} ${ROUTE}${suffix}` } })
      } catch (error) {
        send(500, { ok: false, error: { code: 'internal', message: error?.message ?? String(error) } })
      }
    },
  }), 'aurora-bg: settings + asset routes')
}
