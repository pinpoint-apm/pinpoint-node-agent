/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { Readable } = require('node:stream')
const log = require('../utils/logger')

class BoundedBufferReadableStream {
    constructor(constructorOptions) {
        this.buffer = []
        this.options = constructorOptions || {}
        this.readableStream = this.makeReadableSteam()
    }

    makeReadableSteam() {
        const readableStream = new Readable(Object.assign({
            objectMode: true,
            read: () => {
                this.readStart()
            }
        }, this.options))

        readableStream.on('error', () => {
            // https://nodejs.org/api/stream.html#readablepipedestination-options
            // `One important caveat is that if the Readable stream emits an error during processing, 
            // the Writable destination is not closed automatically. 
            // If an error occurs, it will be necessary to manually close each stream 
            // in order to prevent memory leaks.`
            // for readable steam error memory leak prevention
            if (this.writableSteam && typeof this.writableSteam.end === 'function') {
                this.writableSteam.end()
            }
        })

        readableStream.on('close', () => {
            this.needsNewReadableStream = true
        })

        return readableStream
    }

    push(data) {
        if(!this.readableStream.push(data)) {
            return this.readStop()
        }
    }

    canStart() {
        return this.readable
    }

    readStart() {
        if (this.needsNewReadableStream) {
            this.readableStream = this.makeReadableSteam()
            this._pipe()
        }

        this.readable = true
    }

    readStop() {
        this.readable = false
    }

    end() {
        this.readableStream.end()
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

        writableSteam.on('unpipe', () => {
            this.readStop()
        })

        writableSteam.on('close', () => {
            
        })

        this.readableStream.pipe(writableSteam)
        this.writableSteam = writableSteam
    }
}

module.exports = BoundedBufferReadableStream