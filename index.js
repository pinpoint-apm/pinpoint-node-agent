/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { AgentBuilder } = require('./lib/agent-builder')
const AgentInfo = require('./lib/data/dto/agent-info')
const { getConfig } = require('./lib/config')
const { LogBuilder } = require('./lib/utils/log/log-builder')
const logger = require('./lib/utils/log/logger')

const config = getConfig()
logger.setRootLogger(LogBuilder.createDefaultLogBuilder().setConfig(config).build())

const agentInfo = AgentInfo.make(config)
const agent = new AgentBuilder(agentInfo)
                .setConfig(config)
                .build()
agent.start()
module.exports = agent
