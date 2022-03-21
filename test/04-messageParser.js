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

describe("04 - message parsing", () => {
  before(() => {
    MockBinding.createPort(mockPath, { recording: true });
    bms = new BmsMonitor({ path: mockPath, binding: MockBinding, timeout });
    helper = new Helper(bms);
  });

  after(() => {
    bms.stop();
  });

  it("should return a status object", async function () {
    const respPromise = bms.getStatus();

    await helper.sent();
    bms.port.port.emitData(mockData[0]);

    const status = await respPromise;
    expect(status).property("current");
    expect(status).property("volt");
    expect(status).property("cycleCount");
    expect(status).property("soh");
    expect(status).property("soc");
    expect(status).property("power");
  });

  it("should parse correct values", async function () {
    const respPromise = bms.getStatus();

    await helper.sent();
    bms.port.port.emitData(mockData[2]);

    const status = await respPromise;
    expect(status).property("current", 0);
    expect(status).property("volt", 54.27);
    expect(status).property("cycleCount", 38);
    expect(status).property("soh", 100.0);
    expect(status).property("soc", 99.99);
    expect(status).property("power", 0);
  });

  it("should parse negative current (discharge)", async function () {
    const respPromise = bms.getStatus();

    await helper.sent();
    bms.port.port.emitData(mockData[5]);

    const status = await respPromise;
    expect(status).property("current", -10.73);
    expect(status).property("volt", 53.08);
    expect(status).property("power", -569.55);
  });
});
