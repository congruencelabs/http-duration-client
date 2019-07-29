type HighResolutionTimestamp = [number, number];

export interface HttpTimestamp {
  start: HighResolutionTimestamp;
  dnsLookup: HighResolutionTimestamp;
  tcpConnection: HighResolutionTimestamp;
  tlsHandshake: HighResolutionTimestamp;
  responseBodyStart: HighResolutionTimestamp;
  responseBodyEnd: HighResolutionTimestamp;
}

export interface HttpDuration {
  dnsLookup: number;
  tcpConnection: number;
  tlsHandshake: number;
  firstByte: number;
  contentTransfer: number;
  total: number;
}

export default function getTimings(httpTimings: HttpTimestamp): HttpDuration {
  const dnsLookup = httpTimings.dnsLookup
    ? findDuration(httpTimings.start, httpTimings.dnsLookup)
    : undefined;
  const tcpConnectionTime = httpTimings.tcpConnection
    ? findDuration(
        httpTimings.dnsLookup || httpTimings.start,
        httpTimings.tcpConnection
      )
    : undefined;
  const tlsHandshakeTime = httpTimings.tlsHandshake
    ? findDuration(httpTimings.tcpConnection, httpTimings.tlsHandshake)
    : undefined;
  const firstByte = findDuration(
    httpTimings.tlsHandshake || httpTimings.tcpConnection,
    httpTimings.responseBodyStart
  );
  const contentTransfer = findDuration(
    httpTimings.responseBodyStart,
    httpTimings.responseBodyEnd
  );
  const total = findDuration(httpTimings.start, httpTimings.responseBodyEnd);
  return {
    dnsLookup,
    tcpConnection: tcpConnectionTime,
    tlsHandshake: tlsHandshakeTime,
    firstByte,
    contentTransfer,
    total
  };
}

function findDuration([secStart, nanoSecStart], [secEnd, nanoSecEnd]) {
  return ((secEnd - secStart) * 1e9 + (nanoSecEnd - nanoSecStart)) / 1e6;
}
