# Pinpoint Node.js Agent
This is the official Node.js agent for [Pinpoint](https://github.com/naver/pinpoint).

If you have any feedback or questions,
please post them on the [Discuss issues](https://github.com/naver/pinpoint-node-agent/issues).

## Table of Contents
- [Installation and Getting Started](#installation-and-getting-started)
- [Supported Modules](#supported-modules)
- [Agent-Collector Compatibility](#agent---collector-compatibility-table)
- [Contributing](#contributing)
- [License](#license)


## Installation and Getting Started
### 1. Install
Install with [npm](https://www.npmjs.com/):
```sh
npm install --save pinpoint-node-agent
```
Install with [yarn](https://yarnpkg.com):
```sh
yarn add pinpoint-node-agent
```

### 2. Add the Agent

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

### 3. Configuration with Environment variables
Based on the [pinpoint-config-default.json](/lib/pinpoint-config-default.json) file, only necessary parts are set as environment variables.


name | default | description
-----|---------|------------
PINPOINT_AGENT_ID |  | Optional env var (≤24 chars). When left unset, the agent generates a random hex value. Allowed pattern: `[a-zA-Z0-9._-]+`.
PINPOINT_AGENT_NAME |  | Recommended. Optional env var (≤255 chars). Use meaningful labels that are shown in the Inspector UI (for example pod name or hostname). Allowed pattern: `[a-zA-Z0-9._-]+`.<br><img width="611" alt="Agent Name in Inspector" src="https://github.com/user-attachments/assets/8022baa4-8b38-4553-9c12-88de17bc8f22" />
PINPOINT_APPLICATION_NAME | | Meaningful name of the app. An application name can have multiple `PINPOINT_AGENT_ID` values. Maximum length is 24. This variable is required. Allowed pattern: `[a-zA-Z0-9._-]+`.
PINPOINT_COLLECTOR_IP | localhost | The address of the Pinpoint collector. ex) 192.168.0.1
PINPOINT_SAMPLING_RATE | 10 | Sample rate of incoming HTTP or HTTPS requests. The effective sampling ratio is `1/N` (where `N` is `PINPOINT_SAMPLING_RATE`). For example, `10` means about 10% sampling (`1/10`). Lower values increase span volume and can overload the collector. For tuning, see the [Performance tester for sampling rate](/demo/performance-tester).
PINPOINT_LOGGER_LEVELS |  | Comma-separated logger level overrides. Example: `default-logger=INFO,grpcLogger=SILENT`.
PINPOINT_ENABLE | true | If you set it to false, the agent will not work.
PINPOINT_CONTAINER | false | Whether to use Docker or Kubernetes. If `PINPOINT_CONTAINER` is not set, the agent analyzes `/.dockerenv` and `/proc/self/cgroup` to determine whether to use Docker container mode. If `KUBERNETES_SERVICE_HOST` exists, it is treated as Kubernetes and set to true.
PINPOINT_TRACE_EXCLUSION_URL_PATTERNS |  | comma-separated string. ex) `/health_check,/admin/**` or [Unit tests](https://github.com/pinpoint-apm/pinpoint-node-agent/blob/01fcbdefe5a0ffba9c957bee0da3fb7397638182/test/utils/ant-path-matcher.test.js#L332). `PINPOINT_TRACE_EXCLUSION_URL_PATTERNS` replaces `PINPOINT_TRACE_EXCLUSION_URL_PATTERN`. For backward compatibility, the old name(`PINPOINT_TRACE_EXCLUSION_URL_PATTERN`) is still recognized and applied the same way. If both are set, the plural form (`PINPOINT_TRACE_EXCLUSION_URL_PATTERNS`) takes precedence.
PINPOINT_TRACE_EXCLUSION_URL_CACHE_SIZE | | If the app is designed so that the pathname of the URL is fixed, if the cache size is set, the pathname of the frequently used URL does not match with patterns. In case of using query for pathname like `/user/1000`, cache is unnecessary. [Unit tests](https://github.com/pinpoint-apm/pinpoint-node-agent/blob/01fcbdefe5a0ffba9c957bee0da3fb7397638182/test/utils/ant-path-matcher.test.js#L447)
PINPOINT_HTTP_STATUS_CODE_ERRORS | 5xx,401,403 | Comma-separated list of HTTP status codes that should be treated as errors. When a response matches one of these codes, the agent will record the request as an error in Pinpoint. You can customize this list to include any status codes relevant to your application's error handling.
PINPOINT_FEATURES_URI_STATS | true | Set `false` to disable URI stats.
PINPOINT_FEATURES_URI_STATS_HTTP_METHOD | false | Set `true` to include HTTP method in URI stats key (for example `GET /path`).
PINPOINT_FEATURES_URI_STATS_CAPACITY | 1000 | Max number of URI patterns tracked in one snapshot window.
PINPOINT_FEATURES_URI_STATS_TIME_WINDOW |  | URI stats snapshot window in milliseconds (default: `30000` ms).
PINPOINT_FEATURES_URI_STATS_USE_USER_INPUT | true | Use user-defined URI template when available.

Set a custom URI template on `req`:
```javascript
const handler = function(req, res) {
  req['pinpoint.metric.uri-template'] = '/user/input/uri/from/pages'
  res.status(200).json({ name: 'custom-uri' })
}
```

### 4. User configuration file (`pinpoint-config.json`) — since v1.4.0
From [#404](https://github.com/pinpoint-apm/pinpoint-node-agent/issues/404) onward, the agent loads `pinpoint-config.json` automatically with the following priority:

1. The directory that contains your entry script (`require.main.filename`), e.g. the folder where `app.js` or `server.js` lives.
2. The current working directory returned by `process.cwd()` (the folder from which you executed `node` or `pm2`).

If neither location contains the file, the agent simply uses the built-in defaults.

> **Tip:** When using `node -r pinpoint-node-agent` or tools that bootstrap the agent before your app starts, `require.main` can be temporarily undefined. In that case, the second location (`process.cwd()`) must contain `pinpoint-config.json` or you can set configuration values via environment variables.

Example layout:

```
my-service/
├─ package.json
├─ server.js         # entry point (require.main)
└─ pinpoint-config.json
```

Running the app from a different folder? Make sure either the entry directory or the directory you execute from includes `pinpoint-config.json`.

## Supported Modules
* Express 4 and 5
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
