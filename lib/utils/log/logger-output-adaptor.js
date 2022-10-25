/**
 * Pinpoint Node.js Agent
 * Copyright 2022-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class LoggerOutputAdaptor {
    constructor(output) {
        this.output = output
    }

    get console() {
        return console
    }

    debug(message) {
        if (!this.output || typeof this.output.debug != 'function') {
            if (typeof this.output.error === 'function') {
                this.output.error("The Adaptor doesn't has the debug function.")
            } else {
                this.console.error("The Adaptor doesn't has the debug function.")
            }
            return
        }
        this.output.debug(message)
    }

    info(message) {
        if (!this.output || typeof this.output.info != 'function') {
            if (typeof this.output.error === 'function') {
                this.output.error("The Adaptor doesn't has the info function.")
            } else {
                this.console.error("The Adaptor doesn't has the info function.")
            }
            return
        }
        this.output.info(message)
    }

    warn(message) {
        if (!this.output || typeof this.output.warn != 'function') {
            if (typeof this.output.error === 'function') {
                this.output.error("The Adaptor doesn't has the warn function.")
            } else {
                this.console.error("The Adaptor doesn't has the warn function.")
            }
            return
        }
        this.output.warn(message)
    }

    error(message) {
        if (!this.output || typeof this.output.error != 'function') {
            this.console.error("The Adaptor doesn't has the error function.")
            return
        }
        this.output.error(message)
    }
}

module.exports = LoggerOutputAdaptor