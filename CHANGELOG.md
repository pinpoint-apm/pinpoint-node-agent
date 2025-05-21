# Changelog
All notable changes to Pinpoint Node.js agent will be documented in this file.

## [1.0.0] - 2025-05-22
### Added
- [[#214](https://github.com/pinpoint-apm/pinpoint-node-agent/issues/214)] Support Active Request

    <img width="611" alt="Image" src="https://github.com/user-attachments/assets/d3c3c02e-2e0f-461e-a958-0e68fbd92442" />
- [[#290](https://github.com/pinpoint-apm/pinpoint-node-agent/issues/290)] Added support for displaying the Agent Name in the Inspector.  The Agent Name, configurable via the `PINPOINT_AGENT_NAME` environment variable, is now visible within the Inspector. This allows for easier identification and management of individual agents within the Pinpoint system.

    <img width="611" alt="Image" src="https://github.com/user-attachments/assets/8022baa4-8b38-4553-9c12-88de17bc8f22" />
- [[#265](https://github.com/pinpoint-apm/pinpoint-node-agent/issues/265)] Support MongoDB
- [[#216](https://github.com/pinpoint-apm/pinpoint-node-agent/issues/216)] [Fetch API with Undici in Node.js](https://nodejs.org/en/learn/getting-started/fetch)
   * Since the Undici library requires Node.js >=20.18.1, please ensure your application’s Node.js version is compatible before adopting fetch or undici.
- [[#317](https://github.com/pinpoint-apm/pinpoint-node-agent/issues/317)] Warning message Warning: Collector returned 13 INTERNAL error. Too much Span data may be sent. Try increasing PINPOINT_SAMPLING_RATE to reduce traffic.

### Fixed
- [[#291](https://github.com/pinpoint-apm/pinpoint-node-agent/issues/291)] Resolved an issue where the Pinpoint Node Agent would occasionally disappear from the Inspector. This fix ensures that the Agent remains consistently visible in the Inspector.
- [[#303](https://github.com/pinpoint-apm/pinpoint-node-agent/pull/303)] fix: fix remote address fn ([Thanks @YangJonghun](https://github.com/YangJonghun))
- [[#309](https://github.com/pinpoint-apm/pinpoint-node-agent/issues/309)]PINPOINT_TRACE_EXCLUSION_URL_PATTERN not respected

### ⚠️ Breaking Changes
- **The Pinpoint Node.js Agent can use Node above v18 or higher updated**: The minimum required Node.js version has been updated from `v14` to `v18`. The Node.js fetch API now includes a version check. If the Node.js runtime version is below v18, an error will be thrown to prevent unsupported usage.
- **AgentId no longer required**: The `AgentId` field is now optional. If an `AgentId` is not provided, it will be automatically generated. This change may affect systems or scripts that previously relied on manually setting the `AgentId`.
- **Agent Name Added**: The `Agent Name` field is now a new optional configuration and can be set as a user-defined value with a maximum length of 255 characters. Developer can optionally use the pod name or any other identifier as the Agent Name. Ensure that your configuration aligns with this new behavior.
- Added a waring message when the PINPOINT_SAMPLING_RATE is set too low, causing excessive span data to be sent to the collector. If the collector cannot handle the data and return an error to Pinpoint Node agent, a warning is now logged advising users to increase the PINPOINT_SAMPLING_RATE.

## [0.8.7] - 2025-03-14
### Added
- [[#290](https://github.com/pinpoint-apm/pinpoint-node-agent/issues/290)] Added support for displaying the Agent Name in the Inspector.  The Agent Name, configurable via the `PINPOINT_AGENT_NAME` environment variable, is now visible within the Inspector. This allows for easier identification and management of individual agents within the Pinpoint system.

    <img width="611" alt="Image" src="https://github.com/user-attachments/assets/8022baa4-8b38-4553-9c12-88de17bc8f22" />

### Fixed
- [[#291](https://github.com/pinpoint-apm/pinpoint-node-agent/issues/291)] Resolved an issue where the Pinpoint Node Agent would occasionally disappear from the Inspector. This fix ensures that the Agent remains consistently visible in the Inspector.

### ⚠️ Breaking Changes
- **The Pinpoint Node.js Agent can use Node above v14 or higher updated**: The minimum required Node.js version has been updated from `v10` to `v14`. This change was made because the CI environment no longer supports testing on Node.js `v10` and `v12`. As a result, compatibility with these older versions cannot be guaranteed. Please ensure your environment is running Node.js `v14` or higher.
- **AgentId no longer required**: The `AgentId` field is now optional. If an `AgentId` is not provided, it will be automatically generated. This change may affect systems or scripts that previously relied on manually setting the `AgentId`.
- **Agent Name Added**: The `Agent Name` field is now a new optional configuration and can be set as a user-defined value with a maximum length of 255 characters. Developer can optionally use the pod name or any other identifier as the Agent Name. Ensure that your configuration aligns with this new behavior.

## [0.8.6] - 2024-07-17
### Changed
- [[#193](https://github.com/pinpoint-apm/pinpoint-node-agent/issues/193)] Update gRPC version v1.11.0 from v1.2.3
### Fixed
- [[#200](https://github.com/pinpoint-apm/pinpoint-node-agent/issues/200)] Fix package.json error
### Removed
- [[#200](https://github.com/pinpoint-apm/pinpoint-node-agent/issues/200)] Remove no needs resolutions for semver
- [[#200](https://github.com/pinpoint-apm/pinpoint-node-agent/issues/200)] Remove no needed files in npm published package
- [[#195](https://github.com/pinpoint-apm/pinpoint-node-agent/issues/195)] Remove no used modules mysql, mysql2 syntax errors below v0.9

## [0.8.5] - 2024-05-13
### Fixed
- #190 Remove JSON.stringify on Info Logger

## [0.8.4] - 2024-05-03
### Changed
- #186 Change error log level to info log

## [0.9.0] - 2024-04-30
### Added
- #86 Express with method name
- #155 SQL UID
- #140 AsyncLocalStorage above node@16.4
- #150 location and filename and linenumber
- #87 HTTP param
### Fixed
- #101 Nested Async call
- #171 Fix DisableTrace outgoing request HTTP header

## [0.8.3] - 2021-11-19
### Fixed
- #93 Fix Agent ID length validator

## [0.8.2] - 2021-05-10
### Fixed
- #73 fix require.main undefined error by webpack and node -r pinpoint-node-agent

## [0.8.1] - 2021-04-30
### Fixed
- #63 Fix ERR_STREAM_WRITE_AFTER_END on Node v14
- #67 gRPC client side and Bidirectional streams highWaterMark guard

### Added
- #70 gRPC client side stream deadline configuration

## [0.8.0] - 2021-03-15
### Added
- #49 Retry unary stream(requestAgentInfo, requestApiMetaData and requestStringMetaData)
- #35 Remove find-node-modules
- #40 Github action

### Changed
- #33 Transition to gRPC Pure JavaScript Client

### Fixed
- #34 urijs npm audit security report

## [0.7.2] - 2021-01-05
### Fixed
- #27 Fix gRPC client side streaming memory leak
- #28 Fix security alert CVE-2020-28168
- #21 Fix a npm audit security report

## [0.7.1] - 2020-11-13
### Added
- #17 Support Ant style excludeurl
### Fixed
- #12 Fix app crash without callback function in redis instrumentation module(by @wormslab)
- #14 If it detects that the app is using core-js v2.4 or lower, disable the function using the v8 module.

## [0.7.0-rc.0] - 2020-10-16
### Added
- Implementation Outgoing request header 'pinpoint-sampled' "s0"
- Support Pinpoint-SpanID, Pinpoint-pSpanID gRPC long type

### Fixed
- Could not be traced when requesting outgoing request from JVM server to Node server
- Fixed no agent Data
- Fixed no needs that the spantrunk is transmitted to the collector.

## [0.6.2] - 2020-7-20
### Fixed
- Fix Ping stream close a bug
- Fix that the Inspector shutdown server status icon was exposed.

## [0.6.1] - 2020-7-02
### Fixed
- Fix TypeError: c.toArray is not a function error in mongodb-core hook module

## [0.6.0] - 2020-6-26
### Added
- docker env auto detection
### Changed
- The protocol that connects with the Collector has been changed from Thrift to gRPC.
- The agent version refers to the value of Package.json.
### Breaking Changes
- Agents with versions lower than 0.6.0 have a bug in which the server list is not exposed after 30 minutes in the container environment. Servers using the container environment should be upgraded to 0.6.0 or higher.

## [0.5.2] - 2020-6-03
### Added
- Pinpoint ping feature implementation
### Fixed
- Fixed agent version from package.json
### Breaking Changes
- Fixed a bug where the server list was not displayed in the Inspector when container=true because Pinpoint Ping was not implemented.

## [0.5.1] - 2020-5-27
### Fixed
- Disable Active thread count default configuration
- Fixed incoming trace sampling bug

## [0.5.0] - 2020-5-21
### Added
- Support async hook outgoing request in HTTPS module

### Fixed
- Fixed the endpoint and destinationId of SpanEvent were missing
- Fixed a compatibility bug with network matrix in PM2 and Sentry
- Fixed wrong outgoing request annotations type
- Fixed redis module call stack depth and wrong get data

## [0.0.16] - 2019-11-12
### Changed
- Node.js varabiles of environment variables convert to number, boolean, string types #85
