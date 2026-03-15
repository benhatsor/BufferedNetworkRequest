
/**
 * A generic interface for streaming processed text chunks from a `Response`.
 */
export abstract class TextStreamInterface<ChunkType> {

    #stream: ReadableStream<string>

    constructor(
        respBody: NonNullable<Response['body']>,
        textDecoderStream = new TextDecoderStream()
    ) {

        this.#stream = respBody.pipeThrough(
            textDecoderStream
        )

    }

    async *[Symbol.asyncIterator]() {

        for await (const chunk of this.#stream) {

            const processedChunk = this.processChunk(chunk)

            if (processedChunk === null) { continue }

            yield processedChunk

        }

    }

    abstract processChunk(chunk: string): ChunkType | null

}


/**
 * Stream text chunks from a `Response`.
 */
export class TextStream extends TextStreamInterface<string> {

    processChunk(chunk: string) {
        return chunk
    }

}
