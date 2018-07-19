const store = [];

const getFromStore = (key) => {
  return store.find(x => x.key === key);
};
const removeFromStore = (item) => {
  const index = store.indexOf(item);
  if (index > -1) {
    store.splice(index, 1);
  }
};


const get = async (key) => {
  const item = getFromStore(key);
  if (item && (!item.expiresAt || item.expiresAt < Date.now())) {
    return item.value;
  }
  return undefined;
};
const set = async (key, value, ttl = undefined) => {
  const expiresAt = ttl ? Date.now() + (ttl * 1000) : undefined;
  const existing = getFromStore(key);
  if (existing) {
    existing.value = value;
    existing.expiresAt = expiresAt;
  } else {
    store.push({
      key,
      value,
      expiresAt,
    });
  }
  return Promise.resolve();
};
const remove = async (key) => {
  const item = getFromStore(key);
  if (item) {
    removeFromStore(item);
  }
  return Promise.resolve();
};


module.exports = {
  get,
  set,
  remove,
};
