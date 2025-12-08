/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const fs = require('fs')
const path = require('path')

class Config {
    constructor(config) {
        Object.assign(this, config)
        Object.freeze(this)
    }
}

class ConfigBuilder {
    constructor(agentStartupUserDefinedJson = {}) {
        this.agentStartupUserDefinedJson = agentStartupUserDefinedJson
    }

    setDefaultJson(json) {
        this.defaultJson = json
        return this
    }

    setUserDefinedJson(json) {
        this.userDefinedJson = json
        return this
    }

    build() {
        if (!this.defaultJson) {
            this.defaultJson = require('./pinpoint-config-default')
        }

        if (!this.userDefinedJson) {
            this.userDefinedJson = this.userDefinedJsonFromFile()
        }

        const config = Object.assign({},
            this.defaultJson,
            this.userDefinedJson,
            this.agentStartupUserDefinedJson
        )
        return new Config(config)
    }

    userDefinedJsonFromFile() {
        const path = [
            this.pathForRequireFunction(),
            this.pathForUserDefinedJson()
        ].filter(String)

        const configFilePath = path.find(path => fs.existsSync(path))
        if (!configFilePath) {
            return {}
        }

        try {
            const fileContent = fs.readFileSync(configFilePath, 'utf8')
            return JSON.parse(fileContent)
        } catch (e) {
            console.error('Failed to read or parse pinpoint-config.json:', e)
            return {}
        }
    }

    pathForUserDefinedJson() {
        return path.resolve(process.cwd(), 'pinpoint-config.json')
    }

    pathForRequireFunction() {
        if (!require.main || !require.main.filename) {
            return
        }
        return path.join(path.dirname(require.main.filename), 'pinpoint-config.json')
    }
}

module.exports = {
    ConfigBuilder,
    Config
}