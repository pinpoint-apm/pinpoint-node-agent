# Pinpoint Node.js Agent
This is the official Node.js agent for [Pinpoint](https://github.com/naver/pinpoint).

If you have any feedback or questions,
please post them on the [Discuss issues](https://github.com/naver/pinpoint-node-agent/issues).


## Installation and getting started
### 1. Install
Install with [npm](https://www.npmjs.com/):
```sh
npm install --save pinpoint-node-agent
```
Install with [yarn](https://yarnpkg.com):
```sh
yarn add pinpoint-node-agent
```

### 2. Adding a code

To run Pinpoint agent for your own applications, make sure you have the prerequisites in place first.

ES6
```ecmascript 6
  import 'pinpoint-node-agent'
```

CommonJS
```javascript
  require('pinpoint-node-agent')
```

#### Next.js
In Next.js application, the Pinpoint Node Agent can be integrated:
- `package.json` using `NODE_OPTIONS`
#### Package.json
```
  "scripts": {
    "build": "next build",
    "dev": "next dev --turbopack",
    "start": "NODE_OPTIONS=--require=pinpoint-node-agent next start"
  },
```
The `PINPOINT_TRACE_EXCLUSION_URL_PATTERN` value cannot be set using environment variables from a `.env` file. While there are alternative approaches, one option is to modify the `"start"` script in `package.json` to point to a shell script (e.g., `start.sh`) where common environment variables can be configured.

##### Example
Update the `package.json`:
```json
"scripts": {
  "start": "./start.sh"
}
```

Create a `start.sh` file:
```sh
#!/bin/bash

export PINPOINT_TRACE_EXCLUSION_URL_PATTERN="/health_check,/admin/**"
export PINPOINT_APPLICATION_NAME="your-app-name"

# 2. Run Next.js with Pinpoint agent
NODE_OPTIONS=--require=pinpoint-node-agent next start
```

Make the script executable:
```sh
chmod +x start.sh
```

#### Webpack with `node -r` (required: above v0.8.2)
In Node with Webpack, if the Pinpoint Node agent cannot hook the HTTP module, it is the case that http.createServer is called first in the JS code compiled by webpack.

The'pinpoint-node-agent' require or import in the source code should be deleted.
```
$ node -r pinpoint-node-agent dist/entry.js
```

If you are using pm2, use node-args(CLI) or node_args(Ecosystem File).
```
module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    'node_args': ['-r', 'pinpoint-node-agent']
  }]
}
```

### 3. Configuration with Environment variables
Based on the [pinpoint-config-default.json](/lib/pinpoint-config-default.json) file, only necessary parts are set as environment variables.

The PINPOINT_AGENT_ID, PINPOINT_AGENT_NAME and PINPOINT_APPLICATION_NAME pattern are `[a-zA-Z0-9\\._\\-]+`.


### ⚠️ v0.8.7 or v1.0 higher Breaking Changes
- **AgentId no longer required**: The `AgentId` field is now optional. If an `AgentId` is not provided, it will be automatically generated. This change may affect systems or scripts that previously relied on manually setting the `AgentId`.
- **Agent Name Added**: The `Agent Name` field is now a new optional configuration and can be set as a user-defined value with a maximum length of 255 characters. Developers can optionally use the pod name or any other identifier as the Agent Name. Ensure that your configuration aligns with this new behavior.

  <img width="611" alt="Image" src="https://github.com/user-attachments/assets/8022baa4-8b38-4553-9c12-88de17bc8f22" />

name | default | description
-----|---------|------------
PINPOINT_AGENT_ID |  | The maximum length is 24. If you don't set an Agent ID, it will be set to a random hex value.
PINPOINT_AGENT_NAME |  | The maximum length is 255. Agent Name is optional value. Agent names should be set up so that they make sense to humans. After you set the Agent Name, it appears in the Inspector.
PINPOINT_APPLICATION_NAME | | meaningful name of the app. an application name can have multiple PINPOINT_AGENT_ID. The maximum length is 24. a required variable.
PINPOINT_COLLECTOR_IP | localhost | The address that the Pinpoint collector. ex) 192.168.0.1
PINPOINT_SAMPLING_RATE | 10 | Sample rate of incoming HTTP or HTTPS request. The value is calculated as 1/value.
PINPOINT_LOG_LEVEL | WARN | Log level
PINPOINT_ENABLE | true | If you set it to false, the agent will not work.
PINPOINT_CONTAINER | false | Whether to use docker or kubernetes. If the PINPOINT_CONTAINER environment variable is not set, the agent analyzes the'/.dockerenv' and'/proc/self/cgroup' files to determine whether to use the Docker container. If the KUBERNETES_SERVICE_HOST environment variable exists, it is determined that it is the kubernetes environment and changes it to the true value.
PINPOINT_TRACE_EXCLUSION_URL_PATTERN |  | comma-separated string. ex) `/health_check,/admin/**` or [Unit tests](https://github.com/pinpoint-apm/pinpoint-node-agent/blob/01fcbdefe5a0ffba9c957bee0da3fb7397638182/test/utils/ant-path-matcher.test.js#L332)
PINPOINT_TRACE_EXCLUSION_URL_CACHE_SIZE | | If the app is designed so that the pathname of the URL is fixed, if the cache size is set, the pathname of the frequently used URL does not match with patterns. In case of using query for pathname like `/user/1000`, cache is unnecessarily. [Unit tests](https://github.com/pinpoint-apm/pinpoint-node-agent/blob/01fcbdefe5a0ffba9c957bee0da3fb7397638182/test/utils/ant-path-matcher.test.js#L447)
PINPOINT_PROFILER_SQL_STAT | false | SQL uid
PINPOINT_TRACE_LOCATION_AND_FILENAME_OF_CALL_SITE | false | CallSite line number and filename
PINPOINT_HTTP_STATUS_CODE_ERRORS | 5xx,401,403 | Comma-separated list of HTTP status codes that should be treated as errors. When a response matches one of these codes, the agent will record the request as an error in Pinpoint. You can customize this list to include any status codes relevant to your application's error.

### Agent ID
The agent ID is used as the identifier per the server or node. You need to set the hostname or node identifier(The maximum length is 24) on the server.
```
PINPOINT_AGENT_ID=${HOSTNAME} pm2 start ~/service/bin/pm2_start.json​
```


## Supported Modules
* Express 4
* Koa(koa-router >=5.2.0 <8)
* HTTP, HTTPS
* Redis, ioredis(>=2.0.0 <5.0.0)
* mysql and mysql2
* mongoDB driver v4.0 or higher
* [Fetch API with Undici in Node.js](https://nodejs.org/en/learn/getting-started/fetch)
* Next.js

## Agent - Collector compatibility table
Agent Version | Collector 1.x | Collector 2.x | Collector 3.x
------------- | --------------- | --------------- | ---------------
above v0.8 | no      | yes | yes

## Sampling rate
If you use [Performance tester for sampling rate](/demo/performance-tester), you can review while changing the sampling rate of the node agent of the Node application.

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
