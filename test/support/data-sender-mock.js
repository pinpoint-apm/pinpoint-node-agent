'use strict'

const dataSender = () => {
    return {
        sendApiMetaInfo: function() {

        },
        sendSpan: function() {

        },
        sendSpanChunk: function() {

        },
        sendStringMetaInfo: function(metaInfo) {
          this.mockMetaInfo = metaInfo
        }
    }
}

module.exports = dataSender