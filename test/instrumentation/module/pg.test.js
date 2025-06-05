/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const agent = require('../../support/agent-singleton-mock')
const apiMetaService = require('../../../lib/context/api-meta-service')
const MethodDescriptorBuilder = require('../../../lib/context/method-descriptor-builder')
const sqlMetadataService = require('../../../lib/instrumentation/sql/sql-metadata-service')
const annotationKey = require('../../../lib/constant/annotation-key')
const pgExecuteQueryServiceType = require('../../../lib/instrumentation/module/pg/pg-execute-query-service-type')
const pgServiceType = require('../../../lib/instrumentation/module/pg/pg-service-type')
const localStorage = require('../../../lib/instrumentation/context/local-storage')
const InstrumentMethod = require('../../../lib/instrumentation/instrument-method')
const PostgreSQLQueryInterceptor = require('../../../lib/instrumentation/module/pg/pg-query-interceptor')
const databaseInfoSymbol = require('../../../lib/instrumentation/module/pg/pg-database-information-symbol')

// Mock PostgreSQL client for testing with instrumentation
class MockPgClient {
    constructor(config) {
        this.config = config || {}
        this.connectionParameters = config || {}
        this.connected = false
    }

    async connect() {
        this.connected = true
        
        // Set database information like the real hook would
        this[databaseInfoSymbol] = {
            host: this.connectionParameters.host || 'localhost',
            port: this.connectionParameters.port || 5432,
            database: this.connectionParameters.database,
            user: this.connectionParameters.user
        }
        
        // Manually instrument for testing
        const traceContext = agent.getTraceContext()
        InstrumentMethod.make(this, 'query', traceContext).addScopedInterceptor(new PostgreSQLQueryInterceptor('Client'))
        
        return Promise.resolve()
    }

    async query(sql, params, callback) {
        // Mock query implementation
        const result = {
            rows: [
                { id: 1, name: 'test user', email: 'test@example.com' },
                { id: 2, name: 'test user 2', email: 'test2@example.com' }
            ],
            rowCount: 2
        }

        if (typeof params === 'function') {
            callback = params
            params = undefined
        }

        if (callback) {
            setImmediate(() => callback(null, result))
        } else {
            return Promise.resolve(result)
        }
    }

    async end() {
        this.connected = false
        return Promise.resolve()
    }
}

class MockPgPool {
    constructor(config) {
        this.config = config || {}
        
        // Set database information like the real hook would
        this[databaseInfoSymbol] = {
            host: config?.host || 'localhost',
            port: config?.port || 5432,
            database: config?.database,
            user: config?.user
        }
        
        // Manually instrument for testing
        const traceContext = agent.getTraceContext()
        InstrumentMethod.make(this, 'query', traceContext).addScopedInterceptor(new PostgreSQLQueryInterceptor('Pool'))
    }

    async query(sql, params) {
        // Mock query implementation
        const result = {
            rows: [
                { id: 1, name: 'test user', email: 'test@example.com' }
            ],
            rowCount: 1
        }
        return Promise.resolve(result)
    }

    async end() {
        return Promise.resolve()
    }
}

test('PostgreSQL Client query hooking', async (t) => {
    agent.bindHttp()
    
    const trace = agent.createTraceObject()
    await localStorage.run(trace, async () => {
        const client = new MockPgClient({
            host: 'localhost',
            port: 5432,
            database: 'testdb',
            user: 'testuser',
            password: 'testpass'
        })

        await client.connect()
        
        const result = await client.query('SELECT * FROM users WHERE id = $1', [1])
        
        t.equal(result.rows.length, 2, 'Query should return 2 rows')
        t.equal(result.rows[0].name, 'test user', 'First row name should match')
        
        await client.end()
        trace.close()

        // Debug: print all span events
        const spanEvents = trace.spanBuilder.spanEventList
        console.log('All span events:', spanEvents.map(e => ({ 
            serviceType: e.serviceType, 
            apiId: e.apiId,
            className: e.className,
            methodName: e.methodName
        })))
        
        // Check query span event
        const querySpanEvents = spanEvents.filter(event => 
            event.serviceType === pgExecuteQueryServiceType.getCode()
        )
        
        console.log('PostgreSQL query span events:', querySpanEvents.length)
        
        t.ok(querySpanEvents.length > 0, 'At least one PostgreSQL query span event should exist')

        t.end()
    })
})

test('PostgreSQL Pool query hooking', async (t) => {
    agent.bindHttp()
    
    const trace = agent.createTraceObject()
    await localStorage.run(trace, async () => {
        const pool = new MockPgPool({
            host: 'localhost',
            port: 5432,
            database: 'testdb',
            user: 'testuser',
            password: 'testpass',
            max: 10
        })

        const result = await pool.query('SELECT COUNT(*) FROM users')
        
        t.equal(result.rows.length, 1, 'Pool query should return 1 row')
        
        await pool.end()
        trace.close()

        // Verify instrumentation
        const spanEvents = trace.spanBuilder.spanEventList
        
        // Check query span event
        const querySpanEvents = spanEvents.filter(event => 
            event.serviceType === pgExecuteQueryServiceType.getCode()
        )
        
        t.ok(querySpanEvents.length > 0, 'At least one PostgreSQL Pool query span event should exist')

        t.end()
    })
})

test('PostgreSQL query with parameters', async (t) => {
    agent.bindHttp()
    
    const trace = agent.createTraceObject()
    await localStorage.run(trace, async () => {
        const client = new MockPgClient({
            host: 'localhost',
            port: 5432,
            database: 'testdb',
            user: 'testuser'
        })

        await client.connect()
        
        // Test query with array parameters
        await client.query('INSERT INTO users (name, email) VALUES ($1, $2)', ['John Doe', 'john@example.com'])
        
        // Test query with object parameters  
        await client.query('SELECT * FROM users WHERE active = $1 AND created_at > $2', [true, '2023-01-01'])
        
        await client.end()
        trace.close()

        // Verify that both queries were instrumented
        const spanEvents = trace.spanBuilder.spanEventList
        const querySpanEvents = spanEvents.filter(event => 
            event.serviceType === pgExecuteQueryServiceType.getCode()
        )
        
        t.equal(querySpanEvents.length, 2, 'Should have 2 query span events')
        
        // Verify SQL annotations exist
        querySpanEvents.forEach(spanEvent => {
            const sqlAnnotation = spanEvent.annotations.find(ann => 
                ann.key === annotationKey.SQL_ID.getCode()
            )
            t.ok(sqlAnnotation, 'Each query should have SQL annotation')
        })

        t.end()
    })
})

test('PostgreSQL service types', (t) => {
    t.equal(pgServiceType.getCode(), 2500, 'PostgreSQL service type code should be 2500')
    t.equal(pgServiceType.name, 'POSTGRESQL', 'PostgreSQL service type name should be POSTGRESQL')
    
    t.equal(pgExecuteQueryServiceType.getCode(), 2501, 'PostgreSQL execute query service type code should be 2501')
    t.equal(pgExecuteQueryServiceType.name, 'POSTGRESQL_EXECUTE_QUERY', 'PostgreSQL execute query service type name should be POSTGRESQL_EXECUTE_QUERY')
    
    t.end()
}) 