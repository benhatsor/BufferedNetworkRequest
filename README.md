# BufferedNetworkRequest

Stream JSON and text requests as they arrive. **~30% faster** [First Contentful Paint][1] on slow 3G.

[![NPM version](https://img.shields.io/npm/v/bufferednetworkrequest)](https://www.npmjs.com/package/bufferednetworkrequest) [![Minified size](https://img.shields.io/github/size/benhatsor/BufferedNetworkRequest/dist/index.min.js)](/dist/index.min.js) [![License](https://img.shields.io/github/license/benhatsor/BufferedNetworkRequest.svg)](/LICENSE) 

- [Demo](https://cde.run/benhatsor/BufferedNetworkRequest/demos/demo/index.html)
- [Benchmark Demo](https://cde.run/benhatsor/BufferedNetworkRequest/demos/bench/index.html)

## Installation

### NPM
```sh
npm install bufferednetworkrequest
```

### CDN
Import the module directly:
```js
import * as BufferedNetworkRequest from 'https://unpkg.com/bufferednetworkrequest'
```

## Usage

### Streaming JSON

```js
import { JSONObjectStream } from 'bufferednetworkrequest'

const response = await fetch('https://jsonplaceholder.typicode.com/comments')

if (!response.ok) throw Error(`Request failed: Code ${response.status}`)
if (!response.body) throw Error(`Response was empty.`)

const stream = new JSONObjectStream(response.body)

let respObjects = []

for await (const objects of stream) {
    // do something with the chunk
    respObject.push(...objects)
}

console.log(respObjects)
```

### Streaming Text

```js
import { TextStream } from 'bufferednetworkrequest'

const response = await fetch(url)

if (!response.ok) throw Error(`Request failed: Code ${response.status}`)
if (!response.body) throw Error(`Response was empty.`)

const stream = new TextStream(response.body)

let text = ''

for await (const textChunk of stream) {
    // do something with the chunk
    text += textChunk
}

console.log(text)
```

## Architecture

The library uses the [Web Streams API][2]. `TextStreamInterface<ChunkType>` is an abstract base class that pipes a `Response.body` through a `TextDecoderStream` and exposes an async iterator. Subclasses implement `processChunk()` to transform each text chunk:

- [**TextStream**](src/TextStream.ts) — Returns raw text chunks as-is
- [**JSONObjectStream**](src/JSONObjectStream.ts) — Accumulates chunks into a JSON string, uses `InvalidJSONParser` to extract complete objects, and yields only newly-completed objects (no duplicates across iterations)
- [**InvalidJSONParser**](src/InvalidJSONParser.ts) — Parses incomplete/truncated JSON by tracking brace nesting to find the last fully-closed object, and auto-closing unclosed top-level arrays

## Developing

```sh
npm install
npm run test
```

Then:
```sh
npm run build
```

## License

[MIT](/LICENSE)


[1]: https://web.dev/articles/fcp
[2]: https://developer.mozilla.org/en-US/docs/Web/API/Streams_API
