const { SerialPortStream } = require("@serialport/stream");
const { autoDetect, LinuxBinding } = require("@serialport/bindings-cpp");

const _ = require("lodash");

const appConstants = require("./constants");
const parseResp = require("./messageParser");

const defaultOptions = {
  path: "/dev/ttyUSB0",
  baudRate: 9600,
  timeout: 10000,
  binding: autoDetect(),
};

class BmsMonitor {
  constructor(options = {}) {
    this.respBuffer = Buffer.alloc(0);

    this.options = _.defaults({}, options, defaultOptions);
    this.port = new SerialPortStream(this.options);

    this.port.on("data", this.dataHandler.bind(this));
    this.port.on("error", this.errorHandler.bind(this));
    this.activeRequest = null;
  }

  stop() {
    this.port.close();
  }

  dataHandler(data) {
    this.respBuffer = Buffer.concat([this.respBuffer, data]);
    this.checkComplete();
  }

  errorHandler(err) {
    this.reject(err);
    this.respBuffer = Buffer.alloc(0);
  }

  checkComplete() {
    try {
      const status = parseResp(this.respBuffer);
      this.resolve(status);
      this.respBuffer = Buffer.alloc(0);
    } catch (err) {
      console.log(err);
    }
  }

  async getStatus() {
    const _this = this;
    if (this.activeRequest) {
      throw Error("Request already in progress");
    }

    return new Promise((resolve, reject) => {
      this.activeRequest = {
        resolve,
        reject,
        timeout: setTimeout(this.reject),
      };
      this.activeRequest.timeout = setTimeout(() => {
        this.reject(Error("Request timed out"));
      }, this.options.timeout);

      this.port.write(appConstants.COMMAND_BUF);
    });
  }

  resolve(data) {
    if (!this.activeRequest) {
      return;
    }
    clearTimeout(this.activeRequest.timeout);
    this.activeRequest.resolve(data);
    this.activeRequest = null;
  }

  reject(err) {
    if (!this.activeRequest) {
      return;
    }
    clearTimeout(this.activeRequest.timeout);
    this.activeRequest.reject(err);
    this.activeRequest = null;
  }
}

// export { BmsMonitor };
module.exports = BmsMonitor;
