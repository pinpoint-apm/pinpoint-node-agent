/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class TypeORMRecorder {
    static recordDatabaseInfo(recorder, databaseInfo) {
        if (recorder && databaseInfo) {
            if (databaseInfo.host && typeof databaseInfo.host === 'string') {
                const port = databaseInfo.port || 5432  // Default to PostgreSQL port
                recorder.recordEndPoint(databaseInfo.host + ':' + port)
            }
            if (databaseInfo.database && typeof databaseInfo.database === 'string') {
                recorder.recordDestinationId(databaseInfo.database)
            }
        }
    }
}

module.exports = TypeORMRecorder 