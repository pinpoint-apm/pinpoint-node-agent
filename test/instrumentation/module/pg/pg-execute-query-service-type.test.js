/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const pgExecuteQueryServiceType = require('../../../../lib/instrumentation/module/pg/pg-execute-query-service-type')

test('PostgreSQL service types', (t) => {
    t.equal(pgExecuteQueryServiceType.getCode(), 2501, 'PostgreSQL execute query service type code should be 2501')
    t.equal(pgExecuteQueryServiceType.name, 'POSTGRESQL_EXECUTE_QUERY', 'PostgreSQL execute query service type name should be POSTGRESQL_EXECUTE_QUERY')

    t.end()
})
