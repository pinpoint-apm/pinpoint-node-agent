'use strict'

class SimpleCache {
  constructor(cacheSize) {
    this.cache = new Map()
    this.cacheSize = cacheSize || 1024
  }

  getAndPut (key, value) {
    const v = this.get(key)
    if (!v) {
      set(key, value)
    }
    return value
  }

  get (key) {
    if (key && this.cache.has(key)) {
      const value = this.cache.get(key)
      this.cache.delete(key)
      this.cache.set(key, temp)
      return value
    }
    return null
  }

  put (key, value) {
    if (!key || !value) return

    if (this.cache.size >= this.cacheSize) {
      this.cache.delete(Array.from(this.cache.keys()).pop())
    }
    this.cache.set(key, value)
  }
}

module.exports = SimpleCache
