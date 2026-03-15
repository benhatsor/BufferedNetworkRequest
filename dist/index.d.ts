/**
 * A generic interface for streaming processed text chunks from a `Response`.
 */
declare abstract class TextStreamInterface<ChunkType> {
    #private;
    constructor(respBody: NonNullable<Response['body']>, textDecoderStream?: TextDecoderStream);
    [Symbol.asyncIterator](): AsyncGenerator<Awaited<ChunkType & undefined> | Awaited<ChunkType & {}>, void, unknown>;
    abstract processChunk(chunk: string): ChunkType | null;
}
/**
 * Stream text chunks from a `Response`.
 */
declare class TextStream extends TextStreamInterface<string> {
    processChunk(chunk: string): string;
}

type ValidJSONObjects = object[];
/**
 * Gets valid objects in invalid JSON.
 */
declare class InvalidJSONParser {
    parse(jsonStr: string): ValidJSONObjects;
}
declare const _default: InvalidJSONParser;

/**
 * Stream JSON objects in chunks from a `Response`.
 */
declare class JSONObjectStream extends TextStreamInterface<ValidJSONObjects> {
    #private;
    processChunk(chunk: string): object[] | null;
}

export { _default as InvalidJSONParser, JSONObjectStream, TextStream, TextStreamInterface };
export type { ValidJSONObjects };
