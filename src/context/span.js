const TransactionIdUtil = require('utils/transaction-id-util');

class Span {
  constructor (traceId, agentInfo) {
    if (!traceId || !agentInfo) {
      // TODO app에 영향을 미치지 않으려면 예외처리는 어떻게 해야 할까??
    }

    // fixme
    const tid = TransactionIdUtil.toTransactionId(traceId.transactionId.toString())

    this.agentId = agentInfo.agentId; // required, from config
    this.applicationName = agentInfo.applicationName; // required, from config
    this.agentStartTime = agentInfo.agentStartTime; // required, from config
    this.serviceType = 0; // required
    this.spanId = traceId.spanId; // required
    this.parentSpanId = traceId.parentSpanId;
    this.transactionId = TransactionIdUtil.formatBytes(tid)
    this.startTime = Date.now(); // required
    this.elapsedTime = 0;
    this.rpc = null; // uri
    this.endPoint = null; // host, domain
    this.remoteAddr = null; // ip
    this.annotations = [];
    this.flag = traceId.flag;
    this.err = null;
    this.spanEventList = [];
    this.apiId = null;
    this.exceptionInfo = null;
    this.applicationServiceType = agentInfo.serviceType; // from config
    this.loggingTransactionInfo = null; // ?
    this.version = 1;
    this.acceptorHost = null; // parent host ?
    this.parentApplicationName = null;
    this.parentApplicationType = null;
  }

  markElapsedTime () {
    if (this.startTime) {
      this.elapsedTime = Date.now() - this.startTime
    }
  }

  get elapsed () {
    return this.elapsedTime
  }
}

module.exports = Span
