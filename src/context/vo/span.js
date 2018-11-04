
class Span {
  constructor (traceId) {
    if (!traceId) {
      // TODO app에 영향을 미치지 않으려면 예외처리는 어떻게 해야 할까??
    }

    // this.agentId = null; // required, meta
    // this.applicationName = null; // required, meta
    // this.agentStartTime = null; // required, meta
    // this.transactionId = traceId.transactionId; // required, by traceId
    // this.parentSpanId = traceId.parentSpanId || -1; // by traceId
    // this.serviceType = null; // required, meta
    // this.parentApplicationName = null; // meta
    // this.parentApplicationType = null; // meta
    this.spanId = traceId.spanId; // required
    this.traceId = traceId.transactionId
    this.startTime = Date.now(); // required
    this.elapsed = 0;
    this.rpc = null;
    this.endPoint = null;
    this.remoteAddr = null;
    this.annotations = [];
    this.flag = 0;
    this.err = null;
    this.spanEventList = [];
    this.acceptorHost = null;
    this.apiId = null;
    this.exceptionInfo = null;
    this.applicationServiceType = null;
    this.loggingTransactionInfo = null;
    this.version = null;
  }
}

module.exports = Span
