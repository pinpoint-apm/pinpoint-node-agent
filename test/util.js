/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const randomBetween = (min, max) => {
  return Math.floor((Math.random() * (max - min + 1))) + min
}

module.exports = {
  sleep,
  randomBetween,
}
