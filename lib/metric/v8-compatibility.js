/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const semver = require('semver')

 class V8Compatibility {
     constructor() {
         this.initialize()
     }

     initialize() {
        this.version = this.getNodeVersion()
     }

     getNodeVersion() {
         return process.versions.node
     }
 }
 
const compatibility = new V8Compatibility()
 module.exports = compatibility
