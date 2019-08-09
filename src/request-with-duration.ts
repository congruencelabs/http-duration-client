import * as http from "http";
import * as https from "https";
import { parse } from "url";

import getEventDuration, { HttpTimestamp, HttpDuration } from "./duration";

class HttpError extends Error {
  code: string;
}

interface TimedResponse {
  duration: HttpDuration;
  body: any;
}

interface TimedRequestOptions extends https.RequestOptions {
  url: string;
  timeout?: number;
}

export default function requestWithDuration(
  options: TimedRequestOptions,
  callback: (err: HttpError, res: TimedResponse) => any
): void {
  const httpTimestamp: HttpTimestamp = {
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
        httpTimestamp.responseBodyStart = process.hrtime();
      });

      res.on("data", chunk => (response += chunk));
      res.on("end", () => {
        httpTimestamp.responseBodyEnd = process.hrtime();
        callback(null, {
          body: response,
          duration: getEventDuration(httpTimestamp)
        });
      });
    })
    .setTimeout(timeout)
    .on("error", callback);

  request.on("socket", socket => {
    // Socket created for dnslookup
    socket.on("lookup", () => {
      httpTimestamp.dnsLookup = process.hrtime();
    });

    // TCP Connection established
    socket.on("connect", () => {
      httpTimestamp.tcpConnection = process.hrtime();
    });

    // TLS Handshake complete
    socket.on("secureConnect", () => {
      httpTimestamp.tlsHandshake = process.hrtime();
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
