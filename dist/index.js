/**
 * BufferedNetworkRequest
 * @license MIT
 */
//#region src/TextStream.ts
/**
* A generic interface for streaming processed text chunks from a `Response`.
* @template ChunkType The processed chunk type to stream.
*/
var TextStreamInterface = class {
	stream;
	/**
	* @param respBody A `Response`'s `body`.
	* @param textDecoderStream A custom text decoder stream to use.
	*/
	constructor(respBody, textDecoderStream = new TextDecoderStream()) {
		this.stream = respBody.pipeThrough(textDecoderStream);
	}
	async *[Symbol.asyncIterator]() {
		const asyncIterableStream = Symbol.asyncIterator in this.stream ? this.stream : this.polyfillReadableStreamAsyncIterator(this.stream);
		for await (const chunk of asyncIterableStream) {
			const processedChunk = this.processChunk(chunk);
			if (processedChunk === null) continue;
			yield processedChunk;
		}
	}
	/**
	* Polyfill `ReadableStream`'s async iterator for Safari.
	* @see https://caniuse.com/wf-async-iterable-streams
	*/
	polyfillReadableStreamAsyncIterator(stream) {
		return { async *[Symbol.asyncIterator]() {
			const reader = stream.getReader();
			let result;
			while (result = await reader.read(), !result.done) yield result.value;
		} };
	}
};
/**
* Stream text chunks from a `Response`.
*/
var TextStream = class extends TextStreamInterface {
	processChunk(chunk) {
		return chunk;
	}
};
//#endregion
//#region src/InvalidJSONParser.ts
/**
* Gets valid objects in invalid JSON.
*/
var InvalidJSONParser = class {
	parse(jsonStr) {
		let objNestingCounter = 0;
		let lastValidIndex = 0;
		for (let i = 0; i < jsonStr.length; i++) {
			const char = jsonStr[i];
			if (char === "{") {
				if (objNestingCounter === 0) lastValidIndex = i - 1;
				objNestingCounter++;
			}
			if (char === "}") objNestingCounter--;
		}
		let validJSONStr = jsonStr;
		if (objNestingCounter !== 0) validJSONStr = jsonStr.slice(0, lastValidIndex + 1);
		validJSONStr = validJSONStr.trim();
		if (validJSONStr.startsWith("[") && !validJSONStr.endsWith("]")) {
			if (validJSONStr.endsWith(",")) validJSONStr = validJSONStr.slice(0, -1);
			validJSONStr += "]";
		}
		let validJSONObjects = [];
		if (validJSONStr) {
			validJSONObjects = JSON.parse(validJSONStr);
			if (!Array.isArray(validJSONObjects)) validJSONObjects = [validJSONObjects];
		}
		return validJSONObjects;
	}
};
var InvalidJSONParser_default = new InvalidJSONParser();
//#endregion
//#region src/JSONObjectStream.ts
/**
* Stream JSON objects in chunks from a `Response`.
*/
var JSONObjectStream = class extends TextStreamInterface {
	fullJSONStr = "";
	lastValidJSONObjectCount = 0;
	processChunk(chunk) {
		this.fullJSONStr += chunk;
		const newValidJSONObjects = InvalidJSONParser_default.parse(this.fullJSONStr).slice(this.lastValidJSONObjectCount);
		if (newValidJSONObjects.length === 0) return null;
		this.lastValidJSONObjectCount += newValidJSONObjects.length;
		return newValidJSONObjects;
	}
};
//#endregion
export { InvalidJSONParser_default as InvalidJSONParser, JSONObjectStream, TextStream, TextStreamInterface };

//# sourceMappingURL=index.js.map