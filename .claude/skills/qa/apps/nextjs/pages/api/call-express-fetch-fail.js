'use strict'

const route = require('../../route')
const calls = require('../../../calls')

module.exports = route(() => calls.httpRequestApp('express', '/downstream-fetch-fail'))
