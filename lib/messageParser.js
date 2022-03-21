const appConstants = require("./constants");

function parseResp(data) {
  data = startAndEndCheck(data);

  // start, end and length are correct, let's check the content
  return parseBody(data);
}

function startAndEndCheck(data) {
  const dataString = data.toString("utf8").toUpperCase();

  const prefixIndex = dataString.indexOf(appConstants.RESP_PREFIX);

  if (prefixIndex === -1) {
    throw Error(appConstants.ERRORS.NO_START);
  }

  if (prefixIndex !== 0) {
    data = data.slice(prefixIndex);
  }

  if (data.length < appConstants.MESSAGE_BUF_LENGTH) {
    throw Error(appConstants.ERRORS.TOO_SHORT);
  }

  const end = appConstants.MESSAGE_BUF_LENGTH - 2;
  let stringLen = dataString.length;
  const messageEnd = dataString.slice(end, end + 2);
  const messageEndHex = parseInt(messageEnd.toString("hex"), 16);

  // if the CR is not in the right position, but the start is,
  // then remove the start of the buffer and try again
  // until the start and end are correct, or the message is too short

  if (messageEndHex !== 0x0d) {
    data = data.slice(appConstants.RESP_PREFIX.length);
    return startAndEndCheck(data);
  }

  return data;
}

function parseBody(data) {
  const values = {
    current: extractCurrent(data, appConstants.MSG_OFFSET.CURRENT),
    volt: extractFloat(data, appConstants.MSG_OFFSET.VOLT) / 100,
    cycleCount: extractFloat(data, appConstants.MSG_OFFSET.CYCLE),
    soh: extractFloat(data, appConstants.MSG_OFFSET.SOH) / 100,
    soc: extractFloat(data, appConstants.MSG_OFFSET.SOC) / 100,
  };

  values.power = parseFloat((values.volt * values.current).toFixed(2));

  return values;
}

function extractFloat(data, offset) {
  const hexData = data.toString("utf8");
  const dataString = hexData.slice(offset, offset + 4);
  return parseInt(dataString, 16);
}

function extractCurrent(data, offset) {
  const hexData = data.toString("utf8");
  const dataBytes = hexData.slice(offset, offset + 4);
  const dataString = parseInt(dataBytes, 16).toString();
  let value = parseInt(dataString.slice(1)) / 100;

  if (dataString[0] === "3") {
    value = value * -1;
  }
  return value;
}

module.exports = parseResp;
