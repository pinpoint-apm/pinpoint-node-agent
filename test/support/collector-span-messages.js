/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const agent = require('./agent-singleton-mock')

// A span sent by an earlier test can arrive at a later test's collector,
// so a collector keeps only the spans of the agent that the current test bound with agent.bindHttp()
function spanMessagesOfCurrentAgent(pSpanMessageBatch) {
    const agentId = agent.getConfig().getAgentId()
    return pSpanMessageBatch.getSpanList().filter((pSpanMessage) => {
        const spanOrSpanChunk = pSpanMessage.getSpan() ?? pSpanMessage.getSpanchunk()
        return spanOrSpanChunk?.getTransactionid()?.getAgentid() === agentId
    })
}

module.exports = {
    spanMessagesOfCurrentAgent,
}
