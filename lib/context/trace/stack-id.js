/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class StackId {
    /**
     * A constant representing the ID for a null object stack.
     * This is used to signify that the stack ID is invalid or not set.
     * Only for Node.js Agent internal use.
     *
     * @constant {number} -2
     */
    static nullObject = -2

    /**
     * The default stack ID used in the span event builder.
     * This value is set to -1 by default.
     *
     * @constant {number} -1
     */
    static default = -1

    /**
     * The root stack identifier.
     *
     * @constant {number} 0
     */
    static root = 0

    static asyncBeginStackId = 1001
}

module.exports = StackId