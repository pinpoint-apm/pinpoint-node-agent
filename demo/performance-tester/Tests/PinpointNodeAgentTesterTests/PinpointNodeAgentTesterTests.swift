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
        let timer = Timer
                .publish(every: 1.0, on: .main, in: .common)
                .autoconnect()
        
        let subscription = timer
            .flatMap({ index -> AnyPublisher<String, PinpointNodeAgentTester.Error> in
                return tester.request()
            })
            .scan(0) { index, _ in index + 1 }
            .sink(receiveCompletion: { result in
                print("receiveCompletion: \(result)")
            }, receiveValue: { data in
                print("receiveValue: \(data)")
                
                if data > 10 {
                    timer.upstream.connect().cancel()
                }
            })
        subscription.store(in: &subscriptions)
            
        waitForExpectations(timeout: 2 * 24 * 60 * 60)
    }

    static var allTests = [
        ("testExample", testPerformanceTest),
    ]
}
