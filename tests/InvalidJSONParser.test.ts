
import { expect, test } from 'vitest'
import { InvalidJSONParser } from '../dist'


// --- InvalidJSONParser ---

test('InvalidJSONParser: complete JSON array', () => {
  const result = InvalidJSONParser.parse('[{"a":1},{"b":2}]')
  expect(result).toEqual([{ a: 1 }, { b: 2 }])
})

test('InvalidJSONParser: single object', () => {
  const result = InvalidJSONParser.parse('{"a":1}')
  expect(result).toEqual([{ a: 1 }])
})

test('InvalidJSONParser: unclosed array', () => {
  const result = InvalidJSONParser.parse('[{"a":1},{"b":2}')
  expect(result).toEqual([{ a: 1 }, { b: 2 }])
})

test('InvalidJSONParser: unclosed array with trailing comma', () => {
  const result = InvalidJSONParser.parse('[{"a":1},{"b":2},')
  expect(result).toEqual([{ a: 1 }, { b: 2 }])
})

test('InvalidJSONParser: unclosed object truncates to last valid', () => {
  const result = InvalidJSONParser.parse('[{"a":1},{"b":')
  expect(result).toEqual([{ a: 1 }])
})

test('InvalidJSONParser: empty string', () => {
  const result = InvalidJSONParser.parse('')
  expect(result).toEqual([])
})

test('InvalidJSONParser: nested objects', () => {
  const result = InvalidJSONParser.parse('[{"a":{"nested":true}},{"b":2}]')
  expect(result).toEqual([{ a: { nested: true } }, { b: 2 }])
})

test('InvalidJSONParser: nested unclosed object', () => {
  const result = InvalidJSONParser.parse('[{"a":{"nested":true}},{"b":{"c":')
  expect(result).toEqual([{ a: { nested: true } }])
})


// "}{}{" is not miscounted as object boundaries
test('InvalidJSONParser: string containing braces is not counted', () => {
  const result = InvalidJSONParser.parse('[{"a":"}{}{"}]')
  expect(result).toEqual([{ a: "}{}{" }])
})

// \" inside strings doesn't toggle string tracking
test('InvalidJSONParser: escaped quote inside string', () => {
  const result = InvalidJSONParser.parse('[{"a":"he said \\"hello\\""}]')
  expect(result).toEqual([{ a: 'he said "hello"' }])
})

// \\" correctly ends the string (backslash is escaped, quote is real)       
test('InvalidJSONParser: escaped backslash before quote', () => {
  const result = InvalidJSONParser.parse('[{"a":"trail\\\\"}]')
  expect(result).toEqual([{ a: "trail\\" }])
})

// \"{}\" handles both together
test('InvalidJSONParser: string with braces and escaped quotes', () => {
  const result = InvalidJSONParser.parse('[{"a":"\\"{}\\""}]')
  expect(result).toEqual([{ a: '"{}"' }])
})

// incomplete object after a string containing { still truncates correctly
test('InvalidJSONParser: unclosed object inside string value with braces', () => {
  const result = InvalidJSONParser.parse('[{"a":"{}"},{"b":"{')
  expect(result).toEqual([{ a: "{}" }])
})
