module.exports = {
  apps : [{
    name: 'agent',
    script: './bin/www',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    instances: 0,
    env: {
      NODE_ENV: 'development',
      "PINPOINT_CONTAINER": "false",
      // "PINPOINT_AGENT_ID": "express-node-js-id",
      "PINPOINT_APPLICATION_NAME": "express.node.js",
      "PINPOINT_COLLECTOR_IP": "localhost",
      "PINPOINT_LOG_LEVEL": "DEBUG",
      // "PINPOINT_SAMPLING_RATE": "1",
    },
    env_production: {
      NODE_ENV: 'production',
    }
  }],
};
