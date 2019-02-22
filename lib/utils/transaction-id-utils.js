'use strict'

const bytesUtils = require('./bytes-utils')

const VERSION = 0;
const VERSION_SIZE = 1;

const formatBytes = (transactionId) => {
  const agentId = transactionId.agentId;
  const agentStartTime = transactionId.agentStartTime;
  const transactionSequence = transactionId.sequence;

  // agentId may be null
  // version + prefixed size + string + long + long
  if (!agentId) {
    return null
  }

  const agentIdBytes = Buffer.from(agentId)
  const agentIdLength = agentIdBytes && agentIdBytes.length
  const zigZagAgentIdLength = bytesUtils.intToZigZag(agentIdLength)
  const agentIdPrefixSize = bytesUtils.computeVar32Size(zigZagAgentIdLength);
  const agentStartTimeSize = bytesUtils.computeVar64Size(agentStartTime);
  const transactionIdSequenceSize = bytesUtils.computeVar64Size(transactionSequence);

  const bufferSize = VERSION_SIZE + agentIdPrefixSize + agentIdLength +  agentStartTimeSize + transactionIdSequenceSize;

  const buffer = Buffer.alloc(bufferSize)
  let offset = buffer.writeInt8(VERSION)
  offset = buffer.writeInt8(zigZagAgentIdLength, offset)
  if (agentIdBytes) {
    buffer.write(agentId, offset, agentIdLength)
    offset += agentIdLength
  }
  offset = bytesUtils.writeVar64Size(agentStartTime, buffer, offset, agentStartTimeSize)
  bytesUtils.writeVar64Size(transactionSequence, buffer, offset, transactionIdSequenceSize)
  return buffer
}

module.exports = {
  formatBytes,
}
