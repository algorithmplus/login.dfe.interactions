'use strict';
const LRU = require('lru-cache');

const storage = new LRU({});

class MemoryCache {
    get(key){
        return Promise.resolve(storage.get(key));
    }
    set(key, value) {
        storage.set(key, value);
        return Promise.resolve();
    }
    remove(key) {
        storage.del(key);
        return Promise.resolve();
    }
}

module.exports = MemoryCache;