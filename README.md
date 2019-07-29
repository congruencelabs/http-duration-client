# node-http-lifecycle
Measure latency for Node HTTP lifecycle events

## Usage
```javascript
const { requestWithTimings } = require('node-http-lifecycle');

requestWithTimings({
        url: "https://api.github.com/users",
        headers: {
            'User-Agent': 'Example'
        },
        timeout: 500
    }), (err, res) => {
        if(err) {
            console.error('>>>>>>>>>>>error',err);
        } else {
            console.log(res.timings);
        }
});
```

The result of the above will be

```json
{ 
    "dnsLookup": 62.253469,
    "tcpConnection": 20.589025,
    "tlsHandshake": 44.643525,
    "firstByte": 490.091997,
    "contentTransfer": 15.480998,
    "total": 633.059014
}
```