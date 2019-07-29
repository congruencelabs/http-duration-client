import * as nock from "nock";
import { requestWithTimings } from "../index";

describe.only("http-client with timer", () => {
  test("should be able to make http request to remote http server", async () => {
    nock("http://example.org")
      .get("/")
      .reply(200, {
        key: "value"
      });

    requestWithTimings(
      {
        url: "http://example.org"
      },
      (_, res) => {
        expect(res.timings).toBeInstanceOf(Object);
        expect(res.body).toEqual(JSON.stringify({ key: "value" }));
      }
    );
  });

  test("should be able to make https request to remote http server", async () => {
    nock("https://example.org")
      .get("/")
      .reply(200, {
        key: "value"
      });

    requestWithTimings(
      {
        url: "https://example.org"
      },
      (_, res) => {
        expect(res.timings).toBeInstanceOf(Object);
        expect(res.body).toEqual(JSON.stringify({ key: "value" }));
      }
    );
  });

  test("should be able to return timings for http request response lifecycle", async () => {
    nock("https://example.org")
      .get("/")
      .reply(200, {
        key: "value"
      });

    requestWithTimings(
      {
        url: "https://example.org"
      },
      (_, res) => {
        expect(res.timings.dnsLookup).not.toBeDefined();
        expect(res.timings.tcpConnection).toBeDefined();
        expect(res.timings.tlsHandshake).toBeDefined();
        expect(res.timings.firstByte).toBeDefined();
        expect(res.timings.contentTransfer).toBeDefined();
        expect(res.timings.total).toBeDefined();
      }
    );
  });
});
