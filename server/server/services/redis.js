const { createClient } = require("redis");

const client = createClient();

client.on("error", (err) => console.log(["Error"], "Redis Client Error", err));

const setHashKey = async (key, value) => {
  let errMsg = null;

  await client.connect();
  try {
      await client.hSet(key, value);
  } catch (error) {
    errMsg = error;
  }

  await client.disconnect();
  return errMsg;
};

const getHashKeyValue = async (key) => {
  let errMsg = null;
  let value = null;

  await client.connect();
  try {
    value = await client.hGet(key);
  } catch (error) {
    errMsg = error;
  }

  await client.disconnect();
  if (errMsg) throw errMsg;

  return value;
};

module.exports = {
  setHashKey,
  getHashKeyValue,
};
