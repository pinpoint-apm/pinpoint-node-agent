/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { AgentBuilder } = require('./lib/agent-builder')
const AgentInfo = require('./lib/data/dto/agent-info')
const { getConfig } = require('./lib/config')

const config = getConfig()
const agentInfo = AgentInfo.make(config)
const agent = new AgentBuilder(agentInfo)
                .setConfig(config)
                .build()
agent.start()
module.exports = agent
