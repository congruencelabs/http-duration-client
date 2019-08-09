# http-duration-client
Measure duration for Node `HTTP` lifecycle events namely:
* DNS lookup
* TCP connect
* TLS connect
* First byte
* Content transfer
* Total request 

## Development
1. To check the HTTP lifecycle events, clone this repository
```
git clone git@github.com:congruencelabs/http-duration-client.git
```

2. Install the package dependencies using `yarn`
```javascript
yarn install
```

3. Run the `examples/client-with-duration.js` file to see the lifecycle events being logged for a request to `https://api.github.com/users`


## Usage
1. Install the `http-duration-client` using `npm` or `yarn`
```
npm install http-duration-client
```
or
```
yarn add http-duration-client
```

2. Make an http request to an endpoint as shown in example below
```javascript
const { requestWithDuration } = require('http-duration-client');

requestWithDuration({
        url: "https://api.github.com/users",
        headers: {
            'User-Agent': 'Example'
        },
        timeout: 500
    }), (err, res) => {
        if(err) {
            console.error(err);
        } else {
            console.log(res.duration);
        }
});
```

The result of the above should look similar to
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