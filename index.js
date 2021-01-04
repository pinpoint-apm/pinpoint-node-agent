/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

let agent;

module.exports = (options) => {
  /**
   * Modified to receive option at Application Level
   * 
   * @version 0.8.0-ver.yowu
   */ 
  if (agent !== undefined) {
    return agent;
  }

  const Agent = require('./lib/agent')
  agent = new Agent(options);

  return agent;
}