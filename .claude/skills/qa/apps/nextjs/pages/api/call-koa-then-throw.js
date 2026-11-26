'use strict'

const calls = require('../../../calls')

module.exports = async () => {
    await calls.fetchApp('koa', '/downstream')
    throw new Error('qa caller throws after the call')
}
