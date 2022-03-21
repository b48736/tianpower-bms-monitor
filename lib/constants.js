const READ_STATUS = `7C010100020D`;
const COMMAND_BUF = Buffer.from(READ_STATUS, "hex").toString("utf8");
const RESP_PREFIX = `7C0101`;
const MESSAGE_BUF_LENGTH = 248;
const MESSAGE_STR_LENGTH = MESSAGE_BUF_LENGTH * 2;
const ERRORS = {
  NO_START: `Message start not found`,
  TOO_SHORT: `Message too short`,
};

const MSG_OFFSET = {
  CURRENT: 80,
  SOC: 88,
  CYCLE: 144,
  VOLT: 152,
  SOH: 160,
};

module.exports = {
  READ_STATUS,
  COMMAND_BUF,
  RESP_PREFIX,
  MESSAGE_BUF_LENGTH,
  MESSAGE_STR_LENGTH,
  ERRORS,
  MSG_OFFSET,
};
