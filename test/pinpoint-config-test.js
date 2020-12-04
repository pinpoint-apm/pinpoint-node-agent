module.exports = {
  enable: true,
  'agent-id': 'node.test.app',
  'application-name': 'node.test.app',
  'application-type': 1400,
  collector: {
    ip: '127.0.0.1',
    'span-port': 9993,
    'stat-port': 9992,
    'tcp-port': 9991,
  },
  sampling: {
    enable: true,
    rate: 1,
  },
  'http-status-code-errors': ['5xx'],
  'enabled-stats-monitor-sending': false,
  'enabled-active-thread-count': false,
  'log-level': 'DEBUG',
  modules: {
    express: true,
    koa: true,
    mongodb: true,
    redis: true,
  },
};

