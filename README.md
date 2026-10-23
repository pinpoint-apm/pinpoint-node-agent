# Pinpoint Node.js Agent
The official Node.js agent for [Pinpoint](https://github.com/pinpoint-apm/pinpoint).

For feedback or questions, open an issue in [pinpoint-apm/pinpoint-node-agent](https://github.com/pinpoint-apm/pinpoint-node-agent/issues).

## Table of Contents
- [Installation and Getting Started](#installation-and-getting-started)
- [Configuration](#configuration)
  - [Agent Identification: `v4` and `v3`](#agent-identification-v4-and-v3)
  - [Environment Variables](#environment-variables)
  - [Configuration File (`pinpoint-config.json`)](#configuration-file-pinpoint-configjson)
- [Supported Modules](#supported-modules)
- [Agent - Collector Compatibility](#agent---collector-compatibility)
- [Migrating `pinpoint-config.json` to v1.4](#migrating-pinpoint-configjson-to-v14)
- [Contributing](#contributing)
- [License](#license)

## Installation and Getting Started
Requires Node.js 20.18.1 or later.

### 1. Install
With [npm](https://www.npmjs.com/):
```sh
npm install --save pinpoint-node-agent
```
With [yarn](https://yarnpkg.com):
```sh
yarn add pinpoint-node-agent
```

### 2. Set the Required Names
The agent identifies itself with `v4` by default, which requires an application name and a service name:
```sh
export PINPOINT_APPLICATION_NAME="your-app-name"
export PINPOINT_SERVICE_NAME="your-service-name"
```
With `v3`, only the application name is required. See [Agent Identification](#agent-identification-v4-and-v3).

### 3. Load the Agent
Load the agent before any other module.

ES modules
```javascript
import 'pinpoint-node-agent'
```

CommonJS
```javascript
require('pinpoint-node-agent')
```

#### Next.js
Use `NODE_OPTIONS` in `package.json`:
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
export PINPOINT_APPLICATION_NAME="your-app-name"
export PINPOINT_SERVICE_NAME="your-service-name"
export PINPOINT_TRACE_EXCLUSION_URL_PATTERNS="/health_check,/admin/**"
NODE_OPTIONS=--require=pinpoint-node-agent next start
```

```sh
chmod +x start.sh
```

## Configuration
Values are resolved in this order: environment variables, then [`pinpoint-config.json`](#configuration-file-pinpoint-configjson), then the built-in [defaults](/lib/pinpoint-config-default.json).

If a required name is missing or invalid, the agent disables itself and lists the errors in the `[Pinpoint Agent] Configuration` log.

### Agent Identification: `v4` and `v3`
The agent identifies itself to the collector with `v4` by default, the same scheme as the Java agent 4.0 `pinpoint.modules.uid.version` default. `v4` requires Collector 4.0 or later; for older collectors, set `PINPOINT_COLLECTOR_PROTOCOL_VERSION` (json `collector.protocolVersion`) to `v3`. Any value other than `v3` or `v4` falls back to `v4`.

| | `v4` (default) | `v3` |
|---|---|---|
| Collector | 4.0 or later | 2.x or later |
| `protocol.version` gRPC header | `400` | `100` |
| Agent ID | Always a generated 22-char base64 UUIDv7; `PINPOINT_AGENT_ID` is ignored | `PINPOINT_AGENT_ID` (≤24 chars), or a generated 22-char base64 UUIDv7 if unset |
| Agent name | Optional, ≤254 chars; defaults to the agent ID | Optional, ≤255 chars; defaults to the agent ID |
| Application name | **Required**, ≤254 chars | **Required**, ≤254 chars |
| Service name | **Required**, ≤254 chars; sent as the `servicename` gRPC header | Not used |

All names and IDs allow only `[a-zA-Z0-9._-]`.

### Environment Variables
name | default | description
-----|---------|------------
PINPOINT_APPLICATION_NAME | | **Required.** Application name. Multiple agents can share one name. See [Agent Identification](#agent-identification-v4-and-v3) for limits.
PINPOINT_SERVICE_NAME | | **Required with `v4`.** Service name. Ignored with `v3`.
PINPOINT_AGENT_NAME | | Recommended. Shown in the Inspector UI (e.g. pod name, hostname). Defaults to the agent ID.<br><img width="611" alt="Agent Name in Inspector" src="https://github.com/user-attachments/assets/8022baa4-8b38-4553-9c12-88de17bc8f22" />
PINPOINT_AGENT_ID | | `v3` only. Generated if unset. Ignored with `v4`, which always generates it.
PINPOINT_COLLECTOR_IP | localhost | Collector address, e.g. `192.168.0.1`.
PINPOINT_COLLECTOR_SPAN_PORT | 9993 | Collector span port.
PINPOINT_COLLECTOR_STAT_PORT | 9992 | Collector stat port.
PINPOINT_COLLECTOR_TCP_PORT | 9991 | Collector agent and metadata port.
PINPOINT_COLLECTOR_PROTOCOL_VERSION | v4 | `v4` or `v3` (case-insensitive). See [Agent Identification](#agent-identification-v4-and-v3).
PINPOINT_ENABLE | true | Set `false` to disable the agent.
PINPOINT_SAMPLING | true | Set `false` to disable sampling.
PINPOINT_SAMPLING_RATE | 10 | Sampling ratio `1/N`. `10` samples about 10% of transactions. See [Performance tester](/demo/performance-tester).
PINPOINT_CONTAINER | false | Docker/Kubernetes mode. Auto-detected from `/.dockerenv`, `/proc/self/cgroup`, or `KUBERNETES_SERVICE_HOST`.
PINPOINT_LOGGER_LEVELS | | Comma-separated logger levels, e.g. `default-logger=INFO,grpcLogger=SILENT`.
PINPOINT_TRACE_EXCLUSION_URL_PATTERNS | | Comma-separated URL patterns to exclude from tracing, e.g. `/health_check,/admin/**`. Replaces `PINPOINT_TRACE_EXCLUSION_URL_PATTERN`, which is still recognized; the plural form takes precedence. [Unit tests](https://github.com/pinpoint-apm/pinpoint-node-agent/blob/01fcbdefe5a0ffba9c957bee0da3fb7397638182/test/utils/ant-path-matcher.test.js#L332)
PINPOINT_TRACE_EXCLUSION_URL_CACHE_SIZE | | Cache size for fixed-pathname URLs. Unnecessary for dynamic paths like `/user/1000`. [Unit tests](https://github.com/pinpoint-apm/pinpoint-node-agent/blob/01fcbdefe5a0ffba9c957bee0da3fb7397638182/test/utils/ant-path-matcher.test.js#L447)
PINPOINT_HTTP_STATUS_CODE_ERRORS | 5xx,401,403 | HTTP status codes treated as errors.
PINPOINT_FEATURES_URI_STATS | true | Set `false` to disable URI stats.
PINPOINT_FEATURES_URI_STATS_HTTP_METHOD | false | Include the HTTP method in the URI key, e.g. `GET /path`.
PINPOINT_FEATURES_URI_STATS_CAPACITY | 1000 | Max URI patterns per snapshot window.
PINPOINT_FEATURES_URI_STATS_TIME_WINDOW | 30000 | Snapshot window in ms.
PINPOINT_FEATURES_URI_STATS_USE_USER_INPUT | true | Use a user-defined URI template when available. See the example below.
PINPOINT_FEATURES_ERROR_ANALYSIS | true | Set `false` to disable error analysis.
PINPOINT_FEATURES_ERROR_ANALYSIS_MAX_DEPTH | 10 | Max depth for `Error.cause` chain traversal.

Custom URI template example:
```javascript
const handler = function(req, res) {
  req['pinpoint.metric.uri-template'] = '/user/input/uri/from/pages'
  res.status(200).json({ name: 'custom-uri' })
}
```

### Configuration File (`pinpoint-config.json`)
The file is optional. If you configure the agent with environment variables, you do not need it.

Since v1.4.0 ([#404](https://github.com/pinpoint-apm/pinpoint-node-agent/issues/404)), the agent loads `pinpoint-config.json` from the first of these locations that has it:

1. The directory containing your entry script (`require.main.filename`).
2. The current working directory (`process.cwd()`).

If neither location has the file, the built-in defaults are used.

> **Tip:** With `node -r pinpoint-node-agent`, `require.main` can be undefined at startup. Place `pinpoint-config.json` in `process.cwd()` or use environment variables.

Example layout:
```
my-service/
├─ package.json
├─ server.js
└─ pinpoint-config.json
```

Example `pinpoint-config.json`:
```json
{
  "applicationName": "your-app-name",
  "serviceName": "your-service-name",
  "agentName": "your-pod-name",
  "collector": {
    "ip": "localhost",
    "spanPort": 9993,
    "statPort": 9992,
    "tcpPort": 9991,
    "deadlineMinutes": 10,
    "protocolVersion": "v4"
  },
  "sampling": { "enable": true, "rate": 10 },
  "plugins": {
    "http": { "errorStatusCodes": "5xx,401,403" },
    "express": true,
    "koa": true
  },
  "features": {
    "uriStats": { "httpMethod": false, "capacity": 1000, "useUserInput": true },
    "errorAnalysis": { "maxDepth": 10 },
    "logLevels": { "default-logger": "WARN", "grpcLogger": "SILENT" }
  }
}
```

## Supported Modules
* HTTP, HTTPS
* Express 4 and 5
* Koa (koa-router >=5.2.0 <8)
* Next.js
* [Fetch API with Undici](https://nodejs.org/en/learn/getting-started/fetch)
* Redis, ioredis (>=2.0.0 <5.0.0)
* mysql and mysql2
* PostgreSQL (pg)
* MongoDB driver v4.0 or later

## Agent - Collector Compatibility
Agent Version | Collector 1.x | Collector 2.x | Collector 3.x | Collector 4.0
------------- | ------------- | ------------- | ------------- | -------------
v2.0 with `v4` (default) | no | no | no | yes
v2.0 with `v3` | no | yes | yes | yes
v1.4.3 | no | yes | yes | yes

## Migrating `pinpoint-config.json` to v1.4
> **If you use environment variables, no migration is needed.**

v1.4 restructured the `pinpoint-config.json` format ([before v1.4](https://github.com/pinpoint-apm/pinpoint-node-agent/blob/1.3.1/lib/pinpoint-config-default.json) → [v1.4](https://github.com/pinpoint-apm/pinpoint-node-agent/blob/1.4.0/lib/pinpoint-config-default.json)). If you have an existing `pinpoint-config.json`, rename its keys as follows:

| before v1.4 | v1.4 |
|------|------|
| `collector.span-port` | `collector.spanPort` |
| `collector.stat-port` | `collector.statPort` |
| `collector.tcp-port` | `collector.tcpPort` |
| `stream-deadline-minutes.client-side` | `collector.deadlineMinutes` |
| `http-status-code.errors` | `plugins.http.errorStatusCodes` |
| `express.enable` | `plugins.express` |
| `koa.enable` | `plugins.koa` |
| `mongo.enable` | `plugins.mongodb` |
| `redis.enable` | `plugins.redis` |
| `enabled-data-sending` | `features.dataSending` |
| `enabled-stats-monitor-sending` | `features.statsMonitoring` |
| `enabled-active-thread-count` | `features.activeThreadCount` |
| `container` | `features.container` |
| `logger-levels` | `features.logLevels` |
| _(new)_ | `features.uriStats` |
| _(new)_ | `features.errorAnalysis` |

## Contributing
Contributions via pull requests are welcome. Run the full test suite with `npm test` before opening a pull request; integration tests use [Testcontainers](https://testcontainers.com/), so Docker must be running.

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
