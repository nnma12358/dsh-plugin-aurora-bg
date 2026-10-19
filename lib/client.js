window.__ModuleLoader__.load({
	id: "dsh-plugin-aurora-bg",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region \0rolldown/runtime.js
		var __create = Object.create;
		var __defProp = Object.defineProperty;
		var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
		var __getOwnPropNames = Object.getOwnPropertyNames;
		var __getProtoOf = Object.getPrototypeOf;
		var __hasOwnProp = Object.prototype.hasOwnProperty;
		var __copyProps = (to, from, except, desc) => {
			if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
				key = keys[i];
				if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
					get: ((k) => from[k]).bind(null, key),
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
				});
			}
			return to;
		};
		var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
			value: mod,
			enumerable: true
		}) : target, mod));
		//#endregion
		let react = require("react");
		react = __toESM(react, 1);
		//#region ../../../vendor/cosmokit/src/misc.ts
		/** Return true when a value is `null` or `undefined`. */
		function isNullable(value) {
			return value === null || value === void 0;
		}
		/** Return true for non-array object values. */
		function isPlainObject(data) {
			return data && typeof data === "object" && !Array.isArray(data);
		}
		/** Filter object entries and return a new object. */
		function filterKeys(object, filter) {
			return Object.fromEntries(Object.entries(object).filter(([key, value]) => filter(key, value)));
		}
		/** Map object values while preserving the original key set. */
		function mapValues(object, transform) {
			return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, transform(value, key)]));
		}
		/** Pick selected keys from an object, optionally including `undefined` values. */
		function pick(source, keys, forced) {
			if (!keys) return { ...source };
			const result = {};
			for (const key of keys) if (forced || source[key] !== void 0) result[key] = source[key];
			return result;
		}
		//#endregion
		//#region ../../../vendor/cosmokit/src/types.ts
		/** Test values using `instanceof` with a `toStringTag` fallback. */
		function is(type, value) {
			if (arguments.length === 1) return (value) => is(type, value);
			return type in globalThis && value instanceof globalThis[type] || Object.prototype.toString.call(value).slice(8, -1) === type;
		}
		function isArrayBufferLike(value) {
			return is("ArrayBuffer", value) || is("SharedArrayBuffer", value);
		}
		function isArrayBufferSource(value) {
			return isArrayBufferLike(value) || ArrayBuffer.isView(value);
		}
		let Binary;
		(function(_Binary) {
			_Binary.is = isArrayBufferLike;
			_Binary.isSource = isArrayBufferSource;
			function fromSource(source) {
				if (ArrayBuffer.isView(source)) return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
				else return source;
			}
			_Binary.fromSource = fromSource;
			function toBase64(source) {
				source = fromSource(source);
				if (typeof Buffer !== "undefined") return Buffer.from(source).toString("base64");
				let binary = "";
				const bytes = new Uint8Array(source);
				for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
				return btoa(binary);
			}
			_Binary.toBase64 = toBase64;
			function fromBase64(source) {
				if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "base64"));
				return Uint8Array.from(atob(source), (c) => c.charCodeAt(0));
			}
			_Binary.fromBase64 = fromBase64;
			function toHex(source) {
				source = fromSource(source);
				if (typeof Buffer !== "undefined") return Buffer.from(source).toString("hex");
				return Array.from(new Uint8Array(source), (byte) => byte.toString(16).padStart(2, "0")).join("");
			}
			_Binary.toHex = toHex;
			function fromHex(source) {
				if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "hex"));
				const hex = source.length % 2 === 0 ? source : source.slice(0, source.length - 1);
				const buffer = [];
				for (let i = 0; i < hex.length; i += 2) buffer.push(parseInt(`${hex[i]}${hex[i + 1]}`, 16));
				return Uint8Array.from(buffer).buffer;
			}
			_Binary.fromHex = fromHex;
		})(Binary || (Binary = {}));
		Binary.fromBase64;
		Binary.toBase64;
		Binary.fromHex;
		Binary.toHex;
		/** Deep-clone common JavaScript values while preserving prototypes and cycles. */
		function clone(source, refs = /* @__PURE__ */ new Map()) {
			if (!source || typeof source !== "object") return source;
			if (is("Date", source)) return new Date(source.valueOf());
			if (is("RegExp", source)) return new RegExp(source.source, source.flags);
			if (isArrayBufferLike(source)) return source.slice(0);
			if (ArrayBuffer.isView(source)) return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
			const cached = refs.get(source);
			if (cached) return cached;
			if (Array.isArray(source)) {
				const result = [];
				refs.set(source, result);
				source.forEach((value, index) => {
					result[index] = Reflect.apply(clone, null, [value, refs]);
				});
				return result;
			}
			const result = Object.create(Object.getPrototypeOf(source));
			refs.set(source, result);
			for (const key of Reflect.ownKeys(source)) {
				const descriptor = { ...Reflect.getOwnPropertyDescriptor(source, key) };
				if ("value" in descriptor) descriptor.value = Reflect.apply(clone, null, [descriptor.value, refs]);
				Reflect.defineProperty(result, key, descriptor);
			}
			return result;
		}
		/** Deeply compare arrays, dates, regexps, buffers, and plain object fields. */
		function deepEqual(a, b, strict) {
			if (a === b) return true;
			if (!strict && isNullable(a) && isNullable(b)) return true;
			if (typeof a !== typeof b) return false;
			if (typeof a !== "object") return false;
			if (!a || !b) return false;
			function check(test, then) {
				return test(a) ? test(b) ? then(a, b) : false : test(b) ? false : void 0;
			}
			return check(Array.isArray, (a, b) => a.length === b.length && a.every((item, index) => deepEqual(item, b[index]))) ?? check(is("Date"), (a, b) => a.valueOf() === b.valueOf()) ?? check(is("RegExp"), (a, b) => a.source === b.source && a.flags === b.flags) ?? check(isArrayBufferLike, (a, b) => {
				if (a.byteLength !== b.byteLength) return false;
				const viewA = new Uint8Array(a);
				const viewB = new Uint8Array(b);
				for (let i = 0; i < viewA.length; i++) if (viewA[i] !== viewB[i]) return false;
				return true;
			}) ?? Object.keys({
				...a,
				...b
			}).every((key) => deepEqual(a[key], b[key], strict));
		}
		//#endregion
		//#region ../../../vendor/cosmokit/src/time.ts
		let Time;
		(function(_Time) {
			_Time.millisecond = 1;
			const second = _Time.second = 1e3;
			const minute = _Time.minute = second * 60;
			const hour = _Time.hour = minute * 60;
			const day = _Time.day = hour * 24;
			const week = _Time.week = day * 7;
			let timezoneOffset = (/* @__PURE__ */ new Date()).getTimezoneOffset();
			function setTimezoneOffset(offset) {
				timezoneOffset = offset;
			}
			_Time.setTimezoneOffset = setTimezoneOffset;
			function getTimezoneOffset() {
				return timezoneOffset;
			}
			_Time.getTimezoneOffset = getTimezoneOffset;
			function getDateNumber(date = /* @__PURE__ */ new Date(), offset) {
				if (typeof date === "number") date = new Date(date);
				if (offset === void 0) offset = timezoneOffset;
				return Math.floor((date.valueOf() / minute - offset) / 1440);
			}
			_Time.getDateNumber = getDateNumber;
			function fromDateNumber(value, offset) {
				const date = new Date(value * day);
				if (offset === void 0) offset = timezoneOffset;
				return new Date(+date + offset * minute);
			}
			_Time.fromDateNumber = fromDateNumber;
			const numeric = /\d+(?:\.\d+)?/.source;
			const timeRegExp = new RegExp(`^${[
				"w(?:eek(?:s)?)?",
				"d(?:ay(?:s)?)?",
				"h(?:our(?:s)?)?",
				"m(?:in(?:ute)?(?:s)?)?",
				"s(?:ec(?:ond)?(?:s)?)?"
			].map((unit) => `(${numeric}${unit})?`).join("")}$`);
			function parseTime(source) {
				const capture = timeRegExp.exec(source);
				if (!capture) return 0;
				return (parseFloat(capture[1]) * week || 0) + (parseFloat(capture[2]) * day || 0) + (parseFloat(capture[3]) * hour || 0) + (parseFloat(capture[4]) * minute || 0) + (parseFloat(capture[5]) * second || 0);
			}
			_Time.parseTime = parseTime;
			function parseDate(date) {
				const parsed = parseTime(date);
				if (parsed) date = Date.now() + parsed;
				else if (/^\d{1,2}(:\d{1,2}){1,2}$/.test(date)) date = `${(/* @__PURE__ */ new Date()).toLocaleDateString()}-${date}`;
				else if (/^\d{1,2}-\d{1,2}-\d{1,2}(:\d{1,2}){1,2}$/.test(date)) date = `${(/* @__PURE__ */ new Date()).getFullYear()}-${date}`;
				return date ? new Date(date) : /* @__PURE__ */ new Date();
			}
			_Time.parseDate = parseDate;
			function format(ms) {
				const abs = Math.abs(ms);
				if (abs >= day - hour / 2) return Math.round(ms / day) + "d";
				else if (abs >= hour - minute / 2) return Math.round(ms / hour) + "h";
				else if (abs >= minute - second / 2) return Math.round(ms / minute) + "m";
				else if (abs >= second) return Math.round(ms / second) + "s";
				return ms + "ms";
			}
			_Time.format = format;
			function toDigits(source, length = 2) {
				return source.toString().padStart(length, "0");
			}
			_Time.toDigits = toDigits;
			function template(template, time = /* @__PURE__ */ new Date()) {
				return template.replace("yyyy", time.getFullYear().toString()).replace("yy", time.getFullYear().toString().slice(2)).replace("MM", toDigits(time.getMonth() + 1)).replace("dd", toDigits(time.getDate())).replace("hh", toDigits(time.getHours())).replace("mm", toDigits(time.getMinutes())).replace("ss", toDigits(time.getSeconds())).replace("SSS", toDigits(time.getMilliseconds(), 3));
			}
			_Time.template = template;
		})(Time || (Time = {}));
		//#endregion
		//#region ../../../vendor/schemastery/src/index.ts
		const kSchema = Symbol.for("schemastery");
		const kValidationError = Symbol.for("ValidationError");
		globalThis.__schemastery_index__ ??= 0;
		globalThis.__schemastery_refs__ = void 0;
		var ValidationError = class extends TypeError {
			options;
			name = "ValidationError";
			constructor(message, options) {
				let prefix = "$";
				for (const segment of options.path || []) if (typeof segment === "string") prefix += "." + segment;
				else if (typeof segment === "number") prefix += "[" + segment + "]";
				else if (typeof segment === "symbol") prefix += `[Symbol(${segment.toString()})]`;
				if (prefix.startsWith(".")) prefix = prefix.slice(1);
				super((prefix === "$" ? "" : `${prefix} `) + message);
				this.options = options;
			}
			static is(error) {
				return !!error?.[kValidationError];
			}
		};
		Object.defineProperty(ValidationError.prototype, kValidationError, { value: true });
		const Schema = function(options) {
			const schema = function(data, options = {}) {
				return Schema.resolve(data, schema, options)[0];
			};
			if (options.refs) {
				const refs = mapValues(options.refs, (options) => new Schema(options));
				const getRef = (uid) => refs[uid];
				for (const key in refs) {
					const options = refs[key];
					options.sKey = getRef(options.sKey);
					options.inner = getRef(options.inner);
					options.list = options.list && options.list.map(getRef);
					options.dict = options.dict && mapValues(options.dict, getRef);
				}
				return refs[options.uid];
			}
			Object.assign(schema, options);
			if (typeof schema.callback === "string") try {
				schema.callback = new Function("return " + schema.callback)();
			} catch {}
			Object.defineProperty(schema, "uid", { value: globalThis.__schemastery_index__++ });
			Object.setPrototypeOf(schema, Schema.prototype);
			schema.meta ||= {};
			schema.toString = schema.toString.bind(schema);
			return schema;
		};
		Schema.prototype = Object.create(Function.prototype);
		Schema.prototype[kSchema] = true;
		Object.defineProperty(Schema.prototype, "~standard", { get() {
			return {
				version: 1,
				vendor: "schemastery",
				validate: (value) => {
					try {
						return { value: Schema.resolve(value, this, {})[0] };
					} catch (error) {
						if (ValidationError.is(error)) return { issues: [{
							message: error.message,
							path: error.options.path
						}] };
						throw error;
					}
				}
			};
		} });
		Schema.ValidationError = ValidationError;
		Schema.prototype.toJSON = function toJSON() {
			if (globalThis.__schemastery_refs__) {
				globalThis.__schemastery_refs__[this.uid] ??= JSON.parse(JSON.stringify({ ...this }));
				return this.uid;
			}
			globalThis.__schemastery_refs__ = { [this.uid]: { ...this } };
			globalThis.__schemastery_refs__[this.uid] = JSON.parse(JSON.stringify({ ...this }));
			const result = {
				uid: this.uid,
				refs: globalThis.__schemastery_refs__
			};
			globalThis.__schemastery_refs__ = void 0;
			return result;
		};
		Schema.prototype.set = function set(key, value) {
			this.dict[key] = value;
			return this;
		};
		Schema.prototype.push = function push(value) {
			this.list.push(value);
			return this;
		};
		function mergeDesc(original, messages) {
			const result = typeof original === "string" ? { "": original } : { ...original };
			for (const locale in messages) {
				const value = messages[locale];
				if (value?.$description || value?.$desc) result[locale] = value.$description || value.$desc;
				else if (typeof value === "string") result[locale] = value;
			}
			return result;
		}
		function getInner(value) {
			return value?.$value ?? value?.$inner;
		}
		function extractKeys(data) {
			return filterKeys(data ?? {}, (key) => !key.startsWith("$"));
		}
		Schema.prototype.i18n = function i18n(messages) {
			const schema = Schema(this);
			const desc = mergeDesc(schema.meta.description, messages);
			if (Object.keys(desc).length) schema.meta.description = desc;
			if (schema.dict) schema.dict = mapValues(schema.dict, (inner, key) => {
				return inner.i18n(mapValues(messages, (data) => getInner(data)?.[key] ?? data?.[key]));
			});
			if (schema.list) schema.list = schema.list.map((inner, index) => {
				return inner.i18n(mapValues(messages, (data = {}) => {
					if (Array.isArray(getInner(data))) return getInner(data)[index];
					if (Array.isArray(data)) return data[index];
					return extractKeys(data);
				}));
			});
			if (schema.inner) schema.inner = schema.inner.i18n(mapValues(messages, (data) => {
				if (getInner(data)) return getInner(data);
				return extractKeys(data);
			}));
			if (schema.sKey) schema.sKey = schema.sKey.i18n(mapValues(messages, (data) => data?.$key));
			return schema;
		};
		Schema.prototype.extra = function extra(key, value) {
			const schema = Schema(this);
			schema.meta = {
				...schema.meta,
				[key]: value
			};
			return schema;
		};
		for (const key of [
			"required",
			"disabled",
			"collapse",
			"hidden",
			"loose"
		]) Object.assign(Schema.prototype, { [key](value = true) {
			const schema = Schema(this);
			schema.meta = {
				...schema.meta,
				[key]: value
			};
			return schema;
		} });
		Schema.prototype.deprecated = function deprecated() {
			const schema = Schema(this);
			schema.meta.badges ||= [];
			schema.meta.badges.push({
				text: "deprecated",
				type: "danger"
			});
			return schema;
		};
		Schema.prototype.experimental = function experimental() {
			const schema = Schema(this);
			schema.meta.badges ||= [];
			schema.meta.badges.push({
				text: "experimental",
				type: "warning"
			});
			return schema;
		};
		Schema.prototype.pattern = function pattern(regexp) {
			const schema = Schema(this);
			const pattern = pick(regexp, ["source", "flags"]);
			schema.meta = {
				...schema.meta,
				pattern
			};
			return schema;
		};
		Schema.prototype.simplify = function simplify(value) {
			if (deepEqual(value, this.meta.default, this.type === "dict")) return null;
			if (isNullable(value)) return value;
			if (this.type === "object" || this.type === "dict") {
				const result = {};
				for (const key in value) {
					const item = (this.type === "object" ? this.dict[key] : this.inner)?.simplify(value[key]);
					if (this.type === "dict" || !isNullable(item)) result[key] = item;
				}
				if (deepEqual(result, this.meta.default, this.type === "dict")) return null;
				return result;
			} else if (this.type === "array" || this.type === "tuple") {
				const result = [];
				value.forEach((value, index) => {
					const schema = this.type === "array" ? this.inner : this.list[index];
					const item = schema ? schema.simplify(value) : value;
					result.push(item);
				});
				return result;
			} else if (this.type === "intersect") {
				const result = {};
				for (const item of this.list) Object.assign(result, item.simplify(value));
				return result;
			} else if (this.type === "union") for (const schema of this.list) try {
				Schema.resolve(value, schema, {});
				return schema.simplify(value);
			} catch {}
			return value;
		};
		Schema.prototype.toString = function toString(inline) {
			return formatters[this.type]?.(this, inline) ?? `Schema<${this.type}>`;
		};
		Schema.prototype.role = function role(role, extra) {
			const schema = Schema(this);
			schema.meta = {
				...schema.meta,
				role,
				extra
			};
			return schema;
		};
		for (const key of [
			"default",
			"link",
			"comment",
			"description",
			"max",
			"min",
			"step"
		]) Object.assign(Schema.prototype, { [key](value) {
			const schema = Schema(this);
			schema.meta = {
				...schema.meta,
				[key]: value
			};
			return schema;
		} });
		const resolvers = {};
		Schema.extend = function extend(type, resolve) {
			resolvers[type] = resolve;
		};
		Schema.resolve = function resolve(data, schema, options = {}, strict = false) {
			if (!schema) return [data];
			if (options.ignore?.(data, schema)) return [data];
			if (isNullable(data) && schema.type !== "lazy") {
				if (schema.meta.required) throw new ValidationError(`missing required value`, options);
				let current = schema;
				let fallback = schema.meta.default;
				while (current?.type === "intersect" && isNullable(fallback)) {
					current = current.list[0];
					fallback = current?.meta.default;
				}
				if (isNullable(fallback)) return [data];
				data = clone(fallback);
			}
			const callback = resolvers[schema.type];
			if (!callback) throw new ValidationError(`unsupported type "${schema.type}"`, options);
			try {
				return callback(data, schema, options, strict);
			} catch (error) {
				if (!schema.meta.loose) throw error;
				return [schema.meta.default];
			}
		};
		Schema.from = function from(source) {
			if (isNullable(source)) return Schema.any();
			else if ([
				"string",
				"number",
				"boolean"
			].includes(typeof source)) return Schema.const(source).required();
			else if (source[kSchema]) return source;
			else if (typeof source === "function") switch (source) {
				case String: return Schema.string().required();
				case Number: return Schema.number().required();
				case Boolean: return Schema.boolean().required();
				case Function: return Schema.function().required();
				default: return Schema.is(source).required();
			}
			else throw new TypeError(`cannot infer schema from ${source}`);
		};
		Schema.lazy = function lazy(builder) {
			const toJSON = () => {
				if (!schema.inner[kSchema]) {
					schema.inner = schema.builder();
					schema.inner.meta = {
						...schema.meta,
						...schema.inner.meta
					};
				}
				return schema.inner.toJSON();
			};
			const schema = new Schema({
				type: "lazy",
				builder,
				inner: { toJSON }
			});
			return schema;
		};
		Schema.natural = function natural() {
			return Schema.number().step(1).min(0);
		};
		Schema.percent = function percent() {
			return Schema.number().step(.01).min(0).max(1).role("slider");
		};
		Schema.date = function date() {
			return Schema.union([Schema.is(Date), Schema.transform(Schema.string().role("datetime"), (value, options) => {
				const date = new Date(value);
				if (isNaN(+date)) throw new ValidationError(`invalid date "${value}"`, options);
				return date;
			}, true)]);
		};
		Schema.regExp = function regExp(flag = "") {
			return Schema.union([Schema.is(RegExp), Schema.transform(Schema.string().role("regexp", { flag }), (value, options) => {
				try {
					return new RegExp(value, flag);
				} catch (e) {
					throw new ValidationError(e.message, options);
				}
			}, true)]);
		};
		Schema.arrayBuffer = function arrayBuffer(encoding) {
			return Schema.union([
				Schema.is(ArrayBuffer),
				Schema.is(SharedArrayBuffer),
				Schema.transform(Schema.any(), (value, options) => {
					if (Binary.isSource(value)) return Binary.fromSource(value);
					throw new ValidationError(`expected ArrayBufferSource but got ${value}`, options);
				}, true),
				...encoding ? [Schema.transform(Schema.string(), (value, options) => {
					try {
						return encoding === "base64" ? Binary.fromBase64(value) : Binary.fromHex(value);
					} catch (e) {
						throw new ValidationError(e.message, options);
					}
				}, true)] : []
			]);
		};
		Schema.extend("lazy", (data, schema, options, strict) => {
			if (!schema.inner[kSchema]) {
				schema.inner = schema.builder();
				schema.inner.meta = {
					...schema.meta,
					...schema.inner.meta
				};
			}
			return Schema.resolve(data, schema.inner, options, strict);
		});
		Schema.extend("any", (data) => {
			return [data];
		});
		Schema.extend("never", (data, _, options) => {
			throw new ValidationError(`expected nullable but got ${data}`, options);
		});
		Schema.extend("const", (data, { value }, options) => {
			if (deepEqual(data, value)) return [value];
			throw new ValidationError(`expected ${value} but got ${data}`, options);
		});
		function checkWithinRange(data, meta, description, options, skipMin = false) {
			const { max = Infinity, min = -Infinity } = meta;
			if (data > max) throw new ValidationError(`expected ${description} <= ${max} but got ${data}`, options);
			if (data < min && !skipMin) throw new ValidationError(`expected ${description} >= ${min} but got ${data}`, options);
		}
		Schema.extend("string", (data, { meta }, options) => {
			if (typeof data !== "string") throw new ValidationError(`expected string but got ${data}`, options);
			if (meta.pattern) {
				const regexp = new RegExp(meta.pattern.source, meta.pattern.flags);
				if (!regexp.test(data)) throw new ValidationError(`expect string to match regexp ${regexp}`, options);
			}
			checkWithinRange(data.length, meta, "string length", options);
			return [data];
		});
		function decimalShift(data, digits) {
			const str = data.toString();
			if (str.includes("e")) return data * Math.pow(10, digits);
			const index = str.indexOf(".");
			if (index === -1) return data * Math.pow(10, digits);
			const frac = str.slice(index + 1);
			const integer = str.slice(0, index);
			if (frac.length <= digits) return +(integer + frac.padEnd(digits, "0"));
			return +(integer + frac.slice(0, digits) + "." + frac.slice(digits));
		}
		function isMultipleOf(data, min, step) {
			step = Math.abs(step);
			if (!/^\d+\.\d+$/.test(step.toString())) return (data - min) % step === 0;
			const index = step.toString().indexOf(".");
			const digits = step.toString().slice(index + 1).length;
			return Math.abs(decimalShift(data, digits) - decimalShift(min, digits)) % decimalShift(step, digits) === 0;
		}
		Schema.extend("number", (data, { meta }, options) => {
			if (typeof data !== "number") throw new ValidationError(`expected number but got ${data}`, options);
			checkWithinRange(data, meta, "number", options);
			const { step } = meta;
			if (step && !isMultipleOf(data, meta.min ?? 0, step)) throw new ValidationError(`expected number multiple of ${step} but got ${data}`, options);
			return [data];
		});
		Schema.extend("boolean", (data, _, options) => {
			if (typeof data === "boolean") return [data];
			throw new ValidationError(`expected boolean but got ${data}`, options);
		});
		Schema.extend("bitset", (data, { bits, meta }, options) => {
			let value = 0, keys = [];
			if (typeof data === "number") {
				value = data;
				for (const key in bits) if (data & bits[key]) keys.push(key);
			} else if (Array.isArray(data)) {
				keys = data;
				for (const key of keys) {
					if (typeof key !== "string") throw new ValidationError(`expected string but got ${key}`, options);
					if (key in bits) value |= bits[key];
				}
			} else throw new ValidationError(`expected number or array but got ${data}`, options);
			if (value === meta.default) return [value];
			return [value, keys];
		});
		Schema.extend("function", (data, _, options) => {
			if (typeof data === "function") return [data];
			throw new ValidationError(`expected function but got ${data}`, options);
		});
		Schema.extend("is", (data, { constructor }, options) => {
			if (typeof constructor === "function") {
				if (data instanceof constructor) return [data];
				throw new ValidationError(`expected ${constructor.name} but got ${data}`, options);
			} else {
				if (isNullable(data)) throw new ValidationError(`expected ${constructor} but got ${data}`, options);
				let prototype = Object.getPrototypeOf(data);
				while (prototype) {
					if (prototype.constructor?.name === constructor) return [data];
					prototype = Object.getPrototypeOf(prototype);
				}
				throw new ValidationError(`expected ${constructor} but got ${data}`, options);
			}
		});
		function property(data, key, schema, options) {
			try {
				const [value, adapted] = Schema.resolve(data[key], schema, {
					...options,
					path: [...options.path || [], key]
				});
				if (adapted !== void 0) data[key] = adapted;
				return value;
			} catch (e) {
				if (!options?.autofix) throw e;
				delete data[key];
				return schema.meta.default;
			}
		}
		Schema.extend("array", (data, { inner, meta }, options) => {
			if (!Array.isArray(data)) throw new ValidationError(`expected array but got ${data}`, options);
			checkWithinRange(data.length, meta, "array length", options, !isNullable(inner.meta.default));
			return [data.map((_, index) => property(data, index, inner, options))];
		});
		Schema.extend("dict", (data, { inner, sKey }, options, strict) => {
			if (!isPlainObject(data)) throw new ValidationError(`expected object but got ${data}`, options);
			const result = {};
			for (const key in data) {
				let rKey;
				try {
					rKey = Schema.resolve(key, sKey, options)[0];
				} catch (error) {
					if (strict) continue;
					throw error;
				}
				result[rKey] = property(data, key, inner, options);
				data[rKey] = data[key];
				if (key !== rKey) delete data[key];
			}
			return [result];
		});
		Schema.extend("tuple", (data, { list }, options, strict) => {
			if (!Array.isArray(data)) throw new ValidationError(`expected array but got ${data}`, options);
			const result = list.map((inner, index) => property(data, index, inner, options));
			if (strict) return [result];
			result.push(...data.slice(list.length));
			return [result];
		});
		function merge(result, data) {
			for (const key in data) {
				if (key in result) continue;
				result[key] = data[key];
			}
		}
		Schema.extend("object", (data, { dict }, options, strict) => {
			if (!isPlainObject(data)) throw new ValidationError(`expected object but got ${data}`, options);
			const result = {};
			for (const key in dict) {
				const value = property(data, key, dict[key], options);
				if (!isNullable(value) || key in data) result[key] = value;
			}
			if (!strict) merge(result, data);
			return [result];
		});
		Schema.extend("union", (data, { list, toString }, options, strict) => {
			const messages = [];
			for (const inner of list) try {
				return Schema.resolve(data, inner, options, strict);
			} catch (error) {
				messages.push(error);
			}
			throw new ValidationError(`expected ${toString()} but got ${JSON.stringify(data)}`, options);
		});
		Schema.extend("intersect", (data, { list, toString }, options, strict) => {
			if (!list.length) return [data];
			let result;
			for (const inner of list) {
				const value = Schema.resolve(data, inner, options, true)[0];
				if (isNullable(value)) continue;
				if (isNullable(result)) result = value;
				else if (typeof result !== typeof value) throw new ValidationError(`expected ${toString()} but got ${JSON.stringify(data)}`, options);
				else if (typeof value === "object") merge(result ??= {}, value);
				else if (result !== value) throw new ValidationError(`expected ${toString()} but got ${JSON.stringify(data)}`, options);
			}
			if (!strict && isPlainObject(data)) merge(result, data);
			return [result];
		});
		Schema.extend("transform", (data, { inner, callback, preserve }, options) => {
			const [result, adapted = data] = Schema.resolve(data, inner, options, true);
			if (preserve) return [callback(result)];
			else return [callback(result), callback(adapted)];
		});
		const formatters = {};
		function defineMethod(name, keys, format) {
			formatters[name] = format;
			Object.assign(Schema, { [name](...args) {
				const schema = new Schema({ type: name });
				keys.forEach((key, index) => {
					switch (key) {
						case "sKey":
							schema.sKey = args[index] ?? Schema.string();
							break;
						case "inner":
							schema.inner = Schema.from(args[index]);
							break;
						case "list":
							schema.list = args[index].map(Schema.from);
							break;
						case "dict":
							schema.dict = mapValues(args[index], Schema.from);
							break;
						case "bits":
							schema.bits = {};
							for (const key in args[index]) {
								if (typeof args[index][key] !== "number") continue;
								schema.bits[key] = args[index][key];
							}
							break;
						case "callback": {
							const callback = schema.callback = args[index];
							callback["toJSON"] ||= () => callback.toString();
							break;
						}
						case "constructor": {
							const constructor = schema.constructor = args[index];
							if (typeof constructor === "function") constructor["toJSON"] ||= () => constructor["name"];
							break;
						}
						default: schema[key] = args[index];
					}
				});
				if (name === "object" || name === "dict") schema.meta.default = {};
				else if (name === "array" || name === "tuple") schema.meta.default = [];
				else if (name === "bitset") schema.meta.default = 0;
				return schema;
			} });
		}
		defineMethod("is", ["constructor"], ({ constructor }) => {
			if (typeof constructor === "function") return constructor.name;
			else return constructor;
		});
		defineMethod("any", [], () => "any");
		defineMethod("never", [], () => "never");
		defineMethod("const", ["value"], ({ value }) => typeof value === "string" ? JSON.stringify(value) : value);
		defineMethod("string", [], () => "string");
		defineMethod("number", [], () => "number");
		defineMethod("boolean", [], () => "boolean");
		defineMethod("bitset", ["bits"], () => "bitset");
		defineMethod("function", [], () => "function");
		defineMethod("array", ["inner"], ({ inner }) => `${inner.toString(true)}[]`);
		defineMethod("dict", ["inner", "sKey"], ({ inner, sKey }) => `{ [key: ${sKey.toString()}]: ${inner.toString()} }`);
		defineMethod("tuple", ["list"], ({ list }) => `[${list.map((inner) => inner.toString()).join(", ")}]`);
		defineMethod("object", ["dict"], ({ dict }) => {
			if (Object.keys(dict).length === 0) return "{}";
			return `{ ${Object.entries(dict).map(([key, inner]) => {
				return `${key}${inner.meta.required ? "" : "?"}: ${inner.toString()}`;
			}).join(", ")} }`;
		});
		defineMethod("union", ["list"], ({ list }, inline) => {
			const result = list.map(({ toString: format }) => format()).join(" | ");
			return inline ? `(${result})` : result;
		});
		defineMethod("intersect", ["list"], ({ list }) => {
			return `${list.map((inner) => inner.toString(true)).join(" & ")}`;
		});
		defineMethod("transform", [
			"inner",
			"callback",
			"preserve"
		], ({ inner }, isInner) => inner.toString(isInner));
		//#endregion
		//#region lib/types/settings.js
		/** Durable settings section shared by the Host schema and the browser scope. */
		/** Settings namespace owned by the aurora beautify plugin. */
		const AURORA_SETTINGS_NAMESPACE = "ui-aurora";
		Schema.object({
			mode: Schema.string().default("aurora"),
			url: Schema.string().default("")
		});
		//#endregion
		//#region lib/types/client/index.js
		const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		function bytesToBase64(bytes) {
			let out = "";
			for (let i = 0; i < bytes.length; i += 3) {
				const b0 = bytes[i];
				const b1 = i + 1 < bytes.length ? bytes[i + 1] : 0;
				const b2 = i + 2 < bytes.length ? bytes[i + 2] : 0;
				out += B64[b0 >> 2];
				out += B64[(b0 & 3) << 4 | b1 >> 4];
				out += i + 1 < bytes.length ? B64[(b1 & 15) << 2 | b2 >> 6] : "=";
				out += i + 2 < bytes.length ? B64[b2 & 63] : "=";
			}
			return out;
		}
		function rgbToHsl(r, g, b) {
			r /= 255;
			g /= 255;
			b /= 255;
			const mx = Math.max(r, g, b);
			const mn = Math.min(r, g, b);
			const l = (mx + mn) / 2;
			if (mx === mn) return {
				h: 0,
				s: 0,
				l
			};
			const d = mx - mn;
			const s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
			let h;
			if (mx === r) h = (g - b) / d + (g < b ? 6 : 0);
			else if (mx === g) h = (b - r) / d + 2;
			else h = (r - g) / d + 4;
			return {
				h: h / 6,
				s,
				l
			};
		}
		function hslToRgb(h, s, l) {
			if (s === 0) {
				const v = Math.round(l * 255);
				return {
					r: v,
					g: v,
					b: v
				};
			}
			const hue2rgb = (p, q, t) => {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1 / 6) return p + (q - p) * 6 * t;
				if (t < 1 / 2) return q;
				if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
				return p;
			};
			const q = l < .5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;
			return {
				r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
				g: Math.round(hue2rgb(p, q, h) * 255),
				b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255)
			};
		}
		function hexOf(rgb) {
			const h = (n) => n.toString(16).padStart(2, "0");
			return "#" + h(rgb.r) + h(rgb.g) + h(rgb.b);
		}
		function hslCss(h, s, l) {
			return "hsl(" + Math.round(h * 360) + ", " + Math.round(s * 100) + "%, " + Math.round(l * 100) + "%)";
		}
		function mixRGB(base, accent, k) {
			return {
				r: Math.round(base.r * (1 - k) + accent.r * k),
				g: Math.round(base.g * (1 - k) + accent.g * k),
				b: Math.round(base.b * (1 - k) + accent.b * k)
			};
		}
		function BgColorAnalyzer(props) {
			return react.default.createElement("span", { style: { display: "none" } }, react.default.createElement("canvas", {
				ref: (node) => {
					props.box.canvas = node;
				},
				width: "32",
				height: "32"
			}), props.src === "" ? null : react.default.createElement("img", {
				src: props.src,
				onLoad: (e) => {
					props.onLoaded(props.box, e.currentTarget);
				}
			}));
		}
		function FileImport(props) {
			const t = props.t;
			const [busy, setBusy] = react.default.useState(false);
			const [err, setErr] = react.default.useState("");
			const [pendingSrc, setPendingSrc] = react.default.useState("");
			const [outMime, setOutMime] = react.default.useState("image/jpeg");
			const box = { canvas: void 0 };
			const fail = () => {
				setPendingSrc("");
				setBusy(false);
				setErr(t("invalidFile"));
			};
			const onChange = async (e) => {
				const input = e.target;
				const files = input.files;
				if (files === null || files.length === 0) return;
				const file = files[0];
				try {
					if (file.type !== "" && !/^image\//.test(file.type)) {
						setErr(t("invalidFile"));
						return;
					}
					if (file.size > props.maxFileSize) {
						setErr(t("fileTooLarge"));
						return;
					}
					setErr("");
					setBusy(true);
					const dataUrl = await props.fileToDataUrl(file);
					if (file.size <= props.optimizeAbove) {
						props.applyBg("custom", dataUrl);
						if (props.afterApply !== void 0) props.afterApply();
						setBusy(false);
						return;
					}
					setOutMime(file.type === "image/png" ? "image/png" : "image/jpeg");
					setPendingSrc(dataUrl);
				} catch (_reason) {
					fail();
				} finally {
					input.value = "";
				}
			};
			const onOptimized = (e) => {
				const img = e.currentTarget;
				const canvas = box.canvas;
				try {
					if (canvas === void 0) {
						fail();
						return;
					}
					const w = img.naturalWidth;
					const h = img.naturalHeight;
					if (w === 0 || h === 0) {
						fail();
						return;
					}
					const scale = Math.min(1, props.maxSide / Math.max(w, h));
					const tw = Math.max(1, Math.round(w * scale));
					const th = Math.max(1, Math.round(h * scale));
					canvas.width = tw;
					canvas.height = th;
					const ctx = canvas.getContext("2d");
					if (ctx === void 0 || ctx === null) {
						fail();
						return;
					}
					ctx.drawImage(img, 0, 0, tw, th);
					const out = outMime === "image/png" ? canvas.toDataURL("image/png") : canvas.toDataURL("image/jpeg", .88);
					props.applyBg("custom", out);
					if (props.afterApply !== void 0) props.afterApply();
					setPendingSrc("");
					setBusy(false);
				} catch (_reason) {
					fail();
				}
			};
			const status = busy ? pendingSrc === "" ? t("loading") : t("optimizing") : null;
			return react.default.createElement("div", { style: {
				display: "flex",
				flexDirection: "column",
				gap: 4
			} }, react.default.createElement("div", { style: {
				display: "flex",
				alignItems: "center",
				gap: 8
			} }, react.default.createElement("label", {
				htmlFor: props.labelId,
				className: "dshbg-btn dshbg-file-label"
			}, t("importLabel")), react.default.createElement("input", {
				id: props.labelId,
				type: "file",
				accept: "image/*",
				style: { display: "none" },
				onChange
			}), status === null ? null : react.default.createElement("span", { className: "dshbg-note" }, status)), react.default.createElement("div", { className: "dshbg-note" }, t("optimizeNote")), err === "" ? null : react.default.createElement("div", { className: "dshbg-error" }, err), react.default.createElement("span", { style: { display: "none" } }, react.default.createElement("canvas", { ref: (node) => {
				box.canvas = node;
			} }), pendingSrc === "" ? null : react.default.createElement("img", {
				src: pendingSrc,
				onLoad: onOptimized,
				onError: () => {
					fail();
				}
			})));
		}
		function SettingsPanel(props) {
			const t = props.t;
			const state = props.state;
			const [mode, setMode] = react.default.useState(state.mode);
			const [url, setUrl] = react.default.useState(state.url);
			const [error, setError] = react.default.useState("");
			const [gen, setGen] = react.default.useState(0);
			const refresh = () => setGen((v) => v + 1);
			const pick = (key) => {
				setError("");
				if (key === "custom") {
					const clean = url.trim();
					if (clean === "") {
						setMode("custom");
						return;
					}
					props.applyBg("custom", clean);
					setMode("custom");
					refresh();
					return;
				}
				props.applyBg(key, "");
				setMode(key);
				refresh();
			};
			const applyCustom = () => {
				const clean = url.trim();
				if (!/^(https?:\/\/|data:image\/)/i.test(clean)) {
					setError(t("invalidUrl"));
					return;
				}
				setError("");
				props.applyBg("custom", clean);
				setMode("custom");
				refresh();
			};
			const reset = () => {
				setError("");
				setUrl("");
				setMode("aurora");
				props.applyBg("aurora", "");
				refresh();
			};
			const previews = props.previews;
			const customCss = state.url !== "" ? "url(\"" + props.sanitizeUrl(state.url) + "\") center / cover" : previews.placeholder;
			const chips = [
				{
					key: "aurora",
					label: "Aurora",
					css: previews.aurora
				},
				{
					key: "sunset",
					label: "Sunset",
					css: previews.sunset
				},
				{
					key: "ocean",
					label: "Ocean",
					css: previews.ocean
				},
				{
					key: "none",
					label: t("none"),
					css: previews.none
				},
				{
					key: "custom",
					label: t("custom"),
					css: customCss
				}
			].map((chip) => {
				const active = mode === chip.key;
				return react.default.createElement("button", {
					key: chip.key,
					className: "dshbg-chip" + (active ? " dshbg-chip-active" : ""),
					onClick: () => pick(chip.key),
					style: {
						width: 104,
						textAlign: "left",
						padding: 8
					}
				}, react.default.createElement("div", {
					className: "dshbg-chip-preview",
					style: {
						background: chip.css,
						backgroundSize: "cover",
						backgroundPosition: "center"
					}
				}), react.default.createElement("span", { className: "dshbg-chip-label" }, chip.label));
			});
			const accent = state.accent;
			const accentRow = accent === null ? react.default.createElement("div", { className: "dshbg-note" }, t("accentNone")) : react.default.createElement("div", { style: {
				display: "flex",
				alignItems: "center",
				gap: 8
			} }, react.default.createElement("span", { style: {
				width: 16,
				height: 16,
				borderRadius: 5,
				background: "#" + accent.hex,
				border: "1px solid var(--dsw-alias-border-l2)",
				display: "inline-block"
			} }), react.default.createElement("span", { className: "dshbg-hint" }, t("accentLabel") + " " + accent.hex));
			return react.default.createElement("div", { style: {
				display: "flex",
				flexDirection: "column",
				gap: 18,
				maxWidth: 560
			} }, react.default.createElement("div", null, react.default.createElement("div", { className: "dshbg-title" }, t("title")), react.default.createElement("div", { className: "dshbg-hint" }, t("hint"))), react.default.createElement("div", { style: {
				display: "flex",
				gap: 10,
				flexWrap: "wrap"
			} }, chips), react.default.createElement("div", { style: {
				display: "flex",
				gap: 8
			} }, react.default.createElement("input", {
				className: "dshbg-input",
				value: url,
				placeholder: t("urlPlaceholder"),
				onChange: (e) => setUrl(e.target.value),
				onKeyDown: (e) => {
					if (e.key === "Enter") applyCustom();
				}
			}), react.default.createElement("button", {
				className: "dshbg-btn dshbg-btn-primary",
				onClick: applyCustom
			}, t("apply"))), react.default.createElement(FileImport, {
				labelId: "dshbg-file-in-s",
				t,
				fileToDataUrl: props.fileToDataUrl,
				applyBg: props.applyBg,
				afterApply: refresh,
				maxFileSize: props.maxFileSize,
				optimizeAbove: props.optimizeAbove,
				maxSide: props.maxSide
			}), accentRow, error === "" ? null : react.default.createElement("div", { className: "dshbg-error" }, error), react.default.createElement("div", { style: {
				display: "flex",
				justifyContent: "flex-end"
			} }, react.default.createElement("button", {
				className: "dshbg-btn",
				onClick: reset
			}, t("reset"))), react.default.createElement("div", { className: "dshbg-note" }, t("persistNote")), react.default.createElement(BgColorAnalyzer, {
				box: props.analyzeBox,
				src: state.mode === "custom" ? state.url : "",
				onLoaded: props.onAnalyzed
			}));
		}
		function QuickBg(props) {
			const t = props.t;
			const state = props.state;
			const [open, setOpen] = react.default.useState(false);
			const [anchor, setAnchor] = react.default.useState({
				left: 0,
				top: 0
			});
			const [url, setUrl] = react.default.useState(state.url);
			const [error, setError] = react.default.useState("");
			const [gen, setGen] = react.default.useState(0);
			const refresh = () => setGen((v) => v + 1);
			const toggle = (e) => {
				if (open) {
					setOpen(false);
					return;
				}
				const rect = e.currentTarget.getBoundingClientRect();
				setAnchor({
					left: rect.left,
					top: rect.top
				});
				setUrl(state.url);
				setError("");
				setOpen(true);
			};
			const pick = (key) => {
				setError("");
				if (key === "custom") {
					const clean = url.trim();
					if (clean === "") return;
					props.applyBg("custom", clean);
					setOpen(false);
					refresh();
					return;
				}
				props.applyBg(key, "");
				setOpen(false);
				refresh();
			};
			const applyCustom = () => {
				const clean = url.trim();
				if (!/^(https?:\/\/|data:image\/)/i.test(clean)) {
					setError(t("invalidUrl"));
					return;
				}
				setError("");
				props.applyBg("custom", clean);
				setOpen(false);
				refresh();
			};
			const previews = props.previews;
			const customCss = state.url !== "" ? "url(\"" + props.sanitizeUrl(state.url) + "\") center / cover" : previews.placeholder;
			const chips = [
				{
					key: "aurora",
					label: "Aurora",
					css: previews.aurora
				},
				{
					key: "sunset",
					label: "Sunset",
					css: previews.sunset
				},
				{
					key: "ocean",
					label: "Ocean",
					css: previews.ocean
				},
				{
					key: "none",
					label: t("none"),
					css: previews.none
				},
				{
					key: "custom",
					label: t("custom"),
					css: customCss
				}
			].map((chip) => {
				const active = state.mode === chip.key;
				return react.default.createElement("button", {
					key: chip.key,
					className: "dshbg-chip" + (active ? " dshbg-chip-active" : ""),
					onClick: () => pick(chip.key),
					style: {
						width: 88,
						textAlign: "left",
						padding: 6
					}
				}, react.default.createElement("div", {
					className: "dshbg-chip-preview",
					style: {
						background: chip.css,
						backgroundSize: "cover",
						backgroundPosition: "center",
						height: 28
					}
				}), react.default.createElement("span", { className: "dshbg-chip-label" }, chip.label));
			});
			const button = react.default.createElement("button", {
				className: props.wide ? "dshbg-quick" : "dshbg-quick dshbg-quick-rail",
				onClick: toggle,
				title: t("quickBg"),
				"aria-label": t("quickBg")
			}, react.default.createElement("span", { style: { lineHeight: 1 } }, "🎨"), props.wide ? react.default.createElement("span", { className: "dshbg-quick-label" }, t("quickBg")) : null);
			const analyzer = react.default.createElement(BgColorAnalyzer, {
				box: props.analyzeBox,
				src: state.mode === "custom" ? state.url : "",
				onLoaded: props.onAnalyzed
			});
			if (!open) return react.default.createElement("div", { style: { display: "inline-flex" } }, button, analyzer);
			return react.default.createElement("div", { style: { display: "inline-flex" } }, button, analyzer, react.default.createElement("div", {
				style: {
					position: "fixed",
					inset: 0,
					zIndex: 60,
					top: 0,
					left: 0
				},
				onClick: () => setOpen(false)
			}), react.default.createElement("div", {
				className: "dshbg-pop",
				style: {
					position: "fixed",
					left: anchor.left,
					bottom: "calc(100vh - " + anchor.top + "px)",
					zIndex: 61,
					width: 300
				}
			}, react.default.createElement("div", { className: "dshbg-title" }, t("quickTitle")), react.default.createElement("div", { style: {
				display: "flex",
				gap: 8,
				flexWrap: "wrap"
			} }, chips), react.default.createElement("div", { style: {
				display: "flex",
				gap: 8
			} }, react.default.createElement("input", {
				className: "dshbg-input",
				value: url,
				placeholder: t("urlPlaceholder"),
				autoFocus: true,
				onChange: (e) => setUrl(e.target.value),
				onKeyDown: (e) => {
					if (e.key === "Enter") applyCustom();
				}
			}), react.default.createElement("button", {
				className: "dshbg-btn dshbg-btn-primary",
				onClick: applyCustom
			}, t("apply"))), react.default.createElement(FileImport, {
				labelId: "dshbg-file-in-q",
				t,
				fileToDataUrl: props.fileToDataUrl,
				applyBg: props.applyBg,
				afterApply: () => {
					setOpen(false);
					refresh();
				},
				maxFileSize: props.maxFileSize,
				optimizeAbove: props.optimizeAbove,
				maxSide: props.maxSide
			}), error === "" ? null : react.default.createElement("div", { className: "dshbg-error" }, error), react.default.createElement("div", { className: "dshbg-note" }, t("persistNote"))));
		}
		/**
		* Required client services (cordis fiber inject): theme/slots are hard deps;
		* locale for bilingual copy; settingsScope for the durable background choice.
		*/
		/* 背景配置：由 web 端 profile 迁移过来（mode + data URL）。 */
		const AURORA_BAKED_CONFIG = {"mode": "aurora", "url": "", "blur": 0, "panelAlpha": 18};
		const inject = [
			"slots",
			"theme",
			"locale"
		];
		/**
		* Browser half: apply the glass theme, the background layer, and the two
		* settings surfaces; everything persists through the settings service, so a
		* page refresh restores it immediately.
		* @param ctx - client cordis context.
		*/
		function apply(ctx) {
			const theme = ctx.theme;
			const slots = ctx.slots;
			const PRESET_ACCENT = {
				aurora: {
					r: 77,
					g: 107,
					b: 254
				},
				sunset: {
					r: 255,
					g: 122,
					b: 89
				},
				ocean: {
					r: 56,
					g: 189,
					b: 248
				}
			};
			const state = {
				mode: "aurora",
				url: "",
				accent: null,
				/** 背景模糊半径（px）。0 = 不模糊；可在 settings.json 里调。 */
				blur: 0,
				/** 面板透明度总开关（0~90）。数值越小面板越透、背景图越清楚。 */
				panelAlpha: 18,
				/** 每个「框」单独指定的透明度（0~95）；null 表示按 panelAlpha 派生。 */
				alphas: null
			};
			const analyzeBox = { canvas: void 0 };
			const MAX_FILE_BYTES = 200 * 1024 * 1024;
			const OPTIMIZE_ABOVE = 6 * 1024 * 1024;
			const MAX_SIDE = 5120;
			const insertCss = (css) => {
				const tag = document.createElement("style");
				tag.setAttribute("data-plugin-css", "dsh-client-ui-aurora");
				tag.textContent = css;
				document.head.appendChild(tag);
				return () => {
					tag.remove();
				};
			};
			ctx.effect(() => {
				return () => {};
			}, "ui-aurora: token layer cleanup");
			/* 可单独调节的表面。settings.json 的 alpha 里给了哪个就覆盖哪个，
			 * 没给的仍按 panelAlpha 派生，保持原来的层级关系。 */
			const SURFACES = ["base", "layer", "layer2", "sidebar", "input", "button", "selector"];
			const resolveAlphas = () => {
				const pA = Math.max(0, Math.min(90,
					typeof state.panelAlpha === "number" ? state.panelAlpha : 18)) / 100;
				const derived = {
					base: pA,
					layer: Math.min(.95, pA + .22),
					layer2: Math.min(.95, pA + .16),
					sidebar: Math.max(.02, pA * .6),
					input: Math.min(.95, pA + .22),
					button: Math.min(.95, pA + .24),
					selector: Math.min(.95, pA + .24)
				};
				const custom = state.alphas && typeof state.alphas === "object" ? state.alphas : {};
				const out = {};
				for (const key of SURFACES) {
					const raw = custom[key];
					out[key] = typeof raw === "number" && isFinite(raw)
						? Math.max(0, Math.min(95, raw)) / 100
						: derived[key];
				}
				return out;
			};
			const writeTokens = (mode) => {
				const image = mode === "custom";
				/* 面板透明度总开关：settings.json 里的 panelAlpha（0~90），
				 * 它决定主内容列的 alpha，其余表面按固定偏移派生，保持层级关系。
				 *   主内容列 = panelAlpha
				 *   卡片/输入框 = panelAlpha + 22
				 *   次级面板   = panelAlpha + 16
				 *   侧栏/外框  = panelAlpha × 0.6
				 * 默认 18（比 web 的 30 更透，因为 0.2.1 把整个内容列包成了一整块面板）。 */
				const A = image ? resolveAlphas() : null;
				const baseA = image ? A.base : .62;
				const layerA = image ? A.layer : .9;
				const layer2A = image ? A.layer2 : .86;
				const sideA = image ? A.sidebar : .3;
				const inputA_L = image ? A.input : .68;
				const inputA_D = image ? Math.max(.02, A.input - .06) : .58;
				const btnA_L = image ? A.button : .52;
				const btnA_D = image ? Math.max(.02, A.button - .06) : .46;
				const btnHoverA_L = image ? .58 : .68;
				const btnHoverA_D = image ? .5 : .6;
				const selA_L = image ? A.selector : .52;
				const selA_D = image ? Math.max(.02, A.selector - .06) : .46;
				const selHoverA_L = image ? .58 : .66;
				const selHoverA_D = image ? .5 : .6;
				const sendA_L = image ? .62 : .72;
				const sendA_D = image ? .56 : .66;
				const sendHoverA_L = image ? .74 : .84;
				const sendHoverA_D = image ? .68 : .78;
				let brandLight = "#4d6bfe";
				let brandDark = "#7d95ff";
				let borderLight = "rgba(77, 107, 254, 0.14)";
				let borderLight2 = "rgba(77, 107, 254, 0.26)";
				let borderDark = "rgba(125, 149, 255, 0.16)";
				let borderDark2 = "rgba(125, 149, 255, 0.30)";
				let sendLight = "rgba(61, 99, 254, " + sendA_L + ")";
				let sendDark = "rgba(103, 158, 254, " + sendA_D + ")";
				let sendHoverLight = "rgba(73, 108, 254, " + sendHoverA_L + ")";
				let sendHoverDark = "rgba(132, 162, 254, " + sendHoverA_D + ")";
				let baseLight = {
					r: 239,
					g: 243,
					b: 252
				};
				let baseDark = {
					r: 11,
					g: 15,
					b: 27
				};
				let sideLight = {
					r: 246,
					g: 249,
					b: 255
				};
				let sideDark = {
					r: 9,
					g: 13,
					b: 24
				};
				if (state.accent !== null) {
					const hsl = rgbToHsl(state.accent.r, state.accent.g, state.accent.b);
					const sLight = Math.min(.85, Math.max(.45, hsl.s * .75 + .15));
					const sDark = Math.min(.72, Math.max(.35, hsl.s * .65 + .1));
					brandLight = hslCss(hsl.h, sLight, .48);
					brandDark = hslCss(hsl.h, sDark, .67);
					const bl = hslToRgb(hsl.h, sLight, .48);
					const bd = hslToRgb(hsl.h, sDark, .67);
					borderLight = "rgba(" + bl.r + ", " + bl.g + ", " + bl.b + ", 0.14)";
					borderLight2 = "rgba(" + bl.r + ", " + bl.g + ", " + bl.b + ", 0.26)";
					borderDark = "rgba(" + bd.r + ", " + bd.g + ", " + bd.b + ", 0.16)";
					borderDark2 = "rgba(" + bd.r + ", " + bd.g + ", " + bd.b + ", 0.30)";
					sendLight = "rgba(" + bl.r + ", " + bl.g + ", " + bl.b + ", " + sendA_L + ")";
					sendDark = "rgba(" + bd.r + ", " + bd.g + ", " + bd.b + ", " + sendA_D + ")";
					sendHoverLight = "rgba(" + bl.r + ", " + bl.g + ", " + bl.b + ", " + sendHoverA_L + ")";
					sendHoverDark = "rgba(" + bd.r + ", " + bd.g + ", " + bd.b + ", " + sendHoverA_D + ")";
					baseLight = mixRGB(baseLight, state.accent, .1);
					baseDark = mixRGB(baseDark, state.accent, .1);
					sideLight = mixRGB(sideLight, state.accent, .12);
					sideDark = mixRGB(sideDark, state.accent, .06);
				}
				theme.overrideTokens("dsh-beautify", {
					/* 0.2.1 的玻璃面板/菜单用 --dsw-menu-backdrop-filter: blur(40px) saturate(150%)
					 * 把背后的内容糊成磨砂面（不是本插件的背景层造成的）。
					 * 置为 none 后背景图在面板后面依然清晰可见。 */
					"--dsw-menu-backdrop-filter": {
						light: "none",
						dark: "none"
					},
					"--dsw-alias-brand-primary": {
						light: brandLight,
						dark: brandDark
					},
					"--dsw-alias-bg-base": {
						light: "rgba(" + baseLight.r + ", " + baseLight.g + ", " + baseLight.b + ", " + baseA + ")",
						dark: "rgba(" + baseDark.r + ", " + baseDark.g + ", " + baseDark.b + ", " + baseA + ")"
					},
					"--dsw-alias-bg-layer-1": {
						light: "rgba(255, 255, 255, " + layerA + ")",
						dark: "rgba(22, 28, 46, " + layerA + ")"
					},
					"--dsw-alias-bg-layer-2": {
						light: "rgba(249, 251, 255, " + layer2A + ")",
						dark: "rgba(16, 21, 36, " + layer2A + ")"
					},
					"--dsw-alias-bg-overlay": {
						light: "rgba(255, 255, 255, 0.97)",
						dark: "rgba(26, 32, 52, 0.97)"
					},
					"--dsw-alias-border-l1": {
						light: borderLight,
						dark: borderDark
					},
					"--dsw-alias-border-l2": {
						light: borderLight2,
						dark: borderDark2
					},
					"--dsw-specific-sidebar-fill": {
						light: "rgba(" + sideLight.r + ", " + sideLight.g + ", " + sideLight.b + ", " + sideA + ")",
						dark: "rgba(" + sideDark.r + ", " + sideDark.g + ", " + sideDark.b + ", " + sideA + ")"
					},
					"--dsw-specific-input-major": {
						light: "rgba(255, 255, 255, " + inputA_L + ")",
						dark: "rgba(20, 27, 44, " + inputA_D + ")"
					},
					"--dsw-alias-button-elevated-fill": {
						light: "rgba(255, 255, 255, " + btnA_L + ")",
						dark: "rgba(22, 29, 46, " + btnA_D + ")"
					},
					"--dsw-alias-button-floating-hover": {
						light: "rgba(255, 255, 255, " + btnHoverA_L + ")",
						dark: "rgba(36, 45, 66, " + btnHoverA_D + ")"
					},
					"--dsw-alias-button-info-fill": {
						light: sendLight,
						dark: sendDark
					},
					"--dsw-alias-button-info-hover": {
						light: sendHoverLight,
						dark: sendHoverDark
					},
					"--dsw-specific-selector": {
						light: "rgba(255, 255, 255, " + selA_L + ")",
						dark: "rgba(28, 36, 56, " + selA_D + ")"
					},
					"--dsw-alias-interactive-bg-hover-solid": {
						light: "rgba(255, 255, 255, " + selHoverA_L + ")",
						dark: "rgba(40, 50, 72, " + selHoverA_D + ")"
					},
					"--dsw-alias-interactive-bg-hover": {
						light: "rgba(0, 0, 0, 0.06)",
						dark: "rgba(255, 255, 255, 0.08)"
					}
				});
			};
			writeTokens("aurora");
			const presets = {
				aurora: {
					light: "radial-gradient(1100px 680px at 10% -12%, rgba(77,107,254,0.34), transparent 62%), radial-gradient(950px 750px at 92% 8%, rgba(150,110,255,0.26), transparent 58%), radial-gradient(900px 720px at 50% 112%, rgba(56,189,248,0.24), transparent 62%), #e9eefb",
					dark: "radial-gradient(1100px 680px at 10% -12%, rgba(77,107,254,0.30), transparent 62%), radial-gradient(950px 750px at 92% 8%, rgba(150,110,255,0.22), transparent 58%), radial-gradient(900px 720px at 50% 112%, rgba(56,189,248,0.16), transparent 62%), #0a0f1d"
				},
				sunset: {
					light: "radial-gradient(1100px 680px at 12% -10%, rgba(255,150,90,0.34), transparent 62%), radial-gradient(950px 780px at 90% 12%, rgba(255,85,120,0.24), transparent 58%), radial-gradient(900px 720px at 45% 112%, rgba(120,80,255,0.22), transparent 62%), #fdeee9",
					dark: "radial-gradient(1100px 680px at 12% -10%, rgba(255,140,80,0.26), transparent 62%), radial-gradient(950px 780px at 90% 12%, rgba(255,85,120,0.18), transparent 58%), radial-gradient(900px 720px at 45% 112%, rgba(150,100,255,0.16), transparent 62%), #160d12"
				},
				ocean: {
					light: "radial-gradient(1100px 680px at 10% -12%, rgba(56,189,248,0.30), transparent 62%), radial-gradient(950px 750px at 92% 8%, rgba(45,212,191,0.22), transparent 58%), radial-gradient(900px 720px at 50% 112%, rgba(59,130,246,0.24), transparent 62%), #e8f4f8",
					dark: "radial-gradient(1100px 680px at 10% -12%, rgba(56,189,248,0.24), transparent 62%), radial-gradient(950px 750px at 92% 8%, rgba(45,212,191,0.16), transparent 58%), radial-gradient(900px 720px at 50% 112%, rgba(59,130,246,0.18), transparent 62%), #081218"
				}
			};
			const previews = {
				aurora: "linear-gradient(135deg, #4d6bfe, #966eff 55%, #38bdf8)",
				sunset: "linear-gradient(135deg, #ff8a5c, #ff5578 55%, #7850ff)",
				ocean: "linear-gradient(135deg, #38bdf8, #2dd4bf 55%, #3b82f6)",
				none: "linear-gradient(135deg, #d7dde9, #aeb7ca)",
				placeholder: "repeating-linear-gradient(45deg, #8a93a8 0px, #8a93a8 6px, #aeb6c8 6px, #aeb6c8 12px)"
			};
			const sanitizeUrl = (s) => String(s).replace(/["'()\\\s]/g, "").trim();
			let currentSheet = null;
			/** 标题栏令牌样式表：让 Windows 自绘标题栏跟随面板透明度。 */
			let captionSheet = null;
			const buildCss = (mode, url) => {
				if (mode === "none") return {
					light: "#e7ebf5",
					dark: "#0d1220"
				};
				if (mode === "custom") {
					const clean = sanitizeUrl(url);
					if (clean === "") return presets.aurora;
					return {
						light: "linear-gradient(rgba(8, 12, 22, 0.10), rgba(8, 12, 22, 0.10)), url(\"" + clean + "\") center / cover no-repeat, #e7ebf5",
						dark: "linear-gradient(rgba(8, 12, 22, 0.10), rgba(8, 12, 22, 0.10)), url(\"" + clean + "\") center / cover no-repeat, #0d1220"
					};
				}
				return presets[mode] || presets.aurora;
			};
			/* 可调节（参考 dsh-skin-master）：配置走 Host 的 /aurora-bg 路由落盘，
			 * 不依赖 0.2.1 已移除的 settingsScope 服务。
			 *   GET  /aurora-bg/settings  读
			 *   POST /aurora-bg/settings  写（400ms 去抖）
			 *   POST /aurora-bg/asset     大图上传成资产，配置里只留同源路径 */
			const AURORA_API = "/aurora-bg";
			const AURORA_ASSET_MIN = 256 * 1024;
			const scope = (() => {
				let value = { mode: AURORA_BAKED_CONFIG.mode, url: AURORA_BAKED_CONFIG.url, blur: AURORA_BAKED_CONFIG.blur, panelAlpha: AURORA_BAKED_CONFIG.panelAlpha, alpha: null };
				const listeners = new Set();
				let timer = null;
				/* 首次 reload() 成功前不做 alpha 的清空写入，否则冷启动会把磁盘上的逐表面设置抹掉。 */
				let alphaReady = false;
				const notify = () => {
					listeners.forEach((cb) => {
						try { cb(); } catch (e) { /* 单个订阅者异常不影响其他 */ }
					});
				};
				const flush = () => {
					timer = null;
					fetch(AURORA_API + "/settings", {
						method: "POST",
						headers: { "content-type": "application/json" },
						body: JSON.stringify((() => {
							const payload = { mode: value.mode, url: value.url, blur: value.blur, panelAlpha: value.panelAlpha };
							/* 只有读过一次、或用户已经明确设过，才把这个字段发出去 —— 避免把 null 当成"清空" */
							if (alphaReady || value.alpha !== null) payload.alpha = value.alpha;
							return payload;
						})())
					}).catch(() => {});
				};
				const schedule = () => {
					if (timer) clearTimeout(timer);
					timer = setTimeout(flush, 400);
				};
				/* 大 data URL 上传成资产，返回同源路径；失败则原样保留。 */
				const toAsset = async (dataUrl) => {
					try {
						const comma = dataUrl.indexOf(",");
						if (comma < 0) return dataUrl;
						const mime = (dataUrl.slice(5, comma).split(";")[0]) || "image/jpeg";
						const ext = mime === "image/png" ? ".png" : mime === "image/webp" ? ".webp" : ".jpg";
						const binary = atob(dataUrl.slice(comma + 1));
						const bytes = new Uint8Array(binary.length);
						for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
						const name = "bg-" + Date.now() + ext;
						const res = await fetch(AURORA_API + "/asset?name=" + encodeURIComponent(name), {
							method: "POST",
							headers: { "content-type": mime },
							body: bytes
						});
						const json = await res.json();
						return json && json.ok && json.url ? json.url : dataUrl;
					} catch (e) {
						return dataUrl;
					}
				};
				/* 从 Host 重读配置；内容有变化才通知订阅者。轮询也走这里，
				 * 所以直接改 settings.json 后，几秒内就会生效，无需刷新页面。 */
				const reload = () => fetch(AURORA_API + "/settings")
					.then((r) => r.json())
					.then((json) => {
						const saved = json && json.ok ? json.value : null;
						if (!saved || typeof saved.mode !== "string") return;
						const next = {
							mode: saved.mode,
							url: typeof saved.url === "string" ? saved.url : "",
							blur: typeof saved.blur === "number" ? saved.blur : value.blur,
							panelAlpha: typeof saved.panelAlpha === "number" ? saved.panelAlpha : value.panelAlpha,
							alpha: saved.alpha !== null && typeof saved.alpha === "object" ? saved.alpha : null
						};
						alphaReady = true;
						if (JSON.stringify(next) === JSON.stringify(value)) return;
						value = next;
						notify();
					})
					.catch(() => {});
				reload();
				return {
					getSnapshot: () => ({ value: { mode: value.mode, url: value.url, blur: value.blur, panelAlpha: value.panelAlpha, alpha: value.alpha, reload } }),
					set: (key, next) => {
						if (key !== "mode" && key !== "url" && key !== "blur" && key !== "panelAlpha" && key !== "alpha") return;
						value = Object.assign({}, value,
							key === "mode" ? { mode: next }
								: key === "blur" ? { blur: next }
									: key === "panelAlpha" ? { panelAlpha: next }
										: key === "alpha" ? { alpha: next }
											: { url: next });
						if (key === "url" && typeof next === "string" && next.length > AURORA_ASSET_MIN && next.slice(0, 5) === "data:") {
							const pending = next;
							toAsset(next).then((url) => {
								if (value.url !== pending) return;
								value = Object.assign({}, value, { url });
								schedule();
							});
							return;
						}
						schedule();
					},
					subscribe: (cb) => {
						listeners.add(cb);
						return () => { listeners.delete(cb); };
					},
					reload
				};
			})();
			/* 热更新：改 settings.json 后最多 4 秒自动生效，不需要刷新页面。 */
			ctx.effect(() => {
				const handle = setInterval(() => { scope.reload(); }, 4000);
				return () => clearInterval(handle);
			}, "ui-aurora: settings poll");
			const readSaved = () => {
				const value = scope.getSnapshot().value;
				if (value === void 0 || value === null || typeof value !== "object") return null;
				const mode = value.mode;
				if (typeof mode !== "string") return null;
				const blurRaw = value.blur;
				const blur = typeof blurRaw === "number" && isFinite(blurRaw)
					? Math.max(0, Math.min(60, blurRaw))
					: state.blur;
				const alphaRaw = value.panelAlpha;
				const panelAlpha = typeof alphaRaw === "number" && isFinite(alphaRaw)
					? Math.max(0, Math.min(90, Math.round(alphaRaw)))
					: state.panelAlpha;
				/* 逐个表面的覆盖值：只收 SURFACES 里认识且为数字的键 */
				const perSurface = value.alpha;
				let alphas = null;
				if (perSurface !== null && typeof perSurface === "object") {
					const picked = {};
					for (const key of SURFACES) {
						const n = perSurface[key];
						if (typeof n === "number" && isFinite(n)) {
							picked[key] = Math.max(0, Math.min(95, Math.round(n)));
						}
					}
					if (Object.keys(picked).length > 0) alphas = picked;
				}
				return {
					mode,
					url: typeof value.url === "string" ? value.url : "",
					blur,
					panelAlpha,
					alphas
				};
			};
			/** 把逐表面配置写进 CSS 变量；标题栏随 sidebar 值一起变。 */
			const refreshCaption = () => {
				const sideAlphaCss = resolveAlphas().sidebar;
				if (captionSheet !== null) captionSheet();
				captionSheet = insertCss(
					":root{--dsw-specific-sidebar-fill:rgba(0,0,0,0)!important;}" +
					"body[data-ds-dark-theme]{--dsw-specific-sidebar-fill:rgba(0,0,0,0)!important;}" +
					"[data-slot=\"root\"],.BynINW_frame{--dsw-specific-sidebar-fill:rgba(239,243,252," + sideAlphaCss + ")!important;}" +
					"body[data-ds-dark-theme] [data-slot=\"root\"],body[data-ds-dark-theme] .BynINW_frame{--dsw-specific-sidebar-fill:rgba(9,13,24," + sideAlphaCss + ")!important;}"
				);
			};
			const applyBg = (mode, url) => {
				state.mode = mode;
				state.url = url === void 0 ? "" : String(url);
				if (mode === "none") state.accent = null;
				else if (mode !== "custom") state.accent = PRESET_ACCENT[mode] || null;
				else if (state.url === "") state.accent = null;
				else state.accent = null;
				writeTokens(state.mode);
				const css = buildCss(state.mode, state.url);
				if (currentSheet !== null) currentSheet();
				/* 背景模糊：只作用于 ::before 这一层，不影响任何界面元素。
				 * 同时放大一点点（scale）抵消模糊在四边产生的透明羽化。 */
				const blurPx = typeof state.blur === "number" && isFinite(state.blur)
					? Math.max(0, Math.min(60, state.blur))
					: 0;
				const layerFx = blurPx > 0
					? "filter:blur(" + blurPx + "px) saturate(1.06);transform:scale(" + (1 + Math.min(.08, blurPx / 400)).toFixed(3) + ");"
					: "";
				currentSheet = insertCss("[data-slot=\"root\"]::before{content:\"\";position:fixed;inset:0;z-index:-1;pointer-events:none;" + layerFx + "background:" + css.light + ";}body[data-ds-dark-theme] [data-slot=\"root\"]::before{background:" + css.dark + ";}");
				/* Windows 自绘标题栏（最小化/最大化/关闭那条）的颜色来自桌面端 preload：
				 *   探针 span 的 background-color: var(--dsw-specific-sidebar-fill)
				 *   → canvas 量色 → ipcRenderer.send('dsh-desktop:windows-appearance')
				 *   → 主进程 mainWindow.setTitleBarOverlay({ color, symbolColor })
				 * 所以把这个令牌在 :root 上覆盖掉，标题栏就会与面板同色同透明度；
				 * preload 挂了 MutationObserver 监听 body/head 变化，改完会自动同步，无需重启。
				 * 深色取与 --dsw-alias-bg-base 同族的 9,13,24，避免出现一条异色带。 */
				refreshCaption();
				scope.set("mode", state.mode);
				scope.set("url", state.url);
			};
			/* ---- 供可视化面板使用 ---- */
			const alphaSnapshot = () => {
				const a = resolveAlphas();
				const out = {};
				for (const key of SURFACES) out[key] = Math.round(a[key] * 100);
				return out;
			};
			const setAlpha = (key, value) => {
				if (SURFACES.indexOf(key) < 0) return;
				const v = Math.max(0, Math.min(95, Math.round(Number(value) || 0)));
				const next = Object.assign({}, state.alphas || {});
				next[key] = v;
				state.alphas = next;
				scope.set("alpha", next);
				writeTokens(state.mode);
				refreshCaption();
			};
			const setBlurValue = (value) => {
				const v = Math.max(0, Math.min(30, Math.round(Number(value) || 0)));
				state.blur = v;
				scope.set("blur", v);
				applyBg(state.mode, state.url);
			};
			const resetAlphas = () => {
				state.alphas = null;
				scope.set("alpha", null);
				applyBg(state.mode, state.url);
			};
			const onAnalyzed = (box, img) => {
				try {
					if (box.canvas === void 0) return;
					const canvas = box.canvas;
					const ctx2 = canvas.getContext("2d");
					if (ctx2 === void 0 || ctx2 === null) return;
					const size = canvas.width;
					ctx2.clearRect(0, 0, size, size);
					ctx2.drawImage(img, 0, 0, size, size);
					const data = ctx2.getImageData(0, 0, size, size).data;
					let r = 0, g = 0, b = 0, w = 0;
					for (let i = 0; i < data.length; i += 4) {
						const pr = data[i], pg = data[i + 1], pb = data[i + 2];
						const mx = Math.max(pr, pg, pb);
						const weight = .15 + (mx === 0 ? 0 : (mx - Math.min(pr, pg, pb)) / mx);
						r += pr * weight;
						g += pg * weight;
						b += pb * weight;
						w += weight;
					}
					if (w === 0) return;
					const hsl = rgbToHsl(r / w, g / w, b / w);
					if (hsl.s < .15) return;
					const rgb = hslToRgb(hsl.h, Math.min(.85, Math.max(.45, hsl.s * .75 + .15)), .55);
					state.accent = {
						r: rgb.r,
						g: rgb.g,
						b: rgb.b,
						hex: hexOf(rgb)
					};
					writeTokens(state.mode);
				} catch (_e) {}
			};
			const fileToDataUrl = async (file) => {
				const buf = await file.arrayBuffer();
				return "data:" + file.type + ";base64," + bytesToBase64(new Uint8Array(buf));
			};
			const DICTS = {
				en: {
					nav: "Background",
					quickBg: "Background",
					quickTitle: "Quick background",
					title: "Background & Appearance",
					hint: "Choose a preset, paste an image URL or import a local image. The accent follows the image main tone automatically.",
					urlPlaceholder: "https://example.com/wallpaper.jpg",
					apply: "Apply",
					reset: "Reset",
					none: "None",
					custom: "Custom",
					importLabel: "Import local image…",
					invalidUrl: "Please enter a valid image URL starting with https:// (or data:image/).",
					invalidFile: "Please choose an image file to use as the background.",
					fileTooLarge: "Image too large — please pick one under 200 MB.",
					loading: "Processing…",
					optimizing: "Optimizing high-def image…",
					optimizeNote: "Images over 6 MB are auto-optimized to high-definition (max side 5120 px).",
					accentLabel: "Accent:",
					accentNone: "Accent follows the image (fallback: brand blue).",
					persistNote: "Persisted automatically: the background is restored on the next open."
				},
				zh: {
					nav: "背景与外观",
					quickBg: "背景",
					quickTitle: "快速切换背景",
					title: "背景与外观",
					hint: "选择预设、粘贴图片链接或导入本地图片；界面强调色会自动跟随图片主色调。",
					urlPlaceholder: "https://example.com/wallpaper.jpg",
					apply: "应用",
					reset: "重置",
					none: "关闭",
					custom: "自定义",
					importLabel: "导入本地图片…",
					invalidUrl: "请输入有效的图片链接（https:// 或 data:image/ 开头）。",
					invalidFile: "请选择图片文件作为背景。",
					fileTooLarge: "图片过大，请选择 200MB 以内的图片。",
					loading: "处理中…",
					optimizing: "正在优化高清大图…",
					optimizeNote: "超过 6MB 的图片会自动优化为高清（最长边 5120px）。",
					accentLabel: "强调色：",
					accentNone: "强调色将跟随图片（默认品牌蓝）。",
					persistNote: "已自动持久化：下次打开会自动恢复当前背景。"
				}
			};
			const locale = ctx.locale;
			const t = (key) => {
				const value = (DICTS[locale === void 0 ? "en" : locale.getLocale().active] || DICTS.en)[key];
				return value === void 0 ? key : value;
			};
			/* 可视化调节面板：侧栏「🎛 外观」按钮 + 浮层滑块。
			 * 7 个透明度滑块分别对应主内容列 / 卡片 / 次级面板 / 侧栏 / 输入框 / 按钮 / 选中项，
			 * 外加一个背景模糊滑块；拖动即生效（写 CSS 变量）并自动 POST 保存。 */
			const ALPHA_ROWS = [
				["base", "主内容列"],
				["layer", "卡片 / 面板"],
				["layer2", "次级面板"],
				["sidebar", "侧栏 / 外框"],
				["input", "输入框"],
				["button", "按钮"],
				["selector", "选中项"]
			];
			function AlphaPanel(props) {
				const h = react.default.createElement;
				const [open, setOpen] = react.default.useState(false);
				const [vals, setVals] = react.default.useState(props.snapshot);
				const [blur, setBlur] = react.default.useState(props.blurValue);
				const onAlpha = (key) => (event) => {
					const v = Number(event.target.value);
					setVals(Object.assign({}, vals, { [key]: v }));
					props.setAlpha(key, v);
				};
				const onBlur = (event) => {
					const v = Number(event.target.value);
					setBlur(v);
					props.setBlurValue(v);
				};
				const rows = ALPHA_ROWS.map(([key, label]) => h("label", { key, className: "dshap-row" },
					h("span", { className: "dshap-name" }, label),
					h("input", {
						type: "range", min: 0, max: 95, step: 1,
						value: vals[key], className: "dshap-range",
						onChange: onAlpha(key),
						title: label + "：" + vals[key] + "%"
					}),
					h("span", { className: "dshap-val" }, vals[key] + "%")
				));
				rows.push(h("label", { key: "blur", className: "dshap-row" },
					h("span", { className: "dshap-name" }, "背景模糊"),
					h("input", {
						type: "range", min: 0, max: 30, step: 1,
						value: blur, className: "dshap-range",
						onChange: onBlur,
						title: "背景模糊：" + blur + "px"
					}),
					h("span", { className: "dshap-val" }, blur + "px")
				));
				return h("div", { className: "dshap-wrap" },
					h("button", {
						className: "dshbg-quick" + (open ? " dshbg-quick-on" : ""),
						onClick: () => setOpen(!open),
						title: "外观 / 透明度",
						"aria-label": "外观 / 透明度"
					}, h("span", { style: { lineHeight: 1 } }, "🎛"),
						h("span", { className: "dshbg-quick-label" }, "外观")),
					open ? h("div", { className: "dshap-panel" },
						h("div", { className: "dshap-title" }, "外观与透明度"),
						h("div", { className: "dshap-hint" }, "拖动即时生效，自动保存"),
						rows,
						h("div", { className: "dshap-actions" },
							h("button", {
								className: "dshbg-btn", type: "button",
								onClick: () => { props.reset(); setVals(props.snapshot()); }
							}, "重置为默认")
						)
					) : null
				);
			}
			const face = () => ({
				state,
				applyBg,
				t,
				previews,
				sanitizeUrl,
				fileToDataUrl,
				analyzeBox,
				onAnalyzed,
				maxFileSize: MAX_FILE_BYTES,
				optimizeAbove: OPTIMIZE_ABOVE,
				maxSide: MAX_SIDE
			});
			slots.inject("sidebar.footer.action", () => slots.register({
				name: "sidebar.footer.action",
				id: "dsh-bg-quick",
				order: 10,
				label: () => t("quickBg"),
				inject: face
			}, QuickBg));
			slots.inject("sidebar.footer.action", () => slots.register({
				name: "sidebar.footer.action",
				id: "dsh-alpha-panel",
				order: 11,
				label: () => "外观",
				inject: () => ({
					snapshot: alphaSnapshot,
					blurValue: () => Math.round(typeof state.blur === "number" ? state.blur : 0),
					setAlpha,
					setBlurValue,
					reset: resetAlphas
				})
			}, AlphaPanel));
			slots.inject("settings.section", () => slots.register({
				name: "settings.section",
				id: "dsh-appearance",
				order: 25,
				label: () => t("nav"),
				inject: face
			}, SettingsPanel));
			const sheet = insertCss(".dshbg-title{font-size:15px;font-weight:600;color:var(--dsw-alias-label-primary);margin-bottom:6px;}.dshbg-hint{font-size:12px;color:var(--dsw-alias-label-secondary);line-height:1.6;}.dshbg-note{font-size:11px;color:var(--dsw-alias-label-secondary);opacity:.75;}.dshbg-chip{cursor:pointer;border:1px solid var(--dsw-alias-border-l2);border-radius:12px;background:var(--dsw-alias-bg-layer-2);transition:border-color .15s ease,transform .15s ease;}.dshbg-chip:hover{border-color:var(--dsw-alias-brand-primary);transform:translateY(-1px);}.dshbg-chip-active{border-color:var(--dsw-alias-brand-primary);box-shadow:0 0 0 1px var(--dsw-alias-brand-primary);}.dshbg-chip-preview{border-radius:8px;height:52px;}.dshbg-chip-label{display:block;margin-top:6px;font-size:12px;color:var(--dsw-alias-label-secondary);text-align:center;}.dshbg-input{flex:1;min-width:0;padding:8px 12px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font-size:13px;outline:none;}.dshbg-input:focus{border-color:var(--dsw-alias-brand-primary);}.dshbg-btn{cursor:pointer;padding:8px 16px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font-size:13px;transition:filter .15s ease;}.dshbg-btn:hover{filter:brightness(1.06);}.dshbg-btn-primary{border:none;background:var(--dsw-alias-brand-primary);color:#fff;}.dshbg-error{font-size:12px;color:var(--dsw-alias-state-error-primary);}.dshbg-file-label{display:inline-block;text-align:center;}[data-slot=\"sidebar\"] > *{background:linear-gradient(160deg,rgba(255,255,255,0.05) 0%,rgba(255,255,255,0.015) 32%,rgba(0,0,0,0) 55%),linear-gradient(340deg,rgba(77,107,254,0.035),rgba(0,0,0,0) 45%);}body[data-ds-dark-theme] [data-slot=\"sidebar\"] > *{background:linear-gradient(160deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.01) 30%,rgba(0,0,0,0) 52%),linear-gradient(340deg,rgba(125,149,255,0.03),rgba(0,0,0,0) 45%);}.dshbg-quick{display:inline-flex;align-items:center;gap:6px;cursor:pointer;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);padding:6px 10px;font-size:12px;transition:border-color .15s ease;}.dshbg-quick:hover{border-color:var(--dsw-alias-brand-primary);}.dshbg-quick-label{white-space:nowrap;}.dshbg-quick-rail{padding:8px;justify-content:center;}.dshbg-pop{background:var(--dsw-alias-bg-overlay);border:1px solid var(--dsw-alias-border-l2);border-radius:14px;padding:16px;box-shadow:0 12px 40px rgba(0,0,0,.28);display:flex;flex-direction:column;gap:14px;box-sizing:border-box;}");
			ctx.effect(() => () => {
				sheet();
			}, "ui-aurora: component styles");
			/* 调节面板的样式：用应用自己的令牌，深浅主题都适配 */
			const panelSheet = insertCss(
				".dshap-wrap{position:relative;display:inline-flex;}" +
				".dshap-panel{position:fixed;left:12px;bottom:104px;z-index:60;width:268px;box-sizing:border-box;" +
					"padding:14px;border-radius:14px;border:1px solid var(--dsw-alias-border-l2);" +
					"background:var(--dsw-specific-menu);color:var(--dsw-alias-label-primary);" +
					"box-shadow:0 16px 48px rgba(0,0,0,.36);display:flex;flex-direction:column;gap:10px;}" +
				".dshap-title{font-size:13px;font-weight:600;}" +
				".dshap-hint{font-size:11px;opacity:.7;margin-top:-6px;}" +
				".dshap-row{display:grid;grid-template-columns:82px 1fr 46px;align-items:center;gap:8px;font-size:12px;}" +
				".dshap-name{white-space:nowrap;opacity:.9;}" +
				".dshap-val{text-align:right;font-variant-numeric:tabular-nums;opacity:.8;font-size:11px;}" +
				".dshap-range{width:100%;accent-color:var(--dsw-alias-brand-primary);cursor:pointer;}" +
				".dshap-actions{display:flex;justify-content:flex-end;padding-top:2px;}" +
				".dshbg-quick-on{border-color:var(--dsw-alias-brand-primary)!important;}"
			);
			ctx.effect(() => () => panelSheet(), "ui-aurora: alpha panel styles");
			const saved = readSaved();
			if (saved !== null) { state.blur = saved.blur; state.panelAlpha = saved.panelAlpha; state.alphas = saved.alphas; applyBg(saved.mode, saved.url); }
			ctx.effect(() => scope.subscribe(() => {
				const next = readSaved();
				if (next !== null && (next.mode !== state.mode || next.url !== state.url || next.blur !== state.blur || next.panelAlpha !== state.panelAlpha || JSON.stringify(next.alphas) !== JSON.stringify(state.alphas))) { state.blur = next.blur; state.panelAlpha = next.panelAlpha; state.alphas = next.alphas; applyBg(next.mode, next.url); }
			}), "ui-aurora: settings sync");
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map