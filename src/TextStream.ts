
/**
 * A generic interface for streaming processed text chunks from a `Response`.
 * @template ChunkType The processed chunk type to stream.
 */
export abstract class TextStreamInterface<ChunkType> {

    private stream: ReadableStream<string>

    /**
     * @param respBody A `Response`'s `body`.
     * @param textDecoderStream A custom text decoder stream to use.
     */
    constructor(
        respBody: NonNullable<Response['body']>,
        textDecoderStream = new TextDecoderStream()
    ) {

        this.stream = respBody.pipeThrough(
            textDecoderStream
        )

    }

    async *[Symbol.asyncIterator]() {

        const asyncIteratorSupported = Symbol.asyncIterator in this.stream

        const asyncIterableStream = asyncIteratorSupported ?
            this.stream :
            this.polyfillReadableStreamAsyncIterator(this.stream)

        for await (const chunk of asyncIterableStream) {

            const processedChunk = this.processChunk(chunk)

            if (processedChunk === null) { continue }

            yield processedChunk

        }

    }

    /** Process the chunk. Return `null` to skip it. */
    protected abstract processChunk(chunk: string): ChunkType | null

    /**
     * Polyfill `ReadableStream`'s async iterator for Safari.
     * @see https://caniuse.com/wf-async-iterable-streams
     */
    private polyfillReadableStreamAsyncIterator(stream: ReadableStream<string>) {

        return {

            async *[Symbol.asyncIterator](): ReadableStreamAsyncIterator<string> {

                const reader = stream.getReader()

                let result: ReadableStreamReadResult<string>

                while (
                    result = await reader.read(),
                    !result.done
                ) {

                    const chunk = result.value

                    yield chunk

                }

            }

        }

    }

}


/**
 * Stream text chunks from a `Response`.
 */
export class TextStream extends TextStreamInterface<string> {

    protected processChunk(chunk: string) {
        return chunk
    }

}
