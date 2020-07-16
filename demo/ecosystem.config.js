module.exports = {
  apps : [{
    name: 'agent',
    script: 'app.js',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      "PINPOINT_ENABLE": "true",
      "PINPOINT_CONTAINER": "false",
      "PINPOINT_APPLICATION_NAME": "express.node.js",
      "PINPOINT_COLLECTOR_IP": "dev.collector.pinpoint.navercorp.com",
      "PINPOINT_LOG_LEVEL": "DEBUG"      
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],
};
