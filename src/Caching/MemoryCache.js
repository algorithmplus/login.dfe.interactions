'use strict';
const LRU = require('lru-cache');
const storage = new LRU({});

var AsyncLock = require('async-lock');
var lock = new AsyncLock();


class MemoryCache {
    get(key) {
        return lock.acquire(key, function () {
            return Promise.resolve(storage.get(key));
        });
    }

    set(key, value) {
        return lock.acquire(key, function () {
            storage.set(key, value);
            return Promise.resolve();
        });
    }

    remove(key) {
        return lock.acquire(key, function () {
            storage.del(key);
            return Promise.resolve();
        });
    }
}

module.exports = MemoryCache;