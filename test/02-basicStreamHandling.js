const expect = require("chai").expect;
const { MockBinding } = require("@serialport/binding-mock");
const BmsMonitor = require("../index.js");
const sleep = require("util").promisify(setTimeout);

const mockPath = "/dev/ROBOT";
let bms = null;
let mockBinding = null;

describe("02 - basic handling", () => {
  before(() => {
    MockBinding.createPort(mockPath);
    bms = new BmsMonitor({ path: mockPath, binding: MockBinding });
  });

  after(() => {
    bms.stop();
  });

  it("should add received data to buffer", async function () {
    const testData = "Test";
    await bms.port.port.emitData(Buffer.from(testData));
    const defer = new Promise((resolve) => {
      bms.port.on("data", resolve);
    });
    await defer;
    expect(bms.respBuffer.toString()).eql(testData);
  });

  it("should error if the port if closed", async function () {
    bms.stop();
    const testData = "Test";
    try {
      await bms.port.port.emitData(Buffer.from(testData));
      throw Error("should not get here");
    } catch (err) {
      expect(err.message).contains("Port must be open");
    }

    // expect(bms.respBuffer.toString()).eql(testData);
  });
});
