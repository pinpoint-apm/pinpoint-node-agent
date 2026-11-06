/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

function waitForAgentStat(receivedAgentStats, timeoutMillis = 5000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now()
        const check = () => {
            if (receivedAgentStats.length > 0) {
                resolve(receivedAgentStats[0])
            } else if (Date.now() - startTime > timeoutMillis) {
                reject(new Error('no AgentStat received'))
            } else {
                setTimeout(check, 50)
            }
        }
        check()
    })
}

module.exports = {
    waitForAgentStat,
}
