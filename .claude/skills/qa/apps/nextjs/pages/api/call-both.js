'use strict'

const route = require('../../route')
const calls = require('../../../calls')

module.exports = route(() => calls.both(calls.httpRequestApp('express', '/downstream'), calls.fetchApp('koa', '/downstream')))
