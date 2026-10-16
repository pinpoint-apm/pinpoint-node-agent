/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const fs = require('fs')
const path = require('path')

function readUserDefinedJson() {
    const configPaths = [
        pathForRequireFunction(),
        pathForUserDefinedJson()
    ].filter(Boolean)

    const configFilePath = configPaths.find(filePath => fs.existsSync(filePath))
    if (!configFilePath) {
        return {}
    }

    try {
        const fileContent = fs.readFileSync(configFilePath, 'utf8')
        return JSON.parse(fileContent)
    } catch (e) {
        return { messages: { warns: [`Failed to read or parse pinpoint-config.json at ${configFilePath}: ${e.message}`] } }
    }
}

function pathForUserDefinedJson() {
    return path.resolve(process.cwd(), 'pinpoint-config.json')
}

function pathForRequireFunction() {
    if (!require.main || !require.main.filename) {
        return
    }
    return path.join(path.dirname(require.main.filename), 'pinpoint-config.json')
}

module.exports = { readUserDefinedJson }
