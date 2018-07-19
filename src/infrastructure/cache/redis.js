const config = require('./../Config')();
const Redis = require('ioredis');

const redis = new Redis(config.cache.params.connectionString, {
  keyPrefix: 'int:',
});

const get = async (key) => {
  const value = await redis.get(key);
  return value ? JSON.parse(value) : undefined;
};
const set = async (key, value, ttl = undefined) => {
  const storeValue = JSON.stringify(value);
  if (ttl) {
    await redis.multi().set(key, storeValue).expire(key, ttl).exec();
  } else {
    await redis.set(key, storeValue);
  }
};
const remove = async (key) => {
  await redis.del(key);
};

module.exports = {
  get,
  set,
  remove,
};
