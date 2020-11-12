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
        const nodeVersion = this.getNodeVersion()
        if (!semver.satisfies(nodeVersion, '>=9.0.0')) {
            this.disableModule = true
        } else {
            this.disableModule = false
        }
     }

     disabled() {
         return this.disableModule
     }

     getNodeVersion() {
         return process.versions.node
     }
 }
 
const compatibility = new V8Compatibility()
module.exports = compatibility
