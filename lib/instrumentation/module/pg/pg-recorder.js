/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class PostgreSQLRecorder {
    static recordDatabaseInfo(recorder, databaseInfo) {
        if (recorder && databaseInfo && databaseInfo.host && typeof databaseInfo.host === 'string') {
            recorder.recordEndPoint(databaseInfo.host + ':' + (databaseInfo.port || 5432))
        }
        if (recorder && databaseInfo && databaseInfo.database && typeof databaseInfo.database === 'string') {
            recorder.recordDestinationId(databaseInfo.database)
        }
    }
}

module.exports = PostgreSQLRecorder 