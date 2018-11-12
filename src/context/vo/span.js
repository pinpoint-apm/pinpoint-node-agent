
class Span {
  constructor (traceId) {
    if (!traceId) {
      // TODO app에 영향을 미치지 않으려면 예외처리는 어떻게 해야 할까??
    }

    // this.agentId = null; // required, from config
    // this.applicationName = null; // required, from config
    // this.agentStartTime = null; // required, from config
    this.serviceType = null; // required, meta
    this.spanId = traceId.spanId; // required
    this.parentSpanId = traceId.parentSpanId;
    this.transactionId = traceId.transactionId
    this.startTime = Date.now(); // required
    this.elapsed = 0;
    this.rpc = null; // uri
    this.endPoint = null; // host, domain
    this.remoteAddr = null; // ip
    this.annotations = [];
    this.flag = traceId.flag;
    this.err = null;
    this.spanEventList = [];
    this.apiId = null;
    this.exceptionInfo = null;
    // this.applicationServiceType = null; // from config
    this.loggingTransactionInfo = null; // ?
    this.version = 1;
    this.acceptorHost = null; // parent host ?
    this.parentApplicationName = null;
    this.parentApplicationType = null;
  }
}

module.exports = Span
