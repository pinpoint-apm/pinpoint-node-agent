/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { AgentBuilder } = require('../../lib/agent-builder')
const { ConfigBuilder } = require('../../lib/config-builder')
const localStorage = require('../../lib/instrumentation/context/local-storage')

let processAgent
let dataSenderInUse

// Mock tests read a sender's fields through what holds it (agent.dataSender.mockSpans),
// so the sender the process agent keeps forwards every field to the test's sender
const forwardingDataSender = new Proxy({}, {
    get(target, property) {
        return Reflect.get(dataSenderInUse, property)
    },
    set(target, property, value) {
        return Reflect.set(dataSenderInUse, property, value)
    },
    defineProperty(target, property, descriptor) {
        return Reflect.defineProperty(dataSenderInUse, property, descriptor)
    },
})

class ProcessAgentBuilder extends AgentBuilder {
    constructor(json = {}) {
        super(new ConfigBuilder(json).setDefaultJson(require('../pinpoint-config-test.json')).build())
    }

    build() {
        if (!processAgent) {
            dataSenderInUse = this.dataSender
            this.dataSender = forwardingDataSender
            processAgent = super.build()
            return processAgent
        }
        localStorage.disable()
        dataSenderInUse.close()
        dataSenderInUse = this.dataSender
        return processAgent
    }
}

module.exports = {
    ProcessAgentBuilder,
}
