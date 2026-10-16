/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

function valueOfString(envName) {
    const value = process.env[envName]
    return value !== undefined ? value : undefined
}

function valueOfNumber(envName) {
    const value = process.env[envName]
    return value !== undefined ? Number(value) : undefined
}

function valueOfBoolean(envName) {
    const value = process.env[envName]
    return typeof value === 'string' ? value.toLowerCase() === 'true' : undefined
}

function arrayOfString(envName) {
    const value = process.env[envName]
    if (typeof value !== 'string' || value.trim().length === 0) {
        return undefined
    }
    return value.split(',').map(s => s.trim()).filter(s => s.length > 0)
}

module.exports = {
    valueOfString,
    valueOfNumber,
    valueOfBoolean,
    arrayOfString
}
