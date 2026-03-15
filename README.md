# BufferedNetworkRequest

Significantly faster time-to-first-update for network requests. **~30% time saved** on slow 3G.

- [Demo](https://bufferednetworkrequest.vercel.app/demos/demo)
- [Benchmark Demo](https://bufferednetworkrequest.vercel.app/demos/debug)

## Installation

```sh
npm install bufferednetworkrequest
```

## Usage

### Text

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

### JSON

```js
import { JSONObjectStream } from 'bufferednetworkrequest'

const response = await fetch('https://jsonplaceholder.typicode.com/todos')

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
