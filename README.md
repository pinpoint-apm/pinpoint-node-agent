# Pinpoint Node.js Agent
This is the official Node.js agent for [Pinpoint](https://github.com/naver/pinpoint).

If you have any feedback or questions,
please post them on the [Discuss issues](https://github.com/naver/pinpoint-node-agent/issues).


## Installation
Install with [npm](https://www.npmjs.com/):
```sh
npm install --save pinpoint-node-agent 
```
Install with [yarn](https://yarnpkg.com):
```sh
yarn add pinpoint-node-agent
```

## Quick start
1. To run Pinpoint agent for your own applications,
   make sure you have the prerequisites in place first.

ES6
```ecmascript 6
  import 'pinpoint-node-agent'  
```

CommonJS
```javascript
  require('pinpoint-node-agent')
```

## Supported Modules
* Express 4
* Koa(koa-router >=5.2.0 <8)
* HTTP, HTTPS
* Redis, ioredis(>=2.0.0 <5.0.0)
* mongodb-core(>=1.0.0)
* Elasticsearch Node client

## Agent - Collector compatibility table
Agent Version | Collector 1.x | Collector 2.0.x
------------- | --------------- | ---------------
0.6.x | no      | yes

## Environment variables
Based on the [pinpoint-config-default.json](/lib/pinpoint-config-default.json) file, only necessary parts are set as environment variables.

name | default | description
-----|---------|------------
PINPOINT_AGENT_ID |  | The maximum length is 24. a required variable.
PINPOINT_APPLICATION_NAME | | meaningful name of the app. an application name can have multiple PINPOINT_AGENT_ID. The maximum length is 24. a required variable. 
PINPOINT_COLLECTOR_IP | localhost | The address that the Pinpoint collector. ex) 192.168.0.1
PINPOINT_SAMPLING_RATE | 10 | Sample rate of incoming HTTP or HTTPS request. The value is calculated as 1/value.
PINPOINT_LOG_LEVEL | WARN | Log level
PINPOINT_ENABLE | true | If you set it to false, the agent will not work.
PINPOINT_CONTAINER | false | Whether to use docker or kubernetes. If the PINPOINT_CONTAINER environment variable is not set, the agent analyzes the'/.dockerenv' and'/proc/self/cgroup' files to determine whether to use the Docker container. If the KUBERNETES_SERVICE_HOST environment variable exists, it is determined that it is the kubernetes environment and changes it to the true value.

## Agent ID
The agent ID is used as the identifier per the server or node. You need to set the hostname or node identifier(The maximum length is 24) on the server.
```
PINPOINT_AGENT_ID=${HOSTNAME} pm2 start ~/service/bin/pm2_start.json​
```

## Sampling rate
If you use [Performance Tester](/demo/performance-tester), you can review while changing the sampling rate of the node agent of the Node application.

## No support the JVM agent features
The Pinpoint Node agent does not support the following the JVM agent features. We plan to provide more detailed app information like the JVM agent.
* Active Request
* Some inspector information(Transactions Per Second, Active Request ...)

## Contributing

We are looking forward to your contributions via pull requests.

To contribute to Pinpoint Node JS agent, you should pass all test suites and your unit tests.

## License

```
   Copyright 2020-present NAVER Corp.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
```
