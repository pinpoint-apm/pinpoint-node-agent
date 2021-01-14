// GENERATED CODE -- DO NOT EDIT!

'use strict';
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');
var Span_pb = require('./Span_pb.js');
var Stat_pb = require('./Stat_pb.js');
var ThreadDump_pb = require('./ThreadDump_pb.js');
var Cmd_pb = require('./Cmd_pb.js');

function serialize_google_protobuf_Empty(arg) {
  if (!(arg instanceof google_protobuf_empty_pb.Empty)) {
    throw new Error('Expected argument of type google.protobuf.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_google_protobuf_Empty(buffer_arg) {
  return google_protobuf_empty_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_v1_PAgentInfo(arg) {
  if (!(arg instanceof Stat_pb.PAgentInfo)) {
    throw new Error('Expected argument of type v1.PAgentInfo');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_v1_PAgentInfo(buffer_arg) {
  return Stat_pb.PAgentInfo.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_v1_PApiMetaData(arg) {
  if (!(arg instanceof Span_pb.PApiMetaData)) {
    throw new Error('Expected argument of type v1.PApiMetaData');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_v1_PApiMetaData(buffer_arg) {
  return Span_pb.PApiMetaData.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_v1_PCmdActiveThreadCountRes(arg) {
  if (!(arg instanceof Cmd_pb.PCmdActiveThreadCountRes)) {
    throw new Error('Expected argument of type v1.PCmdActiveThreadCountRes');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_v1_PCmdActiveThreadCountRes(buffer_arg) {
  return Cmd_pb.PCmdActiveThreadCountRes.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_v1_PCmdActiveThreadDumpRes(arg) {
  if (!(arg instanceof Cmd_pb.PCmdActiveThreadDumpRes)) {
    throw new Error('Expected argument of type v1.PCmdActiveThreadDumpRes');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_v1_PCmdActiveThreadDumpRes(buffer_arg) {
  return Cmd_pb.PCmdActiveThreadDumpRes.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_v1_PCmdActiveThreadLightDumpRes(arg) {
  if (!(arg instanceof Cmd_pb.PCmdActiveThreadLightDumpRes)) {
    throw new Error('Expected argument of type v1.PCmdActiveThreadLightDumpRes');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_v1_PCmdActiveThreadLightDumpRes(buffer_arg) {
  return Cmd_pb.PCmdActiveThreadLightDumpRes.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_v1_PCmdEchoResponse(arg) {
  if (!(arg instanceof Cmd_pb.PCmdEchoResponse)) {
    throw new Error('Expected argument of type v1.PCmdEchoResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_v1_PCmdEchoResponse(buffer_arg) {
  return Cmd_pb.PCmdEchoResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_v1_PCmdMessage(arg) {
  if (!(arg instanceof Cmd_pb.PCmdMessage)) {
    throw new Error('Expected argument of type v1.PCmdMessage');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_v1_PCmdMessage(buffer_arg) {
  return Cmd_pb.PCmdMessage.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_v1_PCmdRequest(arg) {
  if (!(arg instanceof Cmd_pb.PCmdRequest)) {
    throw new Error('Expected argument of type v1.PCmdRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_v1_PCmdRequest(buffer_arg) {
  return Cmd_pb.PCmdRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_v1_PPing(arg) {
  if (!(arg instanceof Stat_pb.PPing)) {
    throw new Error('Expected argument of type v1.PPing');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_v1_PPing(buffer_arg) {
  return Stat_pb.PPing.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_v1_PResult(arg) {
  if (!(arg instanceof Span_pb.PResult)) {
    throw new Error('Expected argument of type v1.PResult');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_v1_PResult(buffer_arg) {
  return Span_pb.PResult.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_v1_PSpanMessage(arg) {
  if (!(arg instanceof Span_pb.PSpanMessage)) {
    throw new Error('Expected argument of type v1.PSpanMessage');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_v1_PSpanMessage(buffer_arg) {
  return Span_pb.PSpanMessage.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_v1_PSqlMetaData(arg) {
  if (!(arg instanceof Span_pb.PSqlMetaData)) {
    throw new Error('Expected argument of type v1.PSqlMetaData');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_v1_PSqlMetaData(buffer_arg) {
  return Span_pb.PSqlMetaData.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_v1_PStatMessage(arg) {
  if (!(arg instanceof Stat_pb.PStatMessage)) {
    throw new Error('Expected argument of type v1.PStatMessage');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_v1_PStatMessage(buffer_arg) {
  return Stat_pb.PStatMessage.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_v1_PStringMetaData(arg) {
  if (!(arg instanceof Span_pb.PStringMetaData)) {
    throw new Error('Expected argument of type v1.PStringMetaData');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_v1_PStringMetaData(buffer_arg) {
  return Span_pb.PStringMetaData.deserializeBinary(new Uint8Array(buffer_arg));
}


var SpanService = exports['v1.Span'] = {
  sendSpan: {
    path: '/v1.Span/SendSpan',
    requestStream: true,
    responseStream: false,
    requestType: Span_pb.PSpanMessage,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_v1_PSpanMessage,
    requestDeserialize: deserialize_v1_PSpanMessage,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
};

var AgentService = exports['v1.Agent'] = {
  requestAgentInfo: {
    path: '/v1.Agent/RequestAgentInfo',
    requestStream: false,
    responseStream: false,
    requestType: Stat_pb.PAgentInfo,
    responseType: Span_pb.PResult,
    requestSerialize: serialize_v1_PAgentInfo,
    requestDeserialize: deserialize_v1_PAgentInfo,
    responseSerialize: serialize_v1_PResult,
    responseDeserialize: deserialize_v1_PResult,
  },
  pingSession: {
    path: '/v1.Agent/PingSession',
    requestStream: true,
    responseStream: true,
    requestType: Stat_pb.PPing,
    responseType: Stat_pb.PPing,
    requestSerialize: serialize_v1_PPing,
    requestDeserialize: deserialize_v1_PPing,
    responseSerialize: serialize_v1_PPing,
    responseDeserialize: deserialize_v1_PPing,
  },
};

var MetadataService = exports['v1.Metadata'] = {
  requestSqlMetaData: {
    path: '/v1.Metadata/RequestSqlMetaData',
    requestStream: false,
    responseStream: false,
    requestType: Span_pb.PSqlMetaData,
    responseType: Span_pb.PResult,
    requestSerialize: serialize_v1_PSqlMetaData,
    requestDeserialize: deserialize_v1_PSqlMetaData,
    responseSerialize: serialize_v1_PResult,
    responseDeserialize: deserialize_v1_PResult,
  },
  requestApiMetaData: {
    path: '/v1.Metadata/RequestApiMetaData',
    requestStream: false,
    responseStream: false,
    requestType: Span_pb.PApiMetaData,
    responseType: Span_pb.PResult,
    requestSerialize: serialize_v1_PApiMetaData,
    requestDeserialize: deserialize_v1_PApiMetaData,
    responseSerialize: serialize_v1_PResult,
    responseDeserialize: deserialize_v1_PResult,
  },
  requestStringMetaData: {
    path: '/v1.Metadata/RequestStringMetaData',
    requestStream: false,
    responseStream: false,
    requestType: Span_pb.PStringMetaData,
    responseType: Span_pb.PResult,
    requestSerialize: serialize_v1_PStringMetaData,
    requestDeserialize: deserialize_v1_PStringMetaData,
    responseSerialize: serialize_v1_PResult,
    responseDeserialize: deserialize_v1_PResult,
  },
};

var StatService = exports['v1.Stat'] = {
  sendAgentStat: {
    path: '/v1.Stat/SendAgentStat',
    requestStream: true,
    responseStream: false,
    requestType: Stat_pb.PStatMessage,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_v1_PStatMessage,
    requestDeserialize: deserialize_v1_PStatMessage,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
};

var ProfilerCommandServiceService = exports['v1.ProfilerCommandService'] = {
  handleCommand: {
    path: '/v1.ProfilerCommandService/HandleCommand',
    requestStream: true,
    responseStream: true,
    requestType: Cmd_pb.PCmdMessage,
    responseType: Cmd_pb.PCmdRequest,
    requestSerialize: serialize_v1_PCmdMessage,
    requestDeserialize: deserialize_v1_PCmdMessage,
    responseSerialize: serialize_v1_PCmdRequest,
    responseDeserialize: deserialize_v1_PCmdRequest,
  },
  commandEcho: {
    path: '/v1.ProfilerCommandService/CommandEcho',
    requestStream: false,
    responseStream: false,
    requestType: Cmd_pb.PCmdEchoResponse,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_v1_PCmdEchoResponse,
    requestDeserialize: deserialize_v1_PCmdEchoResponse,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  commandStreamActiveThreadCount: {
    path: '/v1.ProfilerCommandService/CommandStreamActiveThreadCount',
    requestStream: true,
    responseStream: false,
    requestType: Cmd_pb.PCmdActiveThreadCountRes,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_v1_PCmdActiveThreadCountRes,
    requestDeserialize: deserialize_v1_PCmdActiveThreadCountRes,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  commandActiveThreadDump: {
    path: '/v1.ProfilerCommandService/CommandActiveThreadDump',
    requestStream: false,
    responseStream: false,
    requestType: Cmd_pb.PCmdActiveThreadDumpRes,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_v1_PCmdActiveThreadDumpRes,
    requestDeserialize: deserialize_v1_PCmdActiveThreadDumpRes,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  commandActiveThreadLightDump: {
    path: '/v1.ProfilerCommandService/CommandActiveThreadLightDump',
    requestStream: false,
    responseStream: false,
    requestType: Cmd_pb.PCmdActiveThreadLightDumpRes,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_v1_PCmdActiveThreadLightDumpRes,
    requestDeserialize: deserialize_v1_PCmdActiveThreadLightDumpRes,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
};

