# node-http-lifecycle
Measure latency for Node HTTP lifecycle events

## Development
1. To check the HTTP lifecycle events, clone this repository
```
git clone git@github.com:congruencelabs/node-http-lifecycle.git
```

2. Install the package dependencies using `yarn`
```javascript
yarn install
```

3. Run the `examples/client-with-timing.js` file to see the lifecycle events being logged for a request to `https://api.github.com/users`


## Usage
1. Install the `node-http-lifecycle` using `npm` or `yarn`
```
npm install node-http-lifecycle
```
or
```
yarn add node-http-lifecycle
```

2. Make an http request to an endpoint as shown in example below
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
            console.error(err);
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