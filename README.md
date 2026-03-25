# Pinpoint Node.js Agent
This is the official Node.js agent for [Pinpoint](https://github.com/naver/pinpoint).

If you have any feedback or questions,
please post them on the [Discuss issues](https://github.com/naver/pinpoint-node-agent/issues).

## Table of Contents
- [Installation and Getting Started](#installation-and-getting-started)
- [Configuration](#configuration)
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

ES6
```ecmascript 6
  import 'pinpoint-node-agent'
```

CommonJS
```javascript
  require('pinpoint-node-agent')
```

#### Next.js
In Next.js, use `NODE_OPTIONS` in `package.json`:
```json
"scripts": {
  "build": "next build",
  "dev": "next dev --turbopack",
  "start": "NODE_OPTIONS=--require=pinpoint-node-agent next start"
}
```

> **Note:** `PINPOINT_TRACE_EXCLUSION_URL_PATTERNS` cannot be set from a `.env` file. Use a shell script instead:

```json
"scripts": {
  "start": "./start.sh"
}
```

```sh
#!/bin/bash
export PINPOINT_TRACE_EXCLUSION_URL_PATTERNS="/health_check,/admin/**"
export PINPOINT_APPLICATION_NAME="your-app-name"
NODE_OPTIONS=--require=pinpoint-node-agent next start
```

```sh
chmod +x start.sh
```

## Configuration

### Environment Variables
Based on the [pinpoint-config-default.json](/lib/pinpoint-config-default.json) file, only necessary parts are set as environment variables.

name | default | description
-----|---------|------------
PINPOINT_AGENT_ID |  | Optional (≤24 chars). Auto-generated random hex if unset. Pattern: `[a-zA-Z0-9._-]+`.
PINPOINT_AGENT_NAME |  | Recommended. Shown in Inspector UI (e.g. pod name, hostname). ≤255 chars. Pattern: `[a-zA-Z0-9._-]+`.<br><img width="611" alt="Agent Name in Inspector" src="https://github.com/user-attachments/assets/8022baa4-8b38-4553-9c12-88de17bc8f22" />
PINPOINT_APPLICATION_NAME | | **Required.** App name (≤24 chars). Multiple agents can share one name. Pattern: `[a-zA-Z0-9._-]+`.
PINPOINT_COLLECTOR_IP | localhost | Pinpoint collector address. e.g. `192.168.0.1`
PINPOINT_SAMPLING_RATE | 10 | Sampling ratio `1/N`. Default `10` = ~10%. See [Performance tester](/demo/performance-tester).
PINPOINT_LOGGER_LEVELS |  | Comma-separated logger levels. e.g. `default-logger=INFO,grpcLogger=SILENT`
PINPOINT_ENABLE | true | Set `false` to disable the agent.
PINPOINT_CONTAINER | false | Docker/Kubernetes mode. Auto-detected from `/.dockerenv`, `/proc/self/cgroup`, or `KUBERNETES_SERVICE_HOST`.
PINPOINT_TRACE_EXCLUSION_URL_PATTERNS |  | Comma-separated URL patterns. e.g. `/health_check,/admin/**`. Replaces old `PINPOINT_TRACE_EXCLUSION_URL_PATTERN` (still recognized; plural form takes precedence). [Unit tests](https://github.com/pinpoint-apm/pinpoint-node-agent/blob/01fcbdefe5a0ffba9c957bee0da3fb7397638182/test/utils/ant-path-matcher.test.js#L332)
PINPOINT_TRACE_EXCLUSION_URL_CACHE_SIZE | | Cache for fixed-pathname URLs. Unnecessary for dynamic paths like `/user/1000`. [Unit tests](https://github.com/pinpoint-apm/pinpoint-node-agent/blob/01fcbdefe5a0ffba9c957bee0da3fb7397638182/test/utils/ant-path-matcher.test.js#L447)
PINPOINT_HTTP_STATUS_CODE_ERRORS | 5xx,401,403 | HTTP status codes treated as errors.
PINPOINT_FEATURES_URI_STATS | true | Set `false` to disable URI stats.
PINPOINT_FEATURES_URI_STATS_HTTP_METHOD | false | Include HTTP method in URI key (e.g. `GET /path`).
PINPOINT_FEATURES_URI_STATS_CAPACITY | 1000 | Max URI patterns per snapshot window.
PINPOINT_FEATURES_URI_STATS_TIME_WINDOW |  | Snapshot window in ms (default: `30000`).
PINPOINT_FEATURES_URI_STATS_USE_USER_INPUT | true | Use user-defined URI template when available. Set a custom URI template on `req`: `req['pinpoint.metric.uri-template'] = '/my/uri'`
PINPOINT_FEATURES_EXCEPTION_STATS | true | Set `false` to disable exception stats. When `exceptionStats` config is not set, the feature is disabled.
PINPOINT_FEATURES_EXCEPTION_STATS_MAX_DEPTH | 10 | Max depth for `Error.cause` chain traversal.

Custom URI template example:
```javascript
const handler = function(req, res) {
  req['pinpoint.metric.uri-template'] = '/user/input/uri/from/pages'
  res.status(200).json({ name: 'custom-uri' })
}
```

### User Configuration File (`pinpoint-config.json`) — since v1.4.0
From [#404](https://github.com/pinpoint-apm/pinpoint-node-agent/issues/404) onward, the agent loads `pinpoint-config.json` automatically:

1. The directory containing your entry script (`require.main.filename`).
2. The current working directory (`process.cwd()`).

If neither location contains the file, built-in defaults are used.

> **Tip:** With `node -r pinpoint-node-agent`, `require.main` can be temporarily undefined. Place `pinpoint-config.json` in `process.cwd()` or use environment variables.

Example layout:
```
my-service/
├─ package.json
├─ server.js
└─ pinpoint-config.json
```

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
