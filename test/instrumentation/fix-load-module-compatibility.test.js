'use strict'

const test = require('tape')
const mockAgent = require('../support/agent-singleton-mock')

test(`load async module`, (t) => {
    t.plan(0)

    mockAgent.resetAgent(() => {

    })

    t.end()
})