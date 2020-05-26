# Changelog
All notable changes to Pinpoint Node.js agent will be documented in this file.

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
