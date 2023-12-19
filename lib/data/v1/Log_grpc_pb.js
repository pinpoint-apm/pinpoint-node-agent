// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var v1_Log_pb = require('../v1/Log_pb.js');

function serialize_v1_PLogDemand(arg) {
  if (!(arg instanceof v1_Log_pb.PLogDemand)) {
    throw new Error('Expected argument of type v1.PLogDemand');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_v1_PLogDemand(buffer_arg) {
  return v1_Log_pb.PLogDemand.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_v1_PLogPile(arg) {
  if (!(arg instanceof v1_Log_pb.PLogPile)) {
    throw new Error('Expected argument of type v1.PLogPile');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_v1_PLogPile(buffer_arg) {
  return v1_Log_pb.PLogPile.deserializeBinary(new Uint8Array(buffer_arg));
}


var LogService = exports.LogService = {
  connect: {
    path: '/v1.Log/Connect',
    requestStream: true,
    responseStream: true,
    requestType: v1_Log_pb.PLogPile,
    responseType: v1_Log_pb.PLogDemand,
    requestSerialize: serialize_v1_PLogPile,
    requestDeserialize: deserialize_v1_PLogPile,
    responseSerialize: serialize_v1_PLogDemand,
    responseDeserialize: deserialize_v1_PLogDemand,
  },
};

exports.LogClient = grpc.makeGenericClientConstructor(LogService);
