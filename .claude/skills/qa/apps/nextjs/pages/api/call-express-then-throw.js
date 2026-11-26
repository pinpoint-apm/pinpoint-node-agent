'use strict'

const calls = require('../../../calls')

module.exports = async () => {
    await calls.httpRequestApp('express', '/downstream')
    throw new Error('qa caller throws after the call')
}
