const Agent = require('../lib/agent')
new Agent({
  agentId: 'dev-agent-app-test',
  applicationName: 'dev.agent.app.test',
  serviceType: 1000,
  collectorIp: '127.0.0.1',
  collectorTcpPort: 9994,
  collectorStatPort: 9995,
  collectorSpanPort: 9996,
  enabledDataSending: true,
  logLevel: 'DEBUG'
})

var express = require('express');
var app = express();

app.get('/test/express', function (req, res) {
  res.send('Hello Express!');
});

app.listen(9999, function () {
  console.log('START TEST EXPRESS');
});
