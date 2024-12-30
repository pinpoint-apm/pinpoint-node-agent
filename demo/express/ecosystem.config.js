module.exports = {
  apps: [{
    name: 'ServiceWithAgent',
    script: './bin/www',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    autorestart: true,
    max_memory_restart: '1G',
    instances: 1,
    env: {
      NODE_ENV: 'development',
      "PINPOINT_APPLICATION_NAME": "express.node.js",
      "PINPOINT_COLLECTOR_IP": "localhost",
      "PINPOINT_LOG_LEVEL": "WARN",
      "PINPOINT_SAMPLING_RATE": "10",
    },
    env_production: {
      NODE_ENV: 'production',
      "PINPOINT_APPLICATION_NAME": "express.node.js",
      "PINPOINT_COLLECTOR_IP": "localhost",
      "PINPOINT_LOG_LEVEL": "WARN",
      "PINPOINT_SAMPLING_RATE": "10",
    },
    "io": {
      "conf": {
        "metrics": {
          "http": false
        }
      }
    },
  }, {
    name: 'Service',
    script: './bin/www',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    autorestart: true,
    max_memory_restart: '1G',
    instances: 0,
    env: {
      NODE_ENV: 'development',
      PINPOINT_ENABLE: 'false'
    },
    env_production: {
      NODE_ENV: 'production',
      PINPOINT_ENABLE: 'false'
    }
  }],
}
