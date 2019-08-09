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

export default function getEventDuration(
  httpTimestamp: HttpTimestamp
): HttpDuration {
  const dnsLookup = httpTimestamp.dnsLookup
    ? findDuration(httpTimestamp.start, httpTimestamp.dnsLookup)
    : undefined;
  const tcpConnectionTime = httpTimestamp.tcpConnection
    ? findDuration(
        httpTimestamp.dnsLookup || httpTimestamp.start,
        httpTimestamp.tcpConnection
      )
    : undefined;
  const tlsHandshakeTime = httpTimestamp.tlsHandshake
    ? findDuration(httpTimestamp.tcpConnection, httpTimestamp.tlsHandshake)
    : undefined;
  const firstByte = findDuration(
    httpTimestamp.tlsHandshake || httpTimestamp.tcpConnection,
    httpTimestamp.responseBodyStart
  );
  const contentTransfer = findDuration(
    httpTimestamp.responseBodyStart,
    httpTimestamp.responseBodyEnd
  );
  const total = findDuration(
    httpTimestamp.start,
    httpTimestamp.responseBodyEnd
  );
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
