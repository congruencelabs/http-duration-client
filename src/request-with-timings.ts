import * as http from "http";
import * as https from "https";
import { parse } from "url";

import getTimings, { HttpTimestamp, HttpDuration } from "./timings";

class HttpError extends Error {
  code: string;
}

interface TimedResponse {
  timings: HttpDuration;
  body: any;
}

interface TimedRequestOptions extends https.RequestOptions {
  url: string;
  timeout?: number;
}

export default function requestWithTimings(
  options: TimedRequestOptions,
  callback: (err: HttpError, res: TimedResponse) => any
): void {
  const timings: HttpTimestamp = {
    start: process.hrtime(),
    dnsLookup: undefined,
    tcpConnection: undefined,
    tlsHandshake: undefined,
    responseBodyStart: undefined,
    responseBodyEnd: undefined
  };
  const requestOptions = Object.assign({}, parse(options.url), options);
  const { protocol, timeout = 2000 } = requestOptions;
  const usedProtocol = protocol === "https:" ? https : http;

  let response = "";
  const request = usedProtocol
    .request(requestOptions, res => {
      // The first time response bytes are transferred
      res.once("data", () => {
        timings.responseBodyStart = process.hrtime();
      });

      res.on("data", chunk => (response += chunk));
      res.on("end", () => {
        timings.responseBodyEnd = process.hrtime();
        callback(null, {
          body: response,
          timings: getTimings(timings)
        });
      });
    })
    .setTimeout(timeout)
    .on("error", callback);

  request.on("socket", socket => {
    // Socket created for dnslookup
    socket.on("lookup", () => {
      timings.dnsLookup = process.hrtime();
    });

    // TCP Connection established
    socket.on("connect", () => {
      timings.tcpConnection = process.hrtime();
    });

    // TLS Handshake complete
    socket.on("secureConnect", () => {
      timings.tlsHandshake = process.hrtime();
    });

    socket.on("timeout", () => {
      // Drop request on timeout
      request.abort();
      const err = new HttpError("ETIMEDOUT");
      err.code = "ETIMEDOUT";
      callback(err, null);
    });
  });

  request.end();
}
