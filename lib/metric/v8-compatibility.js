/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

 class V8Compatibility {
     constructor() {
        this.version = process.version
     }
 }
 
const compatibility = new V8Compatibility()
 module.exports = compatibility
