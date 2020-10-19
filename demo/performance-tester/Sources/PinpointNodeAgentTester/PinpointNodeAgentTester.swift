import Foundation
import Combine

@available(OSX 10.15, *)
struct PinpointNodeAgentTester {
    public enum Error: LocalizedError {
        case addressUnreachable(URL)
        case invalidRespose
        
        public var errorDescription: String? {
            switch self {
            case .invalidRespose:
                return "The server didn't reponse"
            case .addressUnreachable(let url):
                return "\(url.absoluteString) is unreachable."
            }
        }
    }
    
    func request() -> AnyPublisher<String, Error> {
        let url = URL(string: "http://localhost:3000")!
        return URLSession.shared
            .dataTaskPublisher(for: url)
            .map { response in
                return String(data: response.data, encoding: .utf8)!
            }
            .mapError { error -> PinpointNodeAgentTester.Error in
                switch error {
                case is URLError:
                    return Error.addressUnreachable(url)
                default:
                    return Error.invalidRespose
                }
            }
            .eraseToAnyPublisher()
    }
    
    func test() -> AnyPublisher<String, Error> {
        return (1...1000).publisher
            .mapError { error -> PinpointNodeAgentTester.Error in
                switch error {
                default:
                    return Error.invalidRespose
                }
            }
            .flatMap({ index -> AnyPublisher<String, Error> in
                print(index)
                return request()
            })
            .eraseToAnyPublisher()

    }
}
