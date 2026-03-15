/**
 * A generic interface for streaming processed text chunks from a `Response`.
 */
class TextStreamInterface {
    #stream;
    constructor(respBody, textDecoderStream = new TextDecoderStream()) {
        this.#stream = respBody.pipeThrough(textDecoderStream);
    }
    async *[Symbol.asyncIterator]() {
        for await (const chunk of this.#stream) {
            const processedChunk = this.processChunk(chunk);
            if (processedChunk === null) {
                continue;
            }
            yield processedChunk;
        }
    }
}
/**
 * Stream text chunks from a `Response`.
 */
class TextStream extends TextStreamInterface {
    processChunk(chunk) {
        return chunk;
    }
}

/**
 * Gets valid objects in invalid JSON.
 */
class InvalidJSONParser {
    parse(jsonStr) {
        let objNestingCounter = 0;
        let lastValidIndex = 0;
        for (let i = 0; i < jsonStr.length; i++) {
            const char = jsonStr[i];
            // if opening a new object
            if (char === '{') {
                // if no objects are open
                if (objNestingCounter === 0) {
                    // save the last valid index
                    // so we'll be able to revert back to it
                    // if this object is invalid
                    lastValidIndex = i - 1;
                }
                objNestingCounter++;
            }
            if (char === '}') {
                objNestingCounter--;
            }
        }
        let validJSONStr = jsonStr;
        // if didn't close all objects
        if (objNestingCounter !== 0) {
            // get the string up to the last valid index
            validJSONStr = jsonStr.slice(0, lastValidIndex + 1);
        }
        // if there's an unclosed top-level array
        validJSONStr = validJSONStr.trim();
        if (validJSONStr.startsWith('[') &&
            !validJSONStr.endsWith(']')) {
            // if the string ends with a comma,
            // remove it
            if (validJSONStr.endsWith(',')) {
                validJSONStr = validJSONStr.slice(0, -1);
            }
            // close the top-level array
            validJSONStr += ']';
        }
        let validJSONObjects = [];
        if (validJSONStr) {
            validJSONObjects = JSON.parse(validJSONStr);
            // if got an object, wrap it in an array
            if (!Array.isArray(validJSONObjects)) {
                validJSONObjects = [validJSONObjects];
            }
        }
        return validJSONObjects;
    }
}
var InvalidJSONParser$1 = new InvalidJSONParser();

/**
 * Stream JSON objects in chunks from a `Response`.
 */
class JSONObjectStream extends TextStreamInterface {
    #fullJSONStr = '';
    #lastValidJSONObjectCount = 0;
    processChunk(chunk) {
        this.#fullJSONStr += chunk;
        // get valid JSON objects in full JSON string
        const validJSONObjects = InvalidJSONParser$1.parse(this.#fullJSONStr);
        // remove JSON objects we've already validated
        const newValidJSONObjects = validJSONObjects.slice(this.#lastValidJSONObjectCount);
        // if there are no new valid JSON objects, don't send an update
        if (newValidJSONObjects.length === 0) {
            return null;
        }
        this.#lastValidJSONObjectCount += newValidJSONObjects.length;
        return newValidJSONObjects;
    }
}

export { InvalidJSONParser$1 as InvalidJSONParser, JSONObjectStream, TextStream, TextStreamInterface };
//# sourceMappingURL=index.js.map
