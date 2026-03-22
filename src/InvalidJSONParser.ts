
export type ValidJSONObjects = object[]

/**
 * Gets valid objects in invalid JSON.
 */
class InvalidJSONParser {

    parse(jsonStr: string): ValidJSONObjects {

        let objNestingCounter = 0
        let lastValidIndex = 0

        let inString = false

        for (let i = 0; i < jsonStr.length; i++) {

            const char = jsonStr[i]
            

            // skip escaped characters inside strings
            if (inString && char === '\\') {
                i++
                continue
            }

            // toggle string tracking on unescaped quotes
            if (char === '"') {
                inString = !inString
                continue
            }

            // only count braces outside of strings
            if (inString) { continue }


            // if opening a new object
            if (char === '{') {

                // if no objects are open
                if (objNestingCounter === 0) {

                    // save the last valid index
                    // so we'll be able to revert back to it
                    // if this object is invalid
                    lastValidIndex = i - 1

                }

                objNestingCounter++

            } else if (char === '}') { // if closing an object

                objNestingCounter--

            }

        }


        let validJSONStr = jsonStr

        // if didn't close all objects
        if (objNestingCounter !== 0) {

            // get the string up to the last valid index
            validJSONStr = jsonStr.slice(0, lastValidIndex + 1)

        }


        // if there's an unclosed top-level array

        validJSONStr = validJSONStr.trim()

        if (validJSONStr.startsWith('[') &&
            !validJSONStr.endsWith(']')) {

            // if the string ends with a comma,
            // remove it
            if (validJSONStr.endsWith(',')) {

                validJSONStr = validJSONStr.slice(0, -1)

            }

            // close the top-level array
            validJSONStr += ']'

        }


        let validJSONObjects: ValidJSONObjects = []

        if (validJSONStr) {

            validJSONObjects = JSON.parse(validJSONStr)

            // if got an object, wrap it in an array
            if (!Array.isArray(validJSONObjects)) {

                validJSONObjects = [validJSONObjects]

            }

        }

        return validJSONObjects

    }

}

export default new InvalidJSONParser()
