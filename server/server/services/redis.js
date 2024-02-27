const { createClient } = require("redis");

const client = createClient();

client.on("error", (err) => console.log(["Error"], "Redis Client Error", err));

const setKeyValue = async (key, value, expired) => {
  let errMsg = null;

  await client.connect();
  try {
    if (expired) {
      await client.set(key, value, "EX", expired);
    } else {
      await client.set(key, value);
    }
  } catch (error) {
    errMsg = error;
  }

  await client.disconnect();
  return errMsg;
};

const getKeyValue = async (key) => {
  let errMsg = null;
  let value = null;

  await client.connect();
  try {
    value = await client.get(key);
  } catch (error) {
    errMsg = error;
  }

  await client.disconnect();
  if (errMsg) throw errMsg;

  return value;
};

const setKeyJSONValue = async (key, value, expired) => {
  let errMsg = null;

  await client.connect();
  try {
    if (expired) {
      await client.set(key, JSON.stringify(value), "EX", expired);
    } else {
      await client.set(key, JSON.stringify(value));
    }
  } catch (error) {
    errMsg = error;
  }

  await client.disconnect();
  return errMsg;
};

const getKeyJSONValue = async (key) => {
  let errMsg = null;
  let value = null;

  await client.connect();
  try {
    value = await client.get(key);
  } catch (error) {
    errMsg = error;
  }

  await client.disconnect();
  if (errMsg) throw errMsg;

  return JSON.parse(value);
};

module.exports = {
  setKeyValue,
  getKeyValue,
  setKeyJSONValue,
  getKeyJSONValue,
};
