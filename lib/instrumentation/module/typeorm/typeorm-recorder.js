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
                const port = databaseInfo.port || this.getDefaultPort(databaseInfo.type)
                recorder.recordEndPoint(databaseInfo.host + ':' + port)
            }
            if (databaseInfo.database && typeof databaseInfo.database === 'string') {
                recorder.recordDestinationId(databaseInfo.database)
            }
        }
    }

    static getDefaultPort(dbType) {
        const defaultPorts = {
            'postgres': 5432,
            'postgresql': 5432,
            'mysql': 3306,
            'mariadb': 3306,
            'sqlite': 0,
            'mongodb': 27017,
            'oracle': 1521,
            'mssql': 1433
        }
        return defaultPorts[dbType] || 0
    }
}

module.exports = TypeORMRecorder 