/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class MySQLRecorder {
    static recordDatabaseInfo(recorder, databaseInfo) {
        if (recorder && databaseInfo && databaseInfo.host && typeof databaseInfo.host === 'string') {
            recorder.recordEndPoint(databaseInfo.host)
        }
        if (recorder && databaseInfo && databaseInfo.database && typeof databaseInfo.database === 'string') {
            recorder.recordDestinationId(databaseInfo.database)
        }
    }
}

module.exports = MySQLRecorder