/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class SimpleCache {
  constructor(maxCacheSize) {
    this.cache = new Map()
    this.maxCacheSize = maxCacheSize || 1024
  }

  getAll () {
    return Array.from(this.cache.values())
  }

  get (key) {
    if (key && this.cache.has(key)) {
      const value = this.cache.get(key)
      this.cache.delete(key)
      this.cache.set(key, value)
      return value
    }
    return null
  }

  put (key, value) {
    if (!key || !value) return

    if (this.cache.size >= this.maxCacheSize) {
      this.deleteOldest()
    }
    this.cache.set(key, value)
    return value
  }

  deleteOldest () {
    const overSize = this.cache.size - this.maxCacheSize + 1
    if (overSize > 0) {
      const keys = Array.from(this.cache.keys()).slice(-overSize)
      keys.forEach(key => this.cache.delete(key))
    }
  }

  delete (key) {
    if (!key) return
    this.cache.delete(key)
  }

  size () {
    return this.cache.size
  }

  isEmpty () {
    return this.size() === 0
  }
}

module.exports = SimpleCache
