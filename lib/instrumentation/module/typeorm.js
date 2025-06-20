/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const semver = require('semver')
const log = require('../../utils/logger')
const InstrumentMethod = require('../instrument-method')
const TypeORMQueryRunnerInterceptor = require('./typeorm/typeorm-query-runner-interceptor')
const TypeORMCreateQueryRunnerInterceptor = require('./typeorm/typeorm-create-query-runner-interceptor')
const databaseInfoSymbol = require('./typeorm/typeorm-database-information-symbol')

// Support TypeORM versions 0.3.x
module.exports = function (agent, version, typeorm) {
  if (!semver.satisfies(version, '>=0.3.0')) {
    log.debug('typeorm version %s not supported - aborting...', version)
    return typeorm
  }

  const traceContext = agent.getTraceContext()
  
  try {
    // Hook into DataSource prototype methods instead of constructor
    if (typeorm.DataSource && typeorm.DataSource.prototype) {
      // Instrument initialize method
      const originalInitialize = typeorm.DataSource.prototype.initialize
      if (originalInitialize) {
        typeorm.DataSource.prototype.initialize = function(...args) {
          // Store database info on this instance
          if (this.options) {
            this[databaseInfoSymbol] = {
              type: this.options.type,
              host: this.options.host,
              port: this.options.port,
              database: this.options.database,
              username: this.options.username
            }
          }
          
          const result = originalInitialize.apply(this, args)
          
          // After initialization, instrument query-related methods
          if (this.query && typeof this.query === 'function') {
            InstrumentMethod.make(this, 'query', traceContext).addScopedInterceptor(new TypeORMQueryRunnerInterceptor('DataSource'))
          }
          
          // Instrument createQueryRunner method
          if (this.createQueryRunner && typeof this.createQueryRunner === 'function') {
            InstrumentMethod.make(this, 'createQueryRunner', traceContext).addScopedInterceptor(new TypeORMCreateQueryRunnerInterceptor())
            
            const originalCreateQueryRunner = this.createQueryRunner.bind(this)
            this.createQueryRunner = function(...queryRunnerArgs) {
              const queryRunner = originalCreateQueryRunner.apply(this, queryRunnerArgs)
              
              if (queryRunner && queryRunner.query && typeof queryRunner.query === 'function') {
                // Instrument query method
                InstrumentMethod.make(queryRunner, 'query', traceContext).addScopedInterceptor(new TypeORMQueryRunnerInterceptor('QueryRunner'))
              }
              
              return queryRunner
            }
          }
          
          return result
        }
      }
    }

  } catch (e) {
    log.error('Failed to instrument TypeORM:', e)
  }

  return typeorm
} 