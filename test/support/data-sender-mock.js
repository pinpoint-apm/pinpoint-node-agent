'use strict'

const { fixture, util, log } = require('../test-helper')

const dataSender = () => {
    return {
        sendApiMetaInfo: function(apiMetaInfo) {
          // log.debug(apiMetaInfo)
        },
        sendSpan: function(span) {
          // log.debug(span)
        },
        sendSpanChunk: function(spanChunk) {
          // log.debug(spanChunk)
        },
        sendStringMetaInfo: function(metaInfo) {
          this.mockMetaInfo = metaInfo
        }
    }
}

module.exports = dataSender