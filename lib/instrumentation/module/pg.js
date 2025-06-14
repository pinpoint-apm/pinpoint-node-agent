/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const semver = require('semver')
const log = require('../../utils/logger')
const InstrumentMethod = require('../instrument-method')
const PostgreSQLQueryInterceptor = require('./pg/pg-query-interceptor')
const databaseInfoSymbol = require('./pg/pg-database-information-symbol')

// Support pg versions 7.x and 8.x
module.exports = function (agent, version, pg) {
  if (!semver.satisfies(version, '>=7.0.0')) {
    log.debug('pg version %s not supported - aborting...', version)
    return pg
  }

  const traceContext = agent.getTraceContext()
  
  try {
    // Hook Client prototype methods instead of constructor
    if (pg.Client && pg.Client.prototype) {
      const originalConnect = pg.Client.prototype.connect
      if (originalConnect && typeof originalConnect === 'function') {
        pg.Client.prototype.connect = function(...args) {
          // Store database connection info from config
          const config = this.connectionParameters || {}
          this[databaseInfoSymbol] = {
            host: config.host || 'localhost',
            port: config.port || 5432,
            database: config.database,
            user: config.user
          }
          
          // Instrument query method after connection setup
          if (this.query && typeof this.query === 'function' && !this.__pinpoint_instrumented) {
            InstrumentMethod.make(this, 'query', traceContext).addScopedInterceptor(new PostgreSQLQueryInterceptor('Client'))
            this.__pinpoint_instrumented = true
          }
          
          return originalConnect.apply(this, args)
        }
      }
    }
    
    // Hook Pool more carefully to avoid constructor issues
    if (pg.Pool && typeof pg.Pool === 'function') {
      const OriginalPool = pg.Pool
      
      // Create a new Pool constructor that properly sets up instrumentation
      function InstrumentedPool(config) {
        // Use proper class instantiation
        const pool = Reflect.construct(OriginalPool, [config])
        
        // Store database connection info
        pool[databaseInfoSymbol] = {
          host: config?.host || 'localhost',
          port: config?.port || 5432,
          database: config?.database,
          user: config?.user
        }
        
        // Instrument query method if it exists and hasn't been instrumented yet
        if (pool.query && typeof pool.query === 'function' && !pool.__pinpoint_instrumented) {
          InstrumentMethod.make(pool, 'query', traceContext).addScopedInterceptor(new PostgreSQLQueryInterceptor('Pool'))
          pool.__pinpoint_instrumented = true
        }
        
        return pool
      }
      
      // Properly inherit from the original constructor
      InstrumentedPool.prototype = OriginalPool.prototype
      Object.setPrototypeOf(InstrumentedPool, OriginalPool)
      
      // Copy all static properties and methods
      for (const prop of Object.getOwnPropertyNames(OriginalPool)) {
        if (prop !== 'prototype' && prop !== 'name' && prop !== 'length') {
          try {
            const descriptor = Object.getOwnPropertyDescriptor(OriginalPool, prop)
            if (descriptor) {
              Object.defineProperty(InstrumentedPool, prop, descriptor)
            }
          } catch (e) {
            // Ignore property copying errors
          }
        }
      }
      
      // Replace the Pool constructor
      pg.Pool = InstrumentedPool
    }
    
  } catch (e) {
    log.error('Failed to instrument PostgreSQL:', e)
  }

  return pg
} 