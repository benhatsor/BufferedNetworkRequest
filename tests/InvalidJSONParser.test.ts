
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
