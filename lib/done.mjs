import { $app } from "./app.mjs";
import { Console } from "../polyfill/Console.mjs";
import { Lodash as _ } from "../polyfill/Lodash.mjs";
import { StatusTexts } from "../polyfill/StatusTexts.mjs";

/**
 * Complete the script execution
 *
 * @export
 * @param {object} object
 * @returns {void}
 */
export function done(object = {}) {
	switch ($app) {
		case "Surge":
			if (object.policy) _.set(object, "headers.X-Surge-Policy", object.policy);
			Console.log("🚩 执行结束!", `🕛 ${new Date().getTime() / 1000 - $script.startTime} 秒`);
			$done(object);
			break;
		case "Loon":
			if (object.policy) object.node = object.policy;
			Console.log("🚩 执行结束!", `🕛 ${(new Date() - $script.startTime) / 1000} 秒`);
			$done(object);
			break;
		case "Stash":
			if (object.policy) _.set(object, "headers.X-Stash-Selected-Proxy", encodeURI(object.policy));
			Console.log("🚩 执行结束!", `🕛 ${(new Date() - $script.startTime) / 1000} 秒`);
			$done(object);
			break;
		case "Egern":
			Console.log("🚩 执行结束!");
			$done(object);
			break;
		case "Shadowrocket":
			Console.log("🚩 执行结束!");
			$done(object);
			break;
		case "Quantumult X":
			if (object.policy) _.set(object, "opts.policy", object.policy);
			object = _.pick(object, ["status", "url", "headers", "body", "bodyBytes"]);
			switch (typeof object.status) {
				case "number":
					object.status = `HTTP/1.1 ${object.status} ${StatusTexts[object.status]}`;
					break;
				case "string":
				case "undefined":
					break;
				default:
					throw new TypeError(`${Function.name}: 参数类型错误, status 必须为数字或字符串`);
			}
			if (object.body instanceof ArrayBuffer) {
				object.bodyBytes = object.body;
				object.body = undefined;
			} else if (ArrayBuffer.isView(object.body)) {
				object.bodyBytes = object.body.buffer.slice(object.body.byteOffset, object.body.byteLength + object.body.byteOffset);
				object.body = undefined;
			} else if (object.body) object.bodyBytes = undefined;
			Console.log("🚩 执行结束!");
			$done(object);
			break;
		case "Node.js":
		default:
			Console.log("🚩 执行结束!");
			process.exit(1);
			break;
	}
}
