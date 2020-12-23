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
    
    fileprivate func requestNodeServer(_ source: Publishers.Scan<Publishers.Autoconnect<Timer.TimerPublisher>, Int>, _ tester: PinpointNodeAgentTester) {
        source.receive(on: DispatchQueue.global())
            .flatMap({ index -> AnyPublisher<String, PinpointNodeAgentTester.Error> in
                return tester.request()
            })
            .sink(receiveCompletion: { result in
                print("receiveCompletion: \(result)")
            }, receiveValue: { data in
                let thread = Thread.current.number
                print("receiveValue thread number: \(thread) data: \(data)")
            })
            .store(in: &subscriptions)
    }
    
    func testGrpcChannel() {
        let exp = expectation(description: "grpc channel test")
        
        let tester = PinpointNodeAgentTester()
        
        let source = Timer
                .publish(every: 1.0, on: .main, in: .common)
                .autoconnect()
                .scan(0) { index, _ in index + 1 }
        
        let startTime = DispatchTime.now()
        
//        requestNodeServer(source, tester)
//        requestNodeServer(source, tester)
//        requestNodeServer(source, tester)
//        requestNodeServer(source, tester)
//        requestNodeServer(source, tester)
        
        var downloadsDirectory = FileManager.default.urls(for: .downloadsDirectory, in: .userDomainMask).first!
        downloadsDirectory.appendPathComponent("channels")
        if FileManager.default.fileExists(atPath: downloadsDirectory.path) {
            try! FileManager.default.removeItem(at: downloadsDirectory)
        }
        try! FileManager.default.createDirectory(at: downloadsDirectory, withIntermediateDirectories: true, attributes: nil)
        
        source.receive(on: DispatchQueue.global())
            .flatMap({ index -> AnyPublisher<(index: Int, htmlString: String), PinpointNodeAgentTester.Error> in
                return tester.channels(index)
            })
            .map({ html -> (index: Int, htmlString: String) in
                guard let channelCountMatches = Regexes.streamStarted.firstMatch(in: html.htmlString, range: NSMakeRange(0, html.htmlString.count)) else {
                    return html
                }
                let channelCount = NSString(string: html.htmlString).substring(with: channelCountMatches.range(at: 1))
                let channelDirectory = downloadsDirectory.appendingPathComponent(String(channelCount))
                
                let htmlPath = channelDirectory.appendingPathComponent("\(html.index).html")
                print("htmlPath: \(htmlPath)")
//                try! html.htmlString.write(to: htmlPath, atomically: false, encoding: .utf8)
                return html
            })
            .sink(receiveCompletion: { result in
                print("moniterning Subscriber Completion: \(result)")
            }, receiveValue: { data in
                let end = DispatchTime.now()
                let nanoTime = end.uptimeNanoseconds - startTime.uptimeNanoseconds
                let elapsedSeconds = Double(nanoTime) / 1_000_000_000
                
                if elapsedSeconds > 10 {
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
    
    static let streamStarted = try! NSRegularExpression(pattern: "<tbody><tr><td>streamsStarted</td><td>(\\d+)</td></tr>", options: .caseInsensitive)
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
