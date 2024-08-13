/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class OptionsBuilder {
    constructor() {
        this.options = {
            interceptors: []
        }
    }
    
    addInterceptor(interceptor) {
        if (typeof interceptor !== 'function') {
            return this
        }
        
        this.options.interceptors.push(interceptor)
        return this
    }

    setGrpcServiceConfig(serviceConfig) {
        if (typeof serviceConfig !== 'string') {
            return this
        }

        this.options['grpc.service_config'] = serviceConfig
        return this
    }

    build() {
        return this.options
    }
}

module.exports = OptionsBuilder