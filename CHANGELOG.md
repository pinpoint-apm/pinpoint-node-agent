# Changelog
All notable changes to Pinpoint Node.js agent will be documented in this file.

## [0.8.2] - 2021-04-23
### Fixed
- #73 fix require.main undefined error by webpack and node -r pinpoint-node-agent or agent.start()

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
