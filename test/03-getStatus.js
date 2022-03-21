const expect = require("chai").expect;
const { MockBinding } = require("@serialport/binding-mock");
const BmsMonitor = require("../index.js");
const sleep = require("util").promisify(setTimeout);
const mockData = require("./mocks/sampleData");
const Helper = require("./lib/helper");

const mockPath = "/dev/ROBOT";
let bms = null;
let mockBinding = null;
const timeout = 100;
const variance = 1.1;
let helper = null;

describe("03 - getStatus", () => {
  before(() => {
    MockBinding.createPort(mockPath, { recording: true });
    bms = new BmsMonitor({ path: mockPath, binding: MockBinding, timeout });
    helper = new Helper(bms);
  });

  after(() => {
    bms.stop();
  });

  it("should send the status command and return a promise", async function () {
    const respPromise = bms.getStatus();

    await helper.sent();
    bms.resolve("Success");

    await respPromise;
    let hexData = Buffer.from(bms.port.port.lastWrite, "utf8").toString("hex");
    expect(hexData).eql("7c010100020d");
  });

  it("should reject a second request while one is still outstanding", async function () {
    const respPromise = bms.getStatus();

    try {
      await bms.getStatus();
      throw Error("should not get here");
    } catch (err) {
      expect(err.message).eql("Request already in progress");
    }

    await helper.sent();
    bms.resolve("Success");
    await respPromise;
  });

  it("should reject the request if timeout is reached", async function () {
    const start = Date.now();
    try {
      await bms.getStatus();
      throw Error("should not get here");
    } catch (err) {
      const delta = Date.now() - start;
      expect(err.message).eql("Request timed out");
      expect(delta).within(timeout / variance, timeout * variance);
    }
  }).timeout(1000);

  it("should allow sending a request after a timeout", async function () {
    try {
      await bms.getStatus();
    } catch (err) {
      // ignore error
    }
    const respPromise = bms.getStatus();
    await helper.sent();
    bms.resolve("Success");

    await respPromise;
  });
});
