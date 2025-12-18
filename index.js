/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { AgentBuilder } = require('./lib/agent-builder')
const AgentInfo = require('./lib/data/dto/agent-info')
const { setConfig } = require('./lib/config')
const { ConfigBuilder } = require('./lib/config-builder')
const { LogBuilder } = require('./lib/utils/log/log-builder')
const logger = require('./lib/utils/log/logger')

const config = new ConfigBuilder().build()
setConfig(config)

const agentInfo = AgentInfo.make(config)
const defaultLogger = logger.getLogger(LogBuilder.createDefaultLogBuilder().setConfig(config).build())
const agent = new AgentBuilder(agentInfo)
                .setConfig(config)
                .setLogger(defaultLogger)
                .build()
agent.start()
module.exports = agent