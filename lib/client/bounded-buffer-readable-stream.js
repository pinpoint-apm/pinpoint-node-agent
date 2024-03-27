/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { Readable } = require('node:stream')
const log = require('../utils/logger')

class BoundedBufferReadableStream {
    static maxLength = 100

    constructor(constructorOptions) {
        this.buffer = []
        this.options = constructorOptions || {}

        this.readableSteam = this.makeReadableSteam()
    }

    makeReadableSteam() {
        const readableSteam = new Readable(Object.assign({
            read: () => {
                this.readStart()
            }
        }, this.options))

        readableSteam.on('error', () => {
            // https://nodejs.org/api/stream.html#readablepipedestination-options
            // `One important caveat is that if the Readable stream emits an error during processing, the Writable destination is not closed automatically. If an error occurs, it will be necessary to manually close each stream in order to prevent memory leaks.`
            // for readable steam error memory leak prevention
            if (this.writableSteam && typeof this.writableSteam.end === 'function') {
                this.writableSteam.end()
            }
        })

        return readableSteam
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
            if (!this.readableSteam.push(this.buffer.shift())) {
                return this.readStop()
            }
        }
    }

    readStop() {
        this.readable = false
    }

    end() {
        this.readableSteam.end()
    }

    pipe(writableFactory) {
        this.writableFactory = writableFactory
        this._pipe()
    }

    _pipe() {
        if (typeof this.writableFactory !== 'function') {
            return
        }

        const writableSteam = this.writableFactory()
        if (!writableSteam) {
            return
        }
        
        writableSteam.on('error', (error) => {
            if (error) {
                log.error('writable steam error', error)
            }
        })

        this.readableSteam.pipe(writableSteam)
        this.writableSteam = writableSteam
    }

    setEncoding(encoding) {
        this.readableSteam.setEncoding(encoding)
    }
}

module.exports = BoundedBufferReadableStream