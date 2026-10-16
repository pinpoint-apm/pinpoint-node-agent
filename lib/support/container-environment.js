/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const fs = require('fs')

function isContainerEnvironment() {
    return hasDockerEnvironment() || hasDockerCGroup() || hasKubernetesEnvironment()
}

function hasDockerEnvironment() {
    try {
        return fs.existsSync('/.dockerenv')
    } catch (e) {
        return false
    }
}

function hasDockerCGroup() {
    try {
        const cgroup = fs.readFileSync('/proc/self/cgroup', 'utf8')
        return cgroup.includes('docker')
    } catch (e) {
        return false
    }
}

function hasKubernetesEnvironment() {
    return !!process.env.KUBERNETES_SERVICE_HOST
}

module.exports = { isContainerEnvironment }
