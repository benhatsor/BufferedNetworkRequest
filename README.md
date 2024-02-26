# BufferedNetworkRequest

Significantly faster time-to-first-update for network requests. **~30% time saved** on slow 3G.

- [Demo](https://bufferednetworkrequest.vercel.app/)
- [Debug](https://bufferednetworkrequest.vercel.app/debug.html)

## Usage

```JS
const request = await BufferedNetworkRequest(fetchRequest, options);

request.onupdate = (data) => {};
request.ondone = (resp) => {};
```

### Options
- **`json` [Boolean]**: Parse response data as an array of JSON objects. `false` by default.
