import XCTest
import Foundation
import Combine
@testable import PinpointNodeAgentTester

@available(OSX 11.0, *)
final class PinpointNodeAgentTesterTests: XCTestCase {
    var subscriptions = Set<AnyCancellable>()
    
    func testPerformanceTest() {
        let exp = expectation(description: "performace test")
        
        let tester = PinpointNodeAgentTester()
        tester.test().sink(receiveCompletion: { result in
            exp.fulfill()
        }, receiveValue: { data in
        })
        .store(in: &subscriptions)
        
        waitForExpectations(timeout: 30)
    }
    
    func testGrpcChannel() {
        let exp = expectation(description: "grpc channel test")
        
        let tester = PinpointNodeAgentTester()
        
        var timerCount = 0
        let source = Timer
                .publish(every: 1.0, on: .main, in: .common)
                .autoconnect()
                .scan(0) { index, _ in index + 1 }
        
        source.receive(on: DispatchQueue.global())
            .flatMap({ index -> AnyPublisher<String, PinpointNodeAgentTester.Error> in
                timerCount = index
                return tester.request()
            })
            .sink(receiveCompletion: { result in
                print("receiveCompletion: \(result)")
            }, receiveValue: { data in
                let thread = Thread.current.number
                print("receiveValue thread number: \(thread) data: \(data)")
                
                if timerCount > 10 {
                    exp.fulfill()
                }
            })
            .store(in: &subscriptions)
            
        waitForExpectations(timeout: 2 * 24 * 60 * 60)
    }

    static var allTests = [
        ("testExample", testPerformanceTest),
    ]
}

fileprivate enum Regexes {
  static let threadNumber = try! NSRegularExpression(pattern: "number = (\\d+)", options: .caseInsensitive)
}

extension Thread {
  public var number: Int {
    let desc = self.description
    if let numberMatches = Regexes.threadNumber.firstMatch(in: desc, range: NSMakeRange(0, desc.count)) {
      let s = NSString(string: desc).substring(with: numberMatches.range(at: 1))
      return Int(s) ?? 0
    }
    return 0
  }
}
