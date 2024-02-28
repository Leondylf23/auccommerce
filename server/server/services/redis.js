const { createClient } = require("redis");

const client = createClient();

client.on("error", (err) => console.log(["Error"], "Redis Client Error", err));

const redisConnect = async () => {
  await client.connect();
  console.log(["info"], "Redis Connected");
};

/**
 * @param {string} key Key of the redis value
 * @param {string} value Value of the redis in string format
 * @param {number} expired Expiration time for the value
 * @returns {object | null} Return error message if any errors
 */
const setKeyValue = async (key, value, expired) => {
  let errMsg = null;

  try {
    if (expired) {
      await client.set(key, value, { EX: expired });
    } else {
      await client.set(key, value);
    }
  } catch (error) {
    errMsg = error;
  }

  return errMsg;
};

/**
 * @param {string} key Key of the redis value
 * @returns {object | Array} Redis value as object or array
 */
const getKeyValue = async (key) => {
  let errMsg = null;
  let value = null;

  try {
    value = await client.get(key);
  } catch (error) {
    errMsg = error;
  }

  if (errMsg) throw errMsg;

  return value;
};

/**
 * @param {string} key Key of the redis value
 * @param {string} value Value of the redis in JSON format
 * @param {number} expired Expiration time for the value
 * @returns {object | null} Return error message if any errors
 */
const setKeyJSONValue = async (key, value, expired) => {
  let errMsg = null;

  try {
    if (expired) {
      await client.set(key, JSON.stringify(value), { EX: expired });
    } else {
      await client.set(key, JSON.stringify(value));
    }
  } catch (error) {
    errMsg = error;
  }

  return errMsg;
};

/**
 * @param {string} key Key of the redis value
 * @returns {object | Array} Redis value as object or array
 */
const getKeyJSONValue = async (key) => {
  let errMsg = null;
  let value = null;

  try {
    value = await client.get(key);
  } catch (error) {
    errMsg = error;
  }

  if (errMsg) throw errMsg;

  return JSON.parse(value);
};

module.exports = {
  redisConnect,
  setKeyValue,
  getKeyValue,
  setKeyJSONValue,
  getKeyJSONValue,
};
