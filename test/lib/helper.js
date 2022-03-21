const sleep = require("util").promisify(setTimeout);

class Helper {
  constructor(bms) {
    this.bms = bms;
  }

  throw() {
    throw Error("should not get here");
  }

  async sent() {
    let pollSent = false;

    while (!pollSent) {
      await sleep(1);
      if (this.bms.port.port.lastWrite && this.bms.port.port.lastWrite.length > 5) {
        pollSent = true;
      }
    }
  }
}

module.exports = Helper;
