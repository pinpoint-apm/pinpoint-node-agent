/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class CallSite {
    constructor(groups) {
        if (!groups || !groups.groups) {
            groups = {
                groups: {
                    lineNumber: 0,
                    columnNumber: 0,
                    fileName: '',
                    functionName: ''
                }
            }
        }
        this.lineNumber = groups.groups.lineNumber
        this.fileName = groups.groups.fileName
        this.functionName = groups.groups.functionName
        this.columnNumber = groups.groups.columnNumber
    }
}

module.exports = CallSite