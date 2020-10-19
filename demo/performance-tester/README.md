# Performance test

You can test the difference in performance according to the pinpoint sampling value. You must install [Swift tools](https://swift.org/getting-started/#package-manager) in your test environment.

1. Change ` let url = URL(string: "http://localhost:3000")!` in PinpointNodeAgentTester.swift
2. Run below command line swift tool
```
$ swift test
Test Case '-[PinpointNodeAgentTesterTests.PinpointNodeAgentTesterTests testPerformanceTest]' passed (7.407 seconds).
```
