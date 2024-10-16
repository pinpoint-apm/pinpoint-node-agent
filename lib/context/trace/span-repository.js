/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

// BufferedStorage.java
class SpanRepository {
    constructor(spanChunkBuilder, dataSender) {
        this.spanChunkBuilder = spanChunkBuilder
        this.dataSender = dataSender
    }
}

module.exports = SpanRepository