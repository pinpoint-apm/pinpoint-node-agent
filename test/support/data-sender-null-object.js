/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const dataSenderNullObject = Object.freeze({
    send() {},
    sendStat() {},
    sendPing() {},
    sendSupportedServicesCommand() {},
    close() {},
})

module.exports = {
    dataSenderNullObject,
}
