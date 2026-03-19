
import { TextStreamInterface } from './TextStream'
import InvalidJSONParser, { type ValidJSONObjects } from './InvalidJSONParser'

/**
 * Stream JSON objects in chunks from a `Response`.
 */
export class JSONObjectStream extends TextStreamInterface<ValidJSONObjects> {

    private fullJSONStr = ''
    private lastValidJSONObjectCount = 0

    protected processChunk(chunk: string) {

        this.fullJSONStr += chunk

        // get valid JSON objects in full JSON string
        const validJSONObjects = InvalidJSONParser.parse(
            this.fullJSONStr
        )

        // remove JSON objects we've already validated
        const newValidJSONObjects = validJSONObjects.slice(
            this.lastValidJSONObjectCount
        )

        // if there are no new valid JSON objects, don't send an update
        if (newValidJSONObjects.length === 0) {
            return null
        }

        this.lastValidJSONObjectCount += newValidJSONObjects.length

        return newValidJSONObjects

    }

}
