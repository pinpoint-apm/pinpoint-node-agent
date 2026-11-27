# Pinpoint Node.js Agent
The official Node.js agent for [Pinpoint](https://github.com/pinpoint-apm/pinpoint).

For feedback or questions, open an issue in [pinpoint-apm/pinpoint-node-agent](https://github.com/pinpoint-apm/pinpoint-node-agent/issues).

## Getting Started
Install the agent in your app:
```sh
npm install pinpoint-node-agent
```

Load the agent on the first line of the entry file, before any other module.

ES modules
```javascript
import 'pinpoint-node-agent'
```

CommonJS
```javascript
require('pinpoint-node-agent')
```

Set the names and the collector address, then start the app:
```sh
export PINPOINT_APPLICATION_NAME="your-app-name"
export PINPOINT_SERVICE_NAME="your-service-name"
export PINPOINT_AGENT_NAME="your-pod-or-host-name"
export PINPOINT_COLLECTOR_IP="your-collector-host"
node server.js
```

Other settings are also environment variables; see [Environment Variables](#environment-variables).

### Docker and Kubernetes
```dockerfile
ENV PINPOINT_APPLICATION_NAME="your-app-name" \
    PINPOINT_SERVICE_NAME="your-service-name" \
    PINPOINT_COLLECTOR_IP="your-collector-host"
CMD ["node", "server.js"]
```

In Kubernetes, name each agent after its pod:
```yaml
env:
  - name: PINPOINT_AGENT_NAME
    valueFrom:
      fieldRef:
        fieldPath: metadata.name
```

### Next.js
Load the agent with `NODE_OPTIONS` in the start script:
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
The agent identifies itself to the collector with `v4` by default, the same scheme as the Java agent 4.0 `pinpoint.modules.uid.version` default. `v4` requires Collector 4.0 or later; for older collectors, set `PINPOINT_PROTOCOL_VERSION` (json `collector.protocolVersion`) to `v3`. Any value other than `v3` or `v4` falls back to `v4`.

| | `v4` (default) | `v3` |
|---|---|---|
| Collector | 4.0 or later | 3.1 or later |
| `protocol.version` gRPC header | `400` | `100` |
| Agent ID | Always a generated 22-char base64 UUIDv7; `PINPOINT_AGENT_ID` is ignored | `PINPOINT_AGENT_ID` (≤24 chars), or a generated 22-char base64 UUIDv7 if unset |
| Agent name | Optional, ≤254 chars; defaults to the agent ID | Optional, ≤255 chars; defaults to the agent ID |
| Application name | **Required**, ≤254 chars | **Required**, ≤254 chars |
| Service name | **Required**, 3 to 254 chars; sent as the `servicename` gRPC header | Not used |

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
PINPOINT_COLLECTOR_TCP_PORT | 9991 | Collector agent port, also used for metadata and commands.
PINPOINT_SPAN_BATCH_SIZE | 20 | Spans and span chunks sent in one `SendSpanBatch` request, up to 1000.
PINPOINT_SPAN_DEADLINE_MILLIS | 500 | How long in ms queued spans wait before they are sent in a batch smaller than the size.
PINPOINT_SPAN_MAX_REQUESTS | 10 | Max `SendSpanBatch` requests awaiting a response. Batches beyond it wait; when 1000 spans are waiting, the oldest is discarded.
PINPOINT_SPAN_COMPRESSION | gzip | `gzip` or `none`. Compression of `SendSpanBatch` requests. If the collector cannot decompress gzip, the agent logs a warning and sends uncompressed batches.
PINPOINT_STATS_COMPRESSION | gzip | `gzip` or `none`. Compression of URI stats. If the collector cannot decompress gzip, the agent logs a warning and sends them uncompressed.
PINPOINT_PROTOCOL_VERSION | v4 | `v4` or `v3` (case-insensitive). See [Agent Identification](#agent-identification-v4-and-v3).
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
PINPOINT_FEATURES_ERROR_ANALYSIS_MAX_DEPTH | 10 | Max depth for `Error.cause` chain traversal. Up to 10.

Custom URI template example:
```javascript
const handler = function(req, res) {
  req['pinpoint.metric.uri-template'] = '/user/input/uri/from/pages'
  res.status(200).json({ name: 'custom-uri' })
}
```

#### Leak Detection
Off by default. Turn them on when you suspect a leak; the values appear in the Inspector.

name | default | description
-----|---------|------------
PINPOINT_FEATURES_GC_STATS | false | Memory leak. Set `true` to send GC count and time, shown in the Heap Usage chart. Frequent major GCs while used heap keeps growing suggest a leak. Uses a `perf_hooks` GC observer.
PINPOINT_FEATURES_FILE_DESCRIPTOR_STATS | false | File or socket leak. Set `true` to send the open file descriptor count on Linux, shown in the Open File Descriptor chart. A steadily growing count leads to `EMFILE: too many open files`.

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

The defaults are in [`lib/pinpoint-config-default.json`](lib/pinpoint-config-default.json). Set only the keys you change; the others keep their defaults.

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
Agent Version | Collector 3.x | Collector 4.0
------------- | ------------- | -------------
v2.0 with `v4` (default) | no | yes
v2.0 with `v3` | 3.1 or later | yes
v1.4.3 | yes | yes

v2.0 sends spans with the unary `SendSpanBatch` RPC, which Collector 3.1.0 and later support. With an older collector, the agent logs a warning once and stops sending spans.

v2.0 requires Node.js 22 or later.

## Migrating `pinpoint-config.json` to v2.0
> **If you use environment variables, no migration is needed.**

v2.0 groups the collector settings by collector service. If you have an existing `pinpoint-config.json`, rename its keys as follows:

| v1.4 | v2.0 |
|------|------|
| `collector.spanPort` | `collector.span.port` |
| `collector.statPort` | `collector.stats.port` |
| `collector.tcpPort` | `collector.agent.port` |

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
