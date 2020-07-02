# Changelog
All notable changes to Pinpoint Node.js agent will be documented in this file.

## [0.6.2] - 2020-7-02
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
