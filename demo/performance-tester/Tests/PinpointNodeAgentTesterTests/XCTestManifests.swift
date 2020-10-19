import XCTest

#if !canImport(ObjectiveC)
public func allTests() -> [XCTestCaseEntry] {
    return [
        testCase(pinpoint_node_agent_testerTests.allTests),
    ]
}
#endif
