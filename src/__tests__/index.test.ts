import * as nock from "nock";
import { requestWithDuration } from "../index";

describe.only("http-client with timer", () => {
  test("should be able to make http request to remote http server", async () => {
    nock("http://example.org")
      .get("/")
      .reply(200, {
        key: "value"
      });

    requestWithDuration(
      {
        url: "http://example.org"
      },
      (_, res) => {
        expect(res.duration).toBeInstanceOf(Object);
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

    requestWithDuration(
      {
        url: "https://example.org"
      },
      (_, res) => {
        expect(res.duration).toBeInstanceOf(Object);
        expect(res.body).toEqual(JSON.stringify({ key: "value" }));
      }
    );
  });

  test("should be able to return duration for http request response lifecycle", async () => {
    nock("https://example.org")
      .get("/")
      .reply(200, {
        key: "value"
      });

    requestWithDuration(
      {
        url: "https://example.org"
      },
      (_, res) => {
        expect(res.duration.dnsLookup).not.toBeDefined();
        expect(res.duration.tcpConnection).toBeDefined();
        expect(res.duration.tlsHandshake).toBeDefined();
        expect(res.duration.firstByte).toBeDefined();
        expect(res.duration.contentTransfer).toBeDefined();
        expect(res.duration.total).toBeDefined();
      }
    );
  });
});
