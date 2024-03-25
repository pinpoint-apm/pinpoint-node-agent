/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { Readable } = require('node:stream')

class BoundedBufferReadableStream {
    constructor(constructorOptions) {
        this.buffer = []

        const options = constructorOptions || {}
        this.steam = new Readable(Object.assign({
            read: () => {
                this.readStart()
            }
        }, options))
    }

    push(data) {
        this.buffer.push(data)

        if (this.canStart()) {
            this.readStart()
        }
    }

    canStart() {
        return this.readable
    }

    readStart() {
        this.readable = true

        const length = this.buffer.length
        for (let index = 0; index < length; index++) {
            if (!this.steam.push(this.buffer.shift())) {
                return this.readStop()
            }
        }
    }

    readStop() {
        this.readable = false
    }

    end() {
        this.steam.end()
    }

    pipe(writable) {
        this.steam.pipe(writable)
    }

    setEncoding(encoding) {
        this.steam.setEncoding(encoding)
    }
}

module.exports = BoundedBufferReadableStream