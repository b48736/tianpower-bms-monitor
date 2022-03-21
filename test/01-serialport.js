const expect = require("chai").expect;
// const SerialPort = require("@serialport/stream");
const { MockBinding } = require("@serialport/binding-mock");
const BMS = require("../index");
const sleep = require("util").promisify(setTimeout);

const mockPort = "/dev/ROBOT";

describe("01 - craete serial port monitor", () => {
  before(() => {
    MockBinding.createPort(mockPort, { echo: false, record: true });
  });

  it("should create the BMS with the default port", async function () {
    const bms = new BMS();
    expect(bms.port).property("path", "/dev/ttyUSB0");
    expect(bms.port).property("on");
    bms.stop();
  });

  it("should create the BMS with provided path", async function () {
    const bms = new BMS({ path: mockPort });
    expect(bms.port).property("path", mockPort);
    expect(bms.port).property("on");
    bms.stop();
  });
});
