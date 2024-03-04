/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

//https://github.com/naver/pinpoint/blob/ab07664e2ed944e90aa9c44f7e39597f39264c2b/bootstrap-core/src/main/java/com/navercorp/pinpoint/bootstrap/plugin/request/DefaultTraceHeaderReader.java#L78

const SAMPLING_RATE_PREFIX = 's'
const SAMPLING_RATE_FALSE = SAMPLING_RATE_PREFIX +  '0'

class SamplingFlag {
    isSamplingFlag(samplingFlag) {
        if (samplingFlag == null) {
            return true
        }

        if (samplingFlag.startsWith && samplingFlag.startsWith(SAMPLING_RATE_PREFIX)) {
            return SAMPLING_RATE_FALSE != samplingFlag
        }
        return true
    }

    samplingRateFalse() {
        return SAMPLING_RATE_FALSE
    }
}

const samplingFlag = new SamplingFlag()
module.exports = samplingFlag


