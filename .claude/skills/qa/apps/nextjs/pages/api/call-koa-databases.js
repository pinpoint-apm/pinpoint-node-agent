'use strict'

const route = require('../../route')
const calls = require('../../../calls')

module.exports = route(() => calls.fetchApp('koa', '/downstream-databases'))
