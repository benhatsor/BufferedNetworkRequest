/**
 * BufferedNetworkRequest
 * @license MIT
 */
//#region src/TextStream.d.ts
/**
 * A generic interface for streaming processed text chunks from a `Response`.
 * @template ChunkType The processed chunk type to stream.
 */
declare abstract class TextStreamInterface<ChunkType> {
  private stream;
  /**
   * @param respBody A `Response`'s `body`.
   * @param textDecoderStream A custom text decoder stream to use.
   */
  constructor(respBody: NonNullable<Response['body']>, textDecoderStream?: TextDecoderStream);
  [Symbol.asyncIterator](): AsyncGenerator<Awaited<ChunkType & undefined> | Awaited<ChunkType & {}>, void, unknown>;
  /** Process the chunk. Return `null` to skip it. */
  protected abstract processChunk(chunk: string): ChunkType | null;
  /**
   * Polyfill `ReadableStream`'s async iterator for Safari.
   * @see https://caniuse.com/wf-async-iterable-streams
   */
  private polyfillReadableStreamAsyncIterator;
}
/**
 * Stream text chunks from a `Response`.
 */
declare class TextStream extends TextStreamInterface<string> {
  protected processChunk(chunk: string): string;
}
//#endregion
//#region src/InvalidJSONParser.d.ts
type ValidJSONObjects = object[];
/**
 * Gets valid objects in invalid JSON.
 */
declare class InvalidJSONParser {
  parse(jsonStr: string): ValidJSONObjects;
}
declare const _default: InvalidJSONParser;
//#endregion
//#region src/JSONObjectStream.d.ts
/**
 * Stream JSON objects in chunks from a `Response`.
 */
declare class JSONObjectStream extends TextStreamInterface<ValidJSONObjects> {
  private fullJSONStr;
  private lastValidJSONObjectCount;
  protected processChunk(chunk: string): object[] | null;
}
//#endregion
export { _default as InvalidJSONParser, JSONObjectStream, TextStream, TextStreamInterface, ValidJSONObjects };
//# sourceMappingURL=index.d.ts.map