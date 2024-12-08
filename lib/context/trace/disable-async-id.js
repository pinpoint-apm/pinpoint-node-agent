/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class DisableAsyncId {
    nextLocalAsyncId2() {
        return disableAsyncId
    }
}

const disableAsyncId = new DisableAsyncId()
module.exports = disableAsyncId