/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.v1 = (function() {

    /**
     * Namespace v1.
     * @exports v1
     * @namespace
     */
    var v1 = {};

    v1.PSpanMessage = (function() {

        /**
         * Properties of a PSpanMessage.
         * @memberof v1
         * @interface IPSpanMessage
         * @property {v1.IPSpan|null} [span] PSpanMessage span
         * @property {v1.IPSpanChunk|null} [spanChunk] PSpanMessage spanChunk
         */

        /**
         * Constructs a new PSpanMessage.
         * @memberof v1
         * @classdesc Represents a PSpanMessage.
         * @implements IPSpanMessage
         * @constructor
         * @param {v1.IPSpanMessage=} [properties] Properties to set
         */
        function PSpanMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PSpanMessage span.
         * @member {v1.IPSpan|null|undefined} span
         * @memberof v1.PSpanMessage
         * @instance
         */
        PSpanMessage.prototype.span = null;

        /**
         * PSpanMessage spanChunk.
         * @member {v1.IPSpanChunk|null|undefined} spanChunk
         * @memberof v1.PSpanMessage
         * @instance
         */
        PSpanMessage.prototype.spanChunk = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * PSpanMessage field.
         * @member {"span"|"spanChunk"|undefined} field
         * @memberof v1.PSpanMessage
         * @instance
         */
        Object.defineProperty(PSpanMessage.prototype, "field", {
            get: $util.oneOfGetter($oneOfFields = ["span", "spanChunk"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new PSpanMessage instance using the specified properties.
         * @function create
         * @memberof v1.PSpanMessage
         * @static
         * @param {v1.IPSpanMessage=} [properties] Properties to set
         * @returns {v1.PSpanMessage} PSpanMessage instance
         */
        PSpanMessage.create = function create(properties) {
            return new PSpanMessage(properties);
        };

        /**
         * Encodes the specified PSpanMessage message. Does not implicitly {@link v1.PSpanMessage.verify|verify} messages.
         * @function encode
         * @memberof v1.PSpanMessage
         * @static
         * @param {v1.IPSpanMessage} message PSpanMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PSpanMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.span != null && message.hasOwnProperty("span"))
                $root.v1.PSpan.encode(message.span, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.spanChunk != null && message.hasOwnProperty("spanChunk"))
                $root.v1.PSpanChunk.encode(message.spanChunk, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified PSpanMessage message, length delimited. Does not implicitly {@link v1.PSpanMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PSpanMessage
         * @static
         * @param {v1.IPSpanMessage} message PSpanMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PSpanMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PSpanMessage message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PSpanMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PSpanMessage} PSpanMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PSpanMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PSpanMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.span = $root.v1.PSpan.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.spanChunk = $root.v1.PSpanChunk.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PSpanMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PSpanMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PSpanMessage} PSpanMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PSpanMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PSpanMessage message.
         * @function verify
         * @memberof v1.PSpanMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PSpanMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.span != null && message.hasOwnProperty("span")) {
                properties.field = 1;
                {
                    var error = $root.v1.PSpan.verify(message.span);
                    if (error)
                        return "span." + error;
                }
            }
            if (message.spanChunk != null && message.hasOwnProperty("spanChunk")) {
                if (properties.field === 1)
                    return "field: multiple values";
                properties.field = 1;
                {
                    var error = $root.v1.PSpanChunk.verify(message.spanChunk);
                    if (error)
                        return "spanChunk." + error;
                }
            }
            return null;
        };

        /**
         * Creates a PSpanMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PSpanMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PSpanMessage} PSpanMessage
         */
        PSpanMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PSpanMessage)
                return object;
            var message = new $root.v1.PSpanMessage();
            if (object.span != null) {
                if (typeof object.span !== "object")
                    throw TypeError(".v1.PSpanMessage.span: object expected");
                message.span = $root.v1.PSpan.fromObject(object.span);
            }
            if (object.spanChunk != null) {
                if (typeof object.spanChunk !== "object")
                    throw TypeError(".v1.PSpanMessage.spanChunk: object expected");
                message.spanChunk = $root.v1.PSpanChunk.fromObject(object.spanChunk);
            }
            return message;
        };

        /**
         * Creates a plain object from a PSpanMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PSpanMessage
         * @static
         * @param {v1.PSpanMessage} message PSpanMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PSpanMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (message.span != null && message.hasOwnProperty("span")) {
                object.span = $root.v1.PSpan.toObject(message.span, options);
                if (options.oneofs)
                    object.field = "span";
            }
            if (message.spanChunk != null && message.hasOwnProperty("spanChunk")) {
                object.spanChunk = $root.v1.PSpanChunk.toObject(message.spanChunk, options);
                if (options.oneofs)
                    object.field = "spanChunk";
            }
            return object;
        };

        /**
         * Converts this PSpanMessage to JSON.
         * @function toJSON
         * @memberof v1.PSpanMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PSpanMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PSpanMessage;
    })();

    v1.PSpan = (function() {

        /**
         * Properties of a PSpan.
         * @memberof v1
         * @interface IPSpan
         * @property {number|null} [version] PSpan version
         * @property {v1.IPTransactionId|null} [transactionId] PSpan transactionId
         * @property {number|Long|null} [spanId] PSpan spanId
         * @property {number|Long|null} [parentSpanId] PSpan parentSpanId
         * @property {number|Long|null} [startTime] PSpan startTime
         * @property {number|null} [elapsed] PSpan elapsed
         * @property {number|null} [apiId] PSpan apiId
         * @property {number|null} [serviceType] PSpan serviceType
         * @property {v1.IPAcceptEvent|null} [acceptEvent] PSpan acceptEvent
         * @property {Array.<IPAnnotation>|null} [annotation] PSpan annotation
         * @property {number|null} [flag] PSpan flag
         * @property {number|null} [err] PSpan err
         * @property {Array.<v1.IPSpanEvent>|null} [spanEvent] PSpan spanEvent
         * @property {IPIntStringValue|null} [exceptionInfo] PSpan exceptionInfo
         * @property {number|null} [applicationServiceType] PSpan applicationServiceType
         * @property {number|null} [loggingTransactionInfo] PSpan loggingTransactionInfo
         */

        /**
         * Constructs a new PSpan.
         * @memberof v1
         * @classdesc Represents a PSpan.
         * @implements IPSpan
         * @constructor
         * @param {v1.IPSpan=} [properties] Properties to set
         */
        function PSpan(properties) {
            this.annotation = [];
            this.spanEvent = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PSpan version.
         * @member {number} version
         * @memberof v1.PSpan
         * @instance
         */
        PSpan.prototype.version = 0;

        /**
         * PSpan transactionId.
         * @member {v1.IPTransactionId|null|undefined} transactionId
         * @memberof v1.PSpan
         * @instance
         */
        PSpan.prototype.transactionId = null;

        /**
         * PSpan spanId.
         * @member {number|Long} spanId
         * @memberof v1.PSpan
         * @instance
         */
        PSpan.prototype.spanId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PSpan parentSpanId.
         * @member {number|Long} parentSpanId
         * @memberof v1.PSpan
         * @instance
         */
        PSpan.prototype.parentSpanId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PSpan startTime.
         * @member {number|Long} startTime
         * @memberof v1.PSpan
         * @instance
         */
        PSpan.prototype.startTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PSpan elapsed.
         * @member {number} elapsed
         * @memberof v1.PSpan
         * @instance
         */
        PSpan.prototype.elapsed = 0;

        /**
         * PSpan apiId.
         * @member {number} apiId
         * @memberof v1.PSpan
         * @instance
         */
        PSpan.prototype.apiId = 0;

        /**
         * PSpan serviceType.
         * @member {number} serviceType
         * @memberof v1.PSpan
         * @instance
         */
        PSpan.prototype.serviceType = 0;

        /**
         * PSpan acceptEvent.
         * @member {v1.IPAcceptEvent|null|undefined} acceptEvent
         * @memberof v1.PSpan
         * @instance
         */
        PSpan.prototype.acceptEvent = null;

        /**
         * PSpan annotation.
         * @member {Array.<IPAnnotation>} annotation
         * @memberof v1.PSpan
         * @instance
         */
        PSpan.prototype.annotation = $util.emptyArray;

        /**
         * PSpan flag.
         * @member {number} flag
         * @memberof v1.PSpan
         * @instance
         */
        PSpan.prototype.flag = 0;

        /**
         * PSpan err.
         * @member {number} err
         * @memberof v1.PSpan
         * @instance
         */
        PSpan.prototype.err = 0;

        /**
         * PSpan spanEvent.
         * @member {Array.<v1.IPSpanEvent>} spanEvent
         * @memberof v1.PSpan
         * @instance
         */
        PSpan.prototype.spanEvent = $util.emptyArray;

        /**
         * PSpan exceptionInfo.
         * @member {IPIntStringValue|null|undefined} exceptionInfo
         * @memberof v1.PSpan
         * @instance
         */
        PSpan.prototype.exceptionInfo = null;

        /**
         * PSpan applicationServiceType.
         * @member {number} applicationServiceType
         * @memberof v1.PSpan
         * @instance
         */
        PSpan.prototype.applicationServiceType = 0;

        /**
         * PSpan loggingTransactionInfo.
         * @member {number} loggingTransactionInfo
         * @memberof v1.PSpan
         * @instance
         */
        PSpan.prototype.loggingTransactionInfo = 0;

        /**
         * Creates a new PSpan instance using the specified properties.
         * @function create
         * @memberof v1.PSpan
         * @static
         * @param {v1.IPSpan=} [properties] Properties to set
         * @returns {v1.PSpan} PSpan instance
         */
        PSpan.create = function create(properties) {
            return new PSpan(properties);
        };

        /**
         * Encodes the specified PSpan message. Does not implicitly {@link v1.PSpan.verify|verify} messages.
         * @function encode
         * @memberof v1.PSpan
         * @static
         * @param {v1.IPSpan} message PSpan message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PSpan.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.version != null && message.hasOwnProperty("version"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.version);
            if (message.transactionId != null && message.hasOwnProperty("transactionId"))
                $root.v1.PTransactionId.encode(message.transactionId, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.spanId != null && message.hasOwnProperty("spanId"))
                writer.uint32(/* id 3, wireType 1 =*/25).sfixed64(message.spanId);
            if (message.parentSpanId != null && message.hasOwnProperty("parentSpanId"))
                writer.uint32(/* id 4, wireType 1 =*/33).sfixed64(message.parentSpanId);
            if (message.startTime != null && message.hasOwnProperty("startTime"))
                writer.uint32(/* id 5, wireType 0 =*/40).int64(message.startTime);
            if (message.elapsed != null && message.hasOwnProperty("elapsed"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.elapsed);
            if (message.apiId != null && message.hasOwnProperty("apiId"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.apiId);
            if (message.serviceType != null && message.hasOwnProperty("serviceType"))
                writer.uint32(/* id 8, wireType 0 =*/64).int32(message.serviceType);
            if (message.acceptEvent != null && message.hasOwnProperty("acceptEvent"))
                $root.v1.PAcceptEvent.encode(message.acceptEvent, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
            if (message.annotation != null && message.annotation.length)
                for (var i = 0; i < message.annotation.length; ++i)
                    $root.PAnnotation.encode(message.annotation[i], writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
            if (message.flag != null && message.hasOwnProperty("flag"))
                writer.uint32(/* id 11, wireType 0 =*/88).int32(message.flag);
            if (message.err != null && message.hasOwnProperty("err"))
                writer.uint32(/* id 12, wireType 0 =*/96).sint32(message.err);
            if (message.spanEvent != null && message.spanEvent.length)
                for (var i = 0; i < message.spanEvent.length; ++i)
                    $root.v1.PSpanEvent.encode(message.spanEvent[i], writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
            if (message.exceptionInfo != null && message.hasOwnProperty("exceptionInfo"))
                $root.PIntStringValue.encode(message.exceptionInfo, writer.uint32(/* id 14, wireType 2 =*/114).fork()).ldelim();
            if (message.applicationServiceType != null && message.hasOwnProperty("applicationServiceType"))
                writer.uint32(/* id 15, wireType 0 =*/120).int32(message.applicationServiceType);
            if (message.loggingTransactionInfo != null && message.hasOwnProperty("loggingTransactionInfo"))
                writer.uint32(/* id 16, wireType 0 =*/128).int32(message.loggingTransactionInfo);
            return writer;
        };

        /**
         * Encodes the specified PSpan message, length delimited. Does not implicitly {@link v1.PSpan.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PSpan
         * @static
         * @param {v1.IPSpan} message PSpan message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PSpan.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PSpan message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PSpan
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PSpan} PSpan
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PSpan.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PSpan();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.version = reader.int32();
                    break;
                case 2:
                    message.transactionId = $root.v1.PTransactionId.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.spanId = reader.sfixed64();
                    break;
                case 4:
                    message.parentSpanId = reader.sfixed64();
                    break;
                case 5:
                    message.startTime = reader.int64();
                    break;
                case 6:
                    message.elapsed = reader.int32();
                    break;
                case 7:
                    message.apiId = reader.int32();
                    break;
                case 8:
                    message.serviceType = reader.int32();
                    break;
                case 9:
                    message.acceptEvent = $root.v1.PAcceptEvent.decode(reader, reader.uint32());
                    break;
                case 10:
                    if (!(message.annotation && message.annotation.length))
                        message.annotation = [];
                    message.annotation.push($root.PAnnotation.decode(reader, reader.uint32()));
                    break;
                case 11:
                    message.flag = reader.int32();
                    break;
                case 12:
                    message.err = reader.sint32();
                    break;
                case 13:
                    if (!(message.spanEvent && message.spanEvent.length))
                        message.spanEvent = [];
                    message.spanEvent.push($root.v1.PSpanEvent.decode(reader, reader.uint32()));
                    break;
                case 14:
                    message.exceptionInfo = $root.PIntStringValue.decode(reader, reader.uint32());
                    break;
                case 15:
                    message.applicationServiceType = reader.int32();
                    break;
                case 16:
                    message.loggingTransactionInfo = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PSpan message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PSpan
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PSpan} PSpan
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PSpan.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PSpan message.
         * @function verify
         * @memberof v1.PSpan
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PSpan.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.version != null && message.hasOwnProperty("version"))
                if (!$util.isInteger(message.version))
                    return "version: integer expected";
            if (message.transactionId != null && message.hasOwnProperty("transactionId")) {
                var error = $root.v1.PTransactionId.verify(message.transactionId);
                if (error)
                    return "transactionId." + error;
            }
            if (message.spanId != null && message.hasOwnProperty("spanId"))
                if (!$util.isInteger(message.spanId) && !(message.spanId && $util.isInteger(message.spanId.low) && $util.isInteger(message.spanId.high)))
                    return "spanId: integer|Long expected";
            if (message.parentSpanId != null && message.hasOwnProperty("parentSpanId"))
                if (!$util.isInteger(message.parentSpanId) && !(message.parentSpanId && $util.isInteger(message.parentSpanId.low) && $util.isInteger(message.parentSpanId.high)))
                    return "parentSpanId: integer|Long expected";
            if (message.startTime != null && message.hasOwnProperty("startTime"))
                if (!$util.isInteger(message.startTime) && !(message.startTime && $util.isInteger(message.startTime.low) && $util.isInteger(message.startTime.high)))
                    return "startTime: integer|Long expected";
            if (message.elapsed != null && message.hasOwnProperty("elapsed"))
                if (!$util.isInteger(message.elapsed))
                    return "elapsed: integer expected";
            if (message.apiId != null && message.hasOwnProperty("apiId"))
                if (!$util.isInteger(message.apiId))
                    return "apiId: integer expected";
            if (message.serviceType != null && message.hasOwnProperty("serviceType"))
                if (!$util.isInteger(message.serviceType))
                    return "serviceType: integer expected";
            if (message.acceptEvent != null && message.hasOwnProperty("acceptEvent")) {
                var error = $root.v1.PAcceptEvent.verify(message.acceptEvent);
                if (error)
                    return "acceptEvent." + error;
            }
            if (message.annotation != null && message.hasOwnProperty("annotation")) {
                if (!Array.isArray(message.annotation))
                    return "annotation: array expected";
                for (var i = 0; i < message.annotation.length; ++i) {
                    var error = $root.PAnnotation.verify(message.annotation[i]);
                    if (error)
                        return "annotation." + error;
                }
            }
            if (message.flag != null && message.hasOwnProperty("flag"))
                if (!$util.isInteger(message.flag))
                    return "flag: integer expected";
            if (message.err != null && message.hasOwnProperty("err"))
                if (!$util.isInteger(message.err))
                    return "err: integer expected";
            if (message.spanEvent != null && message.hasOwnProperty("spanEvent")) {
                if (!Array.isArray(message.spanEvent))
                    return "spanEvent: array expected";
                for (var i = 0; i < message.spanEvent.length; ++i) {
                    var error = $root.v1.PSpanEvent.verify(message.spanEvent[i]);
                    if (error)
                        return "spanEvent." + error;
                }
            }
            if (message.exceptionInfo != null && message.hasOwnProperty("exceptionInfo")) {
                var error = $root.PIntStringValue.verify(message.exceptionInfo);
                if (error)
                    return "exceptionInfo." + error;
            }
            if (message.applicationServiceType != null && message.hasOwnProperty("applicationServiceType"))
                if (!$util.isInteger(message.applicationServiceType))
                    return "applicationServiceType: integer expected";
            if (message.loggingTransactionInfo != null && message.hasOwnProperty("loggingTransactionInfo"))
                if (!$util.isInteger(message.loggingTransactionInfo))
                    return "loggingTransactionInfo: integer expected";
            return null;
        };

        /**
         * Creates a PSpan message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PSpan
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PSpan} PSpan
         */
        PSpan.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PSpan)
                return object;
            var message = new $root.v1.PSpan();
            if (object.version != null)
                message.version = object.version | 0;
            if (object.transactionId != null) {
                if (typeof object.transactionId !== "object")
                    throw TypeError(".v1.PSpan.transactionId: object expected");
                message.transactionId = $root.v1.PTransactionId.fromObject(object.transactionId);
            }
            if (object.spanId != null)
                if ($util.Long)
                    (message.spanId = $util.Long.fromValue(object.spanId)).unsigned = false;
                else if (typeof object.spanId === "string")
                    message.spanId = parseInt(object.spanId, 10);
                else if (typeof object.spanId === "number")
                    message.spanId = object.spanId;
                else if (typeof object.spanId === "object")
                    message.spanId = new $util.LongBits(object.spanId.low >>> 0, object.spanId.high >>> 0).toNumber();
            if (object.parentSpanId != null)
                if ($util.Long)
                    (message.parentSpanId = $util.Long.fromValue(object.parentSpanId)).unsigned = false;
                else if (typeof object.parentSpanId === "string")
                    message.parentSpanId = parseInt(object.parentSpanId, 10);
                else if (typeof object.parentSpanId === "number")
                    message.parentSpanId = object.parentSpanId;
                else if (typeof object.parentSpanId === "object")
                    message.parentSpanId = new $util.LongBits(object.parentSpanId.low >>> 0, object.parentSpanId.high >>> 0).toNumber();
            if (object.startTime != null)
                if ($util.Long)
                    (message.startTime = $util.Long.fromValue(object.startTime)).unsigned = false;
                else if (typeof object.startTime === "string")
                    message.startTime = parseInt(object.startTime, 10);
                else if (typeof object.startTime === "number")
                    message.startTime = object.startTime;
                else if (typeof object.startTime === "object")
                    message.startTime = new $util.LongBits(object.startTime.low >>> 0, object.startTime.high >>> 0).toNumber();
            if (object.elapsed != null)
                message.elapsed = object.elapsed | 0;
            if (object.apiId != null)
                message.apiId = object.apiId | 0;
            if (object.serviceType != null)
                message.serviceType = object.serviceType | 0;
            if (object.acceptEvent != null) {
                if (typeof object.acceptEvent !== "object")
                    throw TypeError(".v1.PSpan.acceptEvent: object expected");
                message.acceptEvent = $root.v1.PAcceptEvent.fromObject(object.acceptEvent);
            }
            if (object.annotation) {
                if (!Array.isArray(object.annotation))
                    throw TypeError(".v1.PSpan.annotation: array expected");
                message.annotation = [];
                for (var i = 0; i < object.annotation.length; ++i) {
                    if (typeof object.annotation[i] !== "object")
                        throw TypeError(".v1.PSpan.annotation: object expected");
                    message.annotation[i] = $root.PAnnotation.fromObject(object.annotation[i]);
                }
            }
            if (object.flag != null)
                message.flag = object.flag | 0;
            if (object.err != null)
                message.err = object.err | 0;
            if (object.spanEvent) {
                if (!Array.isArray(object.spanEvent))
                    throw TypeError(".v1.PSpan.spanEvent: array expected");
                message.spanEvent = [];
                for (var i = 0; i < object.spanEvent.length; ++i) {
                    if (typeof object.spanEvent[i] !== "object")
                        throw TypeError(".v1.PSpan.spanEvent: object expected");
                    message.spanEvent[i] = $root.v1.PSpanEvent.fromObject(object.spanEvent[i]);
                }
            }
            if (object.exceptionInfo != null) {
                if (typeof object.exceptionInfo !== "object")
                    throw TypeError(".v1.PSpan.exceptionInfo: object expected");
                message.exceptionInfo = $root.PIntStringValue.fromObject(object.exceptionInfo);
            }
            if (object.applicationServiceType != null)
                message.applicationServiceType = object.applicationServiceType | 0;
            if (object.loggingTransactionInfo != null)
                message.loggingTransactionInfo = object.loggingTransactionInfo | 0;
            return message;
        };

        /**
         * Creates a plain object from a PSpan message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PSpan
         * @static
         * @param {v1.PSpan} message PSpan
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PSpan.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.annotation = [];
                object.spanEvent = [];
            }
            if (options.defaults) {
                object.version = 0;
                object.transactionId = null;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.spanId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.spanId = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.parentSpanId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.parentSpanId = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.startTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.startTime = options.longs === String ? "0" : 0;
                object.elapsed = 0;
                object.apiId = 0;
                object.serviceType = 0;
                object.acceptEvent = null;
                object.flag = 0;
                object.err = 0;
                object.exceptionInfo = null;
                object.applicationServiceType = 0;
                object.loggingTransactionInfo = 0;
            }
            if (message.version != null && message.hasOwnProperty("version"))
                object.version = message.version;
            if (message.transactionId != null && message.hasOwnProperty("transactionId"))
                object.transactionId = $root.v1.PTransactionId.toObject(message.transactionId, options);
            if (message.spanId != null && message.hasOwnProperty("spanId"))
                if (typeof message.spanId === "number")
                    object.spanId = options.longs === String ? String(message.spanId) : message.spanId;
                else
                    object.spanId = options.longs === String ? $util.Long.prototype.toString.call(message.spanId) : options.longs === Number ? new $util.LongBits(message.spanId.low >>> 0, message.spanId.high >>> 0).toNumber() : message.spanId;
            if (message.parentSpanId != null && message.hasOwnProperty("parentSpanId"))
                if (typeof message.parentSpanId === "number")
                    object.parentSpanId = options.longs === String ? String(message.parentSpanId) : message.parentSpanId;
                else
                    object.parentSpanId = options.longs === String ? $util.Long.prototype.toString.call(message.parentSpanId) : options.longs === Number ? new $util.LongBits(message.parentSpanId.low >>> 0, message.parentSpanId.high >>> 0).toNumber() : message.parentSpanId;
            if (message.startTime != null && message.hasOwnProperty("startTime"))
                if (typeof message.startTime === "number")
                    object.startTime = options.longs === String ? String(message.startTime) : message.startTime;
                else
                    object.startTime = options.longs === String ? $util.Long.prototype.toString.call(message.startTime) : options.longs === Number ? new $util.LongBits(message.startTime.low >>> 0, message.startTime.high >>> 0).toNumber() : message.startTime;
            if (message.elapsed != null && message.hasOwnProperty("elapsed"))
                object.elapsed = message.elapsed;
            if (message.apiId != null && message.hasOwnProperty("apiId"))
                object.apiId = message.apiId;
            if (message.serviceType != null && message.hasOwnProperty("serviceType"))
                object.serviceType = message.serviceType;
            if (message.acceptEvent != null && message.hasOwnProperty("acceptEvent"))
                object.acceptEvent = $root.v1.PAcceptEvent.toObject(message.acceptEvent, options);
            if (message.annotation && message.annotation.length) {
                object.annotation = [];
                for (var j = 0; j < message.annotation.length; ++j)
                    object.annotation[j] = $root.PAnnotation.toObject(message.annotation[j], options);
            }
            if (message.flag != null && message.hasOwnProperty("flag"))
                object.flag = message.flag;
            if (message.err != null && message.hasOwnProperty("err"))
                object.err = message.err;
            if (message.spanEvent && message.spanEvent.length) {
                object.spanEvent = [];
                for (var j = 0; j < message.spanEvent.length; ++j)
                    object.spanEvent[j] = $root.v1.PSpanEvent.toObject(message.spanEvent[j], options);
            }
            if (message.exceptionInfo != null && message.hasOwnProperty("exceptionInfo"))
                object.exceptionInfo = $root.PIntStringValue.toObject(message.exceptionInfo, options);
            if (message.applicationServiceType != null && message.hasOwnProperty("applicationServiceType"))
                object.applicationServiceType = message.applicationServiceType;
            if (message.loggingTransactionInfo != null && message.hasOwnProperty("loggingTransactionInfo"))
                object.loggingTransactionInfo = message.loggingTransactionInfo;
            return object;
        };

        /**
         * Converts this PSpan to JSON.
         * @function toJSON
         * @memberof v1.PSpan
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PSpan.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PSpan;
    })();

    v1.PTransactionId = (function() {

        /**
         * Properties of a PTransactionId.
         * @memberof v1
         * @interface IPTransactionId
         * @property {string|null} [agentId] PTransactionId agentId
         * @property {number|Long|null} [agentStartTime] PTransactionId agentStartTime
         * @property {number|Long|null} [sequence] PTransactionId sequence
         */

        /**
         * Constructs a new PTransactionId.
         * @memberof v1
         * @classdesc Represents a PTransactionId.
         * @implements IPTransactionId
         * @constructor
         * @param {v1.IPTransactionId=} [properties] Properties to set
         */
        function PTransactionId(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PTransactionId agentId.
         * @member {string} agentId
         * @memberof v1.PTransactionId
         * @instance
         */
        PTransactionId.prototype.agentId = "";

        /**
         * PTransactionId agentStartTime.
         * @member {number|Long} agentStartTime
         * @memberof v1.PTransactionId
         * @instance
         */
        PTransactionId.prototype.agentStartTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PTransactionId sequence.
         * @member {number|Long} sequence
         * @memberof v1.PTransactionId
         * @instance
         */
        PTransactionId.prototype.sequence = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new PTransactionId instance using the specified properties.
         * @function create
         * @memberof v1.PTransactionId
         * @static
         * @param {v1.IPTransactionId=} [properties] Properties to set
         * @returns {v1.PTransactionId} PTransactionId instance
         */
        PTransactionId.create = function create(properties) {
            return new PTransactionId(properties);
        };

        /**
         * Encodes the specified PTransactionId message. Does not implicitly {@link v1.PTransactionId.verify|verify} messages.
         * @function encode
         * @memberof v1.PTransactionId
         * @static
         * @param {v1.IPTransactionId} message PTransactionId message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PTransactionId.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.agentId != null && message.hasOwnProperty("agentId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.agentId);
            if (message.agentStartTime != null && message.hasOwnProperty("agentStartTime"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.agentStartTime);
            if (message.sequence != null && message.hasOwnProperty("sequence"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.sequence);
            return writer;
        };

        /**
         * Encodes the specified PTransactionId message, length delimited. Does not implicitly {@link v1.PTransactionId.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PTransactionId
         * @static
         * @param {v1.IPTransactionId} message PTransactionId message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PTransactionId.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PTransactionId message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PTransactionId
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PTransactionId} PTransactionId
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PTransactionId.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PTransactionId();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.agentId = reader.string();
                    break;
                case 2:
                    message.agentStartTime = reader.int64();
                    break;
                case 3:
                    message.sequence = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PTransactionId message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PTransactionId
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PTransactionId} PTransactionId
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PTransactionId.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PTransactionId message.
         * @function verify
         * @memberof v1.PTransactionId
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PTransactionId.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.agentId != null && message.hasOwnProperty("agentId"))
                if (!$util.isString(message.agentId))
                    return "agentId: string expected";
            if (message.agentStartTime != null && message.hasOwnProperty("agentStartTime"))
                if (!$util.isInteger(message.agentStartTime) && !(message.agentStartTime && $util.isInteger(message.agentStartTime.low) && $util.isInteger(message.agentStartTime.high)))
                    return "agentStartTime: integer|Long expected";
            if (message.sequence != null && message.hasOwnProperty("sequence"))
                if (!$util.isInteger(message.sequence) && !(message.sequence && $util.isInteger(message.sequence.low) && $util.isInteger(message.sequence.high)))
                    return "sequence: integer|Long expected";
            return null;
        };

        /**
         * Creates a PTransactionId message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PTransactionId
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PTransactionId} PTransactionId
         */
        PTransactionId.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PTransactionId)
                return object;
            var message = new $root.v1.PTransactionId();
            if (object.agentId != null)
                message.agentId = String(object.agentId);
            if (object.agentStartTime != null)
                if ($util.Long)
                    (message.agentStartTime = $util.Long.fromValue(object.agentStartTime)).unsigned = false;
                else if (typeof object.agentStartTime === "string")
                    message.agentStartTime = parseInt(object.agentStartTime, 10);
                else if (typeof object.agentStartTime === "number")
                    message.agentStartTime = object.agentStartTime;
                else if (typeof object.agentStartTime === "object")
                    message.agentStartTime = new $util.LongBits(object.agentStartTime.low >>> 0, object.agentStartTime.high >>> 0).toNumber();
            if (object.sequence != null)
                if ($util.Long)
                    (message.sequence = $util.Long.fromValue(object.sequence)).unsigned = false;
                else if (typeof object.sequence === "string")
                    message.sequence = parseInt(object.sequence, 10);
                else if (typeof object.sequence === "number")
                    message.sequence = object.sequence;
                else if (typeof object.sequence === "object")
                    message.sequence = new $util.LongBits(object.sequence.low >>> 0, object.sequence.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a PTransactionId message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PTransactionId
         * @static
         * @param {v1.PTransactionId} message PTransactionId
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PTransactionId.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.agentId = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.agentStartTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.agentStartTime = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.sequence = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.sequence = options.longs === String ? "0" : 0;
            }
            if (message.agentId != null && message.hasOwnProperty("agentId"))
                object.agentId = message.agentId;
            if (message.agentStartTime != null && message.hasOwnProperty("agentStartTime"))
                if (typeof message.agentStartTime === "number")
                    object.agentStartTime = options.longs === String ? String(message.agentStartTime) : message.agentStartTime;
                else
                    object.agentStartTime = options.longs === String ? $util.Long.prototype.toString.call(message.agentStartTime) : options.longs === Number ? new $util.LongBits(message.agentStartTime.low >>> 0, message.agentStartTime.high >>> 0).toNumber() : message.agentStartTime;
            if (message.sequence != null && message.hasOwnProperty("sequence"))
                if (typeof message.sequence === "number")
                    object.sequence = options.longs === String ? String(message.sequence) : message.sequence;
                else
                    object.sequence = options.longs === String ? $util.Long.prototype.toString.call(message.sequence) : options.longs === Number ? new $util.LongBits(message.sequence.low >>> 0, message.sequence.high >>> 0).toNumber() : message.sequence;
            return object;
        };

        /**
         * Converts this PTransactionId to JSON.
         * @function toJSON
         * @memberof v1.PTransactionId
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PTransactionId.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PTransactionId;
    })();

    v1.PAcceptEvent = (function() {

        /**
         * Properties of a PAcceptEvent.
         * @memberof v1
         * @interface IPAcceptEvent
         * @property {string|null} [rpc] PAcceptEvent rpc
         * @property {string|null} [endPoint] PAcceptEvent endPoint
         * @property {string|null} [remoteAddr] PAcceptEvent remoteAddr
         * @property {v1.IPParentInfo|null} [parentInfo] PAcceptEvent parentInfo
         */

        /**
         * Constructs a new PAcceptEvent.
         * @memberof v1
         * @classdesc Represents a PAcceptEvent.
         * @implements IPAcceptEvent
         * @constructor
         * @param {v1.IPAcceptEvent=} [properties] Properties to set
         */
        function PAcceptEvent(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PAcceptEvent rpc.
         * @member {string} rpc
         * @memberof v1.PAcceptEvent
         * @instance
         */
        PAcceptEvent.prototype.rpc = "";

        /**
         * PAcceptEvent endPoint.
         * @member {string} endPoint
         * @memberof v1.PAcceptEvent
         * @instance
         */
        PAcceptEvent.prototype.endPoint = "";

        /**
         * PAcceptEvent remoteAddr.
         * @member {string} remoteAddr
         * @memberof v1.PAcceptEvent
         * @instance
         */
        PAcceptEvent.prototype.remoteAddr = "";

        /**
         * PAcceptEvent parentInfo.
         * @member {v1.IPParentInfo|null|undefined} parentInfo
         * @memberof v1.PAcceptEvent
         * @instance
         */
        PAcceptEvent.prototype.parentInfo = null;

        /**
         * Creates a new PAcceptEvent instance using the specified properties.
         * @function create
         * @memberof v1.PAcceptEvent
         * @static
         * @param {v1.IPAcceptEvent=} [properties] Properties to set
         * @returns {v1.PAcceptEvent} PAcceptEvent instance
         */
        PAcceptEvent.create = function create(properties) {
            return new PAcceptEvent(properties);
        };

        /**
         * Encodes the specified PAcceptEvent message. Does not implicitly {@link v1.PAcceptEvent.verify|verify} messages.
         * @function encode
         * @memberof v1.PAcceptEvent
         * @static
         * @param {v1.IPAcceptEvent} message PAcceptEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PAcceptEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.rpc != null && message.hasOwnProperty("rpc"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.rpc);
            if (message.endPoint != null && message.hasOwnProperty("endPoint"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.endPoint);
            if (message.remoteAddr != null && message.hasOwnProperty("remoteAddr"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.remoteAddr);
            if (message.parentInfo != null && message.hasOwnProperty("parentInfo"))
                $root.v1.PParentInfo.encode(message.parentInfo, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified PAcceptEvent message, length delimited. Does not implicitly {@link v1.PAcceptEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PAcceptEvent
         * @static
         * @param {v1.IPAcceptEvent} message PAcceptEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PAcceptEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PAcceptEvent message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PAcceptEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PAcceptEvent} PAcceptEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PAcceptEvent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PAcceptEvent();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.rpc = reader.string();
                    break;
                case 2:
                    message.endPoint = reader.string();
                    break;
                case 3:
                    message.remoteAddr = reader.string();
                    break;
                case 4:
                    message.parentInfo = $root.v1.PParentInfo.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PAcceptEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PAcceptEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PAcceptEvent} PAcceptEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PAcceptEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PAcceptEvent message.
         * @function verify
         * @memberof v1.PAcceptEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PAcceptEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.rpc != null && message.hasOwnProperty("rpc"))
                if (!$util.isString(message.rpc))
                    return "rpc: string expected";
            if (message.endPoint != null && message.hasOwnProperty("endPoint"))
                if (!$util.isString(message.endPoint))
                    return "endPoint: string expected";
            if (message.remoteAddr != null && message.hasOwnProperty("remoteAddr"))
                if (!$util.isString(message.remoteAddr))
                    return "remoteAddr: string expected";
            if (message.parentInfo != null && message.hasOwnProperty("parentInfo")) {
                var error = $root.v1.PParentInfo.verify(message.parentInfo);
                if (error)
                    return "parentInfo." + error;
            }
            return null;
        };

        /**
         * Creates a PAcceptEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PAcceptEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PAcceptEvent} PAcceptEvent
         */
        PAcceptEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PAcceptEvent)
                return object;
            var message = new $root.v1.PAcceptEvent();
            if (object.rpc != null)
                message.rpc = String(object.rpc);
            if (object.endPoint != null)
                message.endPoint = String(object.endPoint);
            if (object.remoteAddr != null)
                message.remoteAddr = String(object.remoteAddr);
            if (object.parentInfo != null) {
                if (typeof object.parentInfo !== "object")
                    throw TypeError(".v1.PAcceptEvent.parentInfo: object expected");
                message.parentInfo = $root.v1.PParentInfo.fromObject(object.parentInfo);
            }
            return message;
        };

        /**
         * Creates a plain object from a PAcceptEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PAcceptEvent
         * @static
         * @param {v1.PAcceptEvent} message PAcceptEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PAcceptEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.rpc = "";
                object.endPoint = "";
                object.remoteAddr = "";
                object.parentInfo = null;
            }
            if (message.rpc != null && message.hasOwnProperty("rpc"))
                object.rpc = message.rpc;
            if (message.endPoint != null && message.hasOwnProperty("endPoint"))
                object.endPoint = message.endPoint;
            if (message.remoteAddr != null && message.hasOwnProperty("remoteAddr"))
                object.remoteAddr = message.remoteAddr;
            if (message.parentInfo != null && message.hasOwnProperty("parentInfo"))
                object.parentInfo = $root.v1.PParentInfo.toObject(message.parentInfo, options);
            return object;
        };

        /**
         * Converts this PAcceptEvent to JSON.
         * @function toJSON
         * @memberof v1.PAcceptEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PAcceptEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PAcceptEvent;
    })();

    v1.PParentInfo = (function() {

        /**
         * Properties of a PParentInfo.
         * @memberof v1
         * @interface IPParentInfo
         * @property {string|null} [parentApplicationName] PParentInfo parentApplicationName
         * @property {number|null} [parentApplicationType] PParentInfo parentApplicationType
         * @property {string|null} [acceptorHost] PParentInfo acceptorHost
         */

        /**
         * Constructs a new PParentInfo.
         * @memberof v1
         * @classdesc Represents a PParentInfo.
         * @implements IPParentInfo
         * @constructor
         * @param {v1.IPParentInfo=} [properties] Properties to set
         */
        function PParentInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PParentInfo parentApplicationName.
         * @member {string} parentApplicationName
         * @memberof v1.PParentInfo
         * @instance
         */
        PParentInfo.prototype.parentApplicationName = "";

        /**
         * PParentInfo parentApplicationType.
         * @member {number} parentApplicationType
         * @memberof v1.PParentInfo
         * @instance
         */
        PParentInfo.prototype.parentApplicationType = 0;

        /**
         * PParentInfo acceptorHost.
         * @member {string} acceptorHost
         * @memberof v1.PParentInfo
         * @instance
         */
        PParentInfo.prototype.acceptorHost = "";

        /**
         * Creates a new PParentInfo instance using the specified properties.
         * @function create
         * @memberof v1.PParentInfo
         * @static
         * @param {v1.IPParentInfo=} [properties] Properties to set
         * @returns {v1.PParentInfo} PParentInfo instance
         */
        PParentInfo.create = function create(properties) {
            return new PParentInfo(properties);
        };

        /**
         * Encodes the specified PParentInfo message. Does not implicitly {@link v1.PParentInfo.verify|verify} messages.
         * @function encode
         * @memberof v1.PParentInfo
         * @static
         * @param {v1.IPParentInfo} message PParentInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PParentInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.parentApplicationName != null && message.hasOwnProperty("parentApplicationName"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.parentApplicationName);
            if (message.parentApplicationType != null && message.hasOwnProperty("parentApplicationType"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.parentApplicationType);
            if (message.acceptorHost != null && message.hasOwnProperty("acceptorHost"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.acceptorHost);
            return writer;
        };

        /**
         * Encodes the specified PParentInfo message, length delimited. Does not implicitly {@link v1.PParentInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PParentInfo
         * @static
         * @param {v1.IPParentInfo} message PParentInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PParentInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PParentInfo message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PParentInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PParentInfo} PParentInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PParentInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PParentInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.parentApplicationName = reader.string();
                    break;
                case 2:
                    message.parentApplicationType = reader.int32();
                    break;
                case 3:
                    message.acceptorHost = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PParentInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PParentInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PParentInfo} PParentInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PParentInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PParentInfo message.
         * @function verify
         * @memberof v1.PParentInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PParentInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.parentApplicationName != null && message.hasOwnProperty("parentApplicationName"))
                if (!$util.isString(message.parentApplicationName))
                    return "parentApplicationName: string expected";
            if (message.parentApplicationType != null && message.hasOwnProperty("parentApplicationType"))
                if (!$util.isInteger(message.parentApplicationType))
                    return "parentApplicationType: integer expected";
            if (message.acceptorHost != null && message.hasOwnProperty("acceptorHost"))
                if (!$util.isString(message.acceptorHost))
                    return "acceptorHost: string expected";
            return null;
        };

        /**
         * Creates a PParentInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PParentInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PParentInfo} PParentInfo
         */
        PParentInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PParentInfo)
                return object;
            var message = new $root.v1.PParentInfo();
            if (object.parentApplicationName != null)
                message.parentApplicationName = String(object.parentApplicationName);
            if (object.parentApplicationType != null)
                message.parentApplicationType = object.parentApplicationType | 0;
            if (object.acceptorHost != null)
                message.acceptorHost = String(object.acceptorHost);
            return message;
        };

        /**
         * Creates a plain object from a PParentInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PParentInfo
         * @static
         * @param {v1.PParentInfo} message PParentInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PParentInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.parentApplicationName = "";
                object.parentApplicationType = 0;
                object.acceptorHost = "";
            }
            if (message.parentApplicationName != null && message.hasOwnProperty("parentApplicationName"))
                object.parentApplicationName = message.parentApplicationName;
            if (message.parentApplicationType != null && message.hasOwnProperty("parentApplicationType"))
                object.parentApplicationType = message.parentApplicationType;
            if (message.acceptorHost != null && message.hasOwnProperty("acceptorHost"))
                object.acceptorHost = message.acceptorHost;
            return object;
        };

        /**
         * Converts this PParentInfo to JSON.
         * @function toJSON
         * @memberof v1.PParentInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PParentInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PParentInfo;
    })();

    v1.PLocalAsyncId = (function() {

        /**
         * Properties of a PLocalAsyncId.
         * @memberof v1
         * @interface IPLocalAsyncId
         * @property {number|null} [asyncId] PLocalAsyncId asyncId
         * @property {number|null} [sequence] PLocalAsyncId sequence
         */

        /**
         * Constructs a new PLocalAsyncId.
         * @memberof v1
         * @classdesc Represents a PLocalAsyncId.
         * @implements IPLocalAsyncId
         * @constructor
         * @param {v1.IPLocalAsyncId=} [properties] Properties to set
         */
        function PLocalAsyncId(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PLocalAsyncId asyncId.
         * @member {number} asyncId
         * @memberof v1.PLocalAsyncId
         * @instance
         */
        PLocalAsyncId.prototype.asyncId = 0;

        /**
         * PLocalAsyncId sequence.
         * @member {number} sequence
         * @memberof v1.PLocalAsyncId
         * @instance
         */
        PLocalAsyncId.prototype.sequence = 0;

        /**
         * Creates a new PLocalAsyncId instance using the specified properties.
         * @function create
         * @memberof v1.PLocalAsyncId
         * @static
         * @param {v1.IPLocalAsyncId=} [properties] Properties to set
         * @returns {v1.PLocalAsyncId} PLocalAsyncId instance
         */
        PLocalAsyncId.create = function create(properties) {
            return new PLocalAsyncId(properties);
        };

        /**
         * Encodes the specified PLocalAsyncId message. Does not implicitly {@link v1.PLocalAsyncId.verify|verify} messages.
         * @function encode
         * @memberof v1.PLocalAsyncId
         * @static
         * @param {v1.IPLocalAsyncId} message PLocalAsyncId message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PLocalAsyncId.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.asyncId != null && message.hasOwnProperty("asyncId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.asyncId);
            if (message.sequence != null && message.hasOwnProperty("sequence"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.sequence);
            return writer;
        };

        /**
         * Encodes the specified PLocalAsyncId message, length delimited. Does not implicitly {@link v1.PLocalAsyncId.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PLocalAsyncId
         * @static
         * @param {v1.IPLocalAsyncId} message PLocalAsyncId message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PLocalAsyncId.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PLocalAsyncId message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PLocalAsyncId
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PLocalAsyncId} PLocalAsyncId
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PLocalAsyncId.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PLocalAsyncId();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.asyncId = reader.int32();
                    break;
                case 2:
                    message.sequence = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PLocalAsyncId message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PLocalAsyncId
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PLocalAsyncId} PLocalAsyncId
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PLocalAsyncId.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PLocalAsyncId message.
         * @function verify
         * @memberof v1.PLocalAsyncId
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PLocalAsyncId.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.asyncId != null && message.hasOwnProperty("asyncId"))
                if (!$util.isInteger(message.asyncId))
                    return "asyncId: integer expected";
            if (message.sequence != null && message.hasOwnProperty("sequence"))
                if (!$util.isInteger(message.sequence))
                    return "sequence: integer expected";
            return null;
        };

        /**
         * Creates a PLocalAsyncId message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PLocalAsyncId
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PLocalAsyncId} PLocalAsyncId
         */
        PLocalAsyncId.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PLocalAsyncId)
                return object;
            var message = new $root.v1.PLocalAsyncId();
            if (object.asyncId != null)
                message.asyncId = object.asyncId | 0;
            if (object.sequence != null)
                message.sequence = object.sequence | 0;
            return message;
        };

        /**
         * Creates a plain object from a PLocalAsyncId message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PLocalAsyncId
         * @static
         * @param {v1.PLocalAsyncId} message PLocalAsyncId
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PLocalAsyncId.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.asyncId = 0;
                object.sequence = 0;
            }
            if (message.asyncId != null && message.hasOwnProperty("asyncId"))
                object.asyncId = message.asyncId;
            if (message.sequence != null && message.hasOwnProperty("sequence"))
                object.sequence = message.sequence;
            return object;
        };

        /**
         * Converts this PLocalAsyncId to JSON.
         * @function toJSON
         * @memberof v1.PLocalAsyncId
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PLocalAsyncId.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PLocalAsyncId;
    })();

    v1.PSpanEvent = (function() {

        /**
         * Properties of a PSpanEvent.
         * @memberof v1
         * @interface IPSpanEvent
         * @property {number|null} [sequence] PSpanEvent sequence
         * @property {number|null} [depth] PSpanEvent depth
         * @property {number|null} [startElapsed] PSpanEvent startElapsed
         * @property {number|null} [endElapsed] PSpanEvent endElapsed
         * @property {number|null} [serviceType] PSpanEvent serviceType
         * @property {Array.<IPAnnotation>|null} [annotation] PSpanEvent annotation
         * @property {number|null} [apiId] PSpanEvent apiId
         * @property {IPIntStringValue|null} [exceptionInfo] PSpanEvent exceptionInfo
         * @property {v1.IPNextEvent|null} [nextEvent] PSpanEvent nextEvent
         * @property {number|null} [asyncEvent] PSpanEvent asyncEvent
         */

        /**
         * Constructs a new PSpanEvent.
         * @memberof v1
         * @classdesc Represents a PSpanEvent.
         * @implements IPSpanEvent
         * @constructor
         * @param {v1.IPSpanEvent=} [properties] Properties to set
         */
        function PSpanEvent(properties) {
            this.annotation = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PSpanEvent sequence.
         * @member {number} sequence
         * @memberof v1.PSpanEvent
         * @instance
         */
        PSpanEvent.prototype.sequence = 0;

        /**
         * PSpanEvent depth.
         * @member {number} depth
         * @memberof v1.PSpanEvent
         * @instance
         */
        PSpanEvent.prototype.depth = 0;

        /**
         * PSpanEvent startElapsed.
         * @member {number} startElapsed
         * @memberof v1.PSpanEvent
         * @instance
         */
        PSpanEvent.prototype.startElapsed = 0;

        /**
         * PSpanEvent endElapsed.
         * @member {number} endElapsed
         * @memberof v1.PSpanEvent
         * @instance
         */
        PSpanEvent.prototype.endElapsed = 0;

        /**
         * PSpanEvent serviceType.
         * @member {number} serviceType
         * @memberof v1.PSpanEvent
         * @instance
         */
        PSpanEvent.prototype.serviceType = 0;

        /**
         * PSpanEvent annotation.
         * @member {Array.<IPAnnotation>} annotation
         * @memberof v1.PSpanEvent
         * @instance
         */
        PSpanEvent.prototype.annotation = $util.emptyArray;

        /**
         * PSpanEvent apiId.
         * @member {number} apiId
         * @memberof v1.PSpanEvent
         * @instance
         */
        PSpanEvent.prototype.apiId = 0;

        /**
         * PSpanEvent exceptionInfo.
         * @member {IPIntStringValue|null|undefined} exceptionInfo
         * @memberof v1.PSpanEvent
         * @instance
         */
        PSpanEvent.prototype.exceptionInfo = null;

        /**
         * PSpanEvent nextEvent.
         * @member {v1.IPNextEvent|null|undefined} nextEvent
         * @memberof v1.PSpanEvent
         * @instance
         */
        PSpanEvent.prototype.nextEvent = null;

        /**
         * PSpanEvent asyncEvent.
         * @member {number} asyncEvent
         * @memberof v1.PSpanEvent
         * @instance
         */
        PSpanEvent.prototype.asyncEvent = 0;

        /**
         * Creates a new PSpanEvent instance using the specified properties.
         * @function create
         * @memberof v1.PSpanEvent
         * @static
         * @param {v1.IPSpanEvent=} [properties] Properties to set
         * @returns {v1.PSpanEvent} PSpanEvent instance
         */
        PSpanEvent.create = function create(properties) {
            return new PSpanEvent(properties);
        };

        /**
         * Encodes the specified PSpanEvent message. Does not implicitly {@link v1.PSpanEvent.verify|verify} messages.
         * @function encode
         * @memberof v1.PSpanEvent
         * @static
         * @param {v1.IPSpanEvent} message PSpanEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PSpanEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.sequence != null && message.hasOwnProperty("sequence"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.sequence);
            if (message.depth != null && message.hasOwnProperty("depth"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.depth);
            if (message.startElapsed != null && message.hasOwnProperty("startElapsed"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.startElapsed);
            if (message.endElapsed != null && message.hasOwnProperty("endElapsed"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.endElapsed);
            if (message.serviceType != null && message.hasOwnProperty("serviceType"))
                writer.uint32(/* id 5, wireType 0 =*/40).sint32(message.serviceType);
            if (message.annotation != null && message.annotation.length)
                for (var i = 0; i < message.annotation.length; ++i)
                    $root.PAnnotation.encode(message.annotation[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.apiId != null && message.hasOwnProperty("apiId"))
                writer.uint32(/* id 10, wireType 0 =*/80).sint32(message.apiId);
            if (message.exceptionInfo != null && message.hasOwnProperty("exceptionInfo"))
                $root.PIntStringValue.encode(message.exceptionInfo, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
            if (message.nextEvent != null && message.hasOwnProperty("nextEvent"))
                $root.v1.PNextEvent.encode(message.nextEvent, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
            if (message.asyncEvent != null && message.hasOwnProperty("asyncEvent"))
                writer.uint32(/* id 13, wireType 0 =*/104).int32(message.asyncEvent);
            return writer;
        };

        /**
         * Encodes the specified PSpanEvent message, length delimited. Does not implicitly {@link v1.PSpanEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PSpanEvent
         * @static
         * @param {v1.IPSpanEvent} message PSpanEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PSpanEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PSpanEvent message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PSpanEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PSpanEvent} PSpanEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PSpanEvent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PSpanEvent();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.sequence = reader.int32();
                    break;
                case 2:
                    message.depth = reader.int32();
                    break;
                case 3:
                    message.startElapsed = reader.int32();
                    break;
                case 4:
                    message.endElapsed = reader.int32();
                    break;
                case 5:
                    message.serviceType = reader.sint32();
                    break;
                case 6:
                    if (!(message.annotation && message.annotation.length))
                        message.annotation = [];
                    message.annotation.push($root.PAnnotation.decode(reader, reader.uint32()));
                    break;
                case 10:
                    message.apiId = reader.sint32();
                    break;
                case 11:
                    message.exceptionInfo = $root.PIntStringValue.decode(reader, reader.uint32());
                    break;
                case 12:
                    message.nextEvent = $root.v1.PNextEvent.decode(reader, reader.uint32());
                    break;
                case 13:
                    message.asyncEvent = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PSpanEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PSpanEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PSpanEvent} PSpanEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PSpanEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PSpanEvent message.
         * @function verify
         * @memberof v1.PSpanEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PSpanEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.sequence != null && message.hasOwnProperty("sequence"))
                if (!$util.isInteger(message.sequence))
                    return "sequence: integer expected";
            if (message.depth != null && message.hasOwnProperty("depth"))
                if (!$util.isInteger(message.depth))
                    return "depth: integer expected";
            if (message.startElapsed != null && message.hasOwnProperty("startElapsed"))
                if (!$util.isInteger(message.startElapsed))
                    return "startElapsed: integer expected";
            if (message.endElapsed != null && message.hasOwnProperty("endElapsed"))
                if (!$util.isInteger(message.endElapsed))
                    return "endElapsed: integer expected";
            if (message.serviceType != null && message.hasOwnProperty("serviceType"))
                if (!$util.isInteger(message.serviceType))
                    return "serviceType: integer expected";
            if (message.annotation != null && message.hasOwnProperty("annotation")) {
                if (!Array.isArray(message.annotation))
                    return "annotation: array expected";
                for (var i = 0; i < message.annotation.length; ++i) {
                    var error = $root.PAnnotation.verify(message.annotation[i]);
                    if (error)
                        return "annotation." + error;
                }
            }
            if (message.apiId != null && message.hasOwnProperty("apiId"))
                if (!$util.isInteger(message.apiId))
                    return "apiId: integer expected";
            if (message.exceptionInfo != null && message.hasOwnProperty("exceptionInfo")) {
                var error = $root.PIntStringValue.verify(message.exceptionInfo);
                if (error)
                    return "exceptionInfo." + error;
            }
            if (message.nextEvent != null && message.hasOwnProperty("nextEvent")) {
                var error = $root.v1.PNextEvent.verify(message.nextEvent);
                if (error)
                    return "nextEvent." + error;
            }
            if (message.asyncEvent != null && message.hasOwnProperty("asyncEvent"))
                if (!$util.isInteger(message.asyncEvent))
                    return "asyncEvent: integer expected";
            return null;
        };

        /**
         * Creates a PSpanEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PSpanEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PSpanEvent} PSpanEvent
         */
        PSpanEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PSpanEvent)
                return object;
            var message = new $root.v1.PSpanEvent();
            if (object.sequence != null)
                message.sequence = object.sequence | 0;
            if (object.depth != null)
                message.depth = object.depth | 0;
            if (object.startElapsed != null)
                message.startElapsed = object.startElapsed | 0;
            if (object.endElapsed != null)
                message.endElapsed = object.endElapsed | 0;
            if (object.serviceType != null)
                message.serviceType = object.serviceType | 0;
            if (object.annotation) {
                if (!Array.isArray(object.annotation))
                    throw TypeError(".v1.PSpanEvent.annotation: array expected");
                message.annotation = [];
                for (var i = 0; i < object.annotation.length; ++i) {
                    if (typeof object.annotation[i] !== "object")
                        throw TypeError(".v1.PSpanEvent.annotation: object expected");
                    message.annotation[i] = $root.PAnnotation.fromObject(object.annotation[i]);
                }
            }
            if (object.apiId != null)
                message.apiId = object.apiId | 0;
            if (object.exceptionInfo != null) {
                if (typeof object.exceptionInfo !== "object")
                    throw TypeError(".v1.PSpanEvent.exceptionInfo: object expected");
                message.exceptionInfo = $root.PIntStringValue.fromObject(object.exceptionInfo);
            }
            if (object.nextEvent != null) {
                if (typeof object.nextEvent !== "object")
                    throw TypeError(".v1.PSpanEvent.nextEvent: object expected");
                message.nextEvent = $root.v1.PNextEvent.fromObject(object.nextEvent);
            }
            if (object.asyncEvent != null)
                message.asyncEvent = object.asyncEvent | 0;
            return message;
        };

        /**
         * Creates a plain object from a PSpanEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PSpanEvent
         * @static
         * @param {v1.PSpanEvent} message PSpanEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PSpanEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.annotation = [];
            if (options.defaults) {
                object.sequence = 0;
                object.depth = 0;
                object.startElapsed = 0;
                object.endElapsed = 0;
                object.serviceType = 0;
                object.apiId = 0;
                object.exceptionInfo = null;
                object.nextEvent = null;
                object.asyncEvent = 0;
            }
            if (message.sequence != null && message.hasOwnProperty("sequence"))
                object.sequence = message.sequence;
            if (message.depth != null && message.hasOwnProperty("depth"))
                object.depth = message.depth;
            if (message.startElapsed != null && message.hasOwnProperty("startElapsed"))
                object.startElapsed = message.startElapsed;
            if (message.endElapsed != null && message.hasOwnProperty("endElapsed"))
                object.endElapsed = message.endElapsed;
            if (message.serviceType != null && message.hasOwnProperty("serviceType"))
                object.serviceType = message.serviceType;
            if (message.annotation && message.annotation.length) {
                object.annotation = [];
                for (var j = 0; j < message.annotation.length; ++j)
                    object.annotation[j] = $root.PAnnotation.toObject(message.annotation[j], options);
            }
            if (message.apiId != null && message.hasOwnProperty("apiId"))
                object.apiId = message.apiId;
            if (message.exceptionInfo != null && message.hasOwnProperty("exceptionInfo"))
                object.exceptionInfo = $root.PIntStringValue.toObject(message.exceptionInfo, options);
            if (message.nextEvent != null && message.hasOwnProperty("nextEvent"))
                object.nextEvent = $root.v1.PNextEvent.toObject(message.nextEvent, options);
            if (message.asyncEvent != null && message.hasOwnProperty("asyncEvent"))
                object.asyncEvent = message.asyncEvent;
            return object;
        };

        /**
         * Converts this PSpanEvent to JSON.
         * @function toJSON
         * @memberof v1.PSpanEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PSpanEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PSpanEvent;
    })();

    v1.PNextEvent = (function() {

        /**
         * Properties of a PNextEvent.
         * @memberof v1
         * @interface IPNextEvent
         * @property {v1.IPMessageEvent|null} [messageEvent] PNextEvent messageEvent
         */

        /**
         * Constructs a new PNextEvent.
         * @memberof v1
         * @classdesc Represents a PNextEvent.
         * @implements IPNextEvent
         * @constructor
         * @param {v1.IPNextEvent=} [properties] Properties to set
         */
        function PNextEvent(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PNextEvent messageEvent.
         * @member {v1.IPMessageEvent|null|undefined} messageEvent
         * @memberof v1.PNextEvent
         * @instance
         */
        PNextEvent.prototype.messageEvent = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * PNextEvent field.
         * @member {"messageEvent"|undefined} field
         * @memberof v1.PNextEvent
         * @instance
         */
        Object.defineProperty(PNextEvent.prototype, "field", {
            get: $util.oneOfGetter($oneOfFields = ["messageEvent"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new PNextEvent instance using the specified properties.
         * @function create
         * @memberof v1.PNextEvent
         * @static
         * @param {v1.IPNextEvent=} [properties] Properties to set
         * @returns {v1.PNextEvent} PNextEvent instance
         */
        PNextEvent.create = function create(properties) {
            return new PNextEvent(properties);
        };

        /**
         * Encodes the specified PNextEvent message. Does not implicitly {@link v1.PNextEvent.verify|verify} messages.
         * @function encode
         * @memberof v1.PNextEvent
         * @static
         * @param {v1.IPNextEvent} message PNextEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PNextEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.messageEvent != null && message.hasOwnProperty("messageEvent"))
                $root.v1.PMessageEvent.encode(message.messageEvent, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified PNextEvent message, length delimited. Does not implicitly {@link v1.PNextEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PNextEvent
         * @static
         * @param {v1.IPNextEvent} message PNextEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PNextEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PNextEvent message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PNextEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PNextEvent} PNextEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PNextEvent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PNextEvent();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.messageEvent = $root.v1.PMessageEvent.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PNextEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PNextEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PNextEvent} PNextEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PNextEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PNextEvent message.
         * @function verify
         * @memberof v1.PNextEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PNextEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.messageEvent != null && message.hasOwnProperty("messageEvent")) {
                properties.field = 1;
                {
                    var error = $root.v1.PMessageEvent.verify(message.messageEvent);
                    if (error)
                        return "messageEvent." + error;
                }
            }
            return null;
        };

        /**
         * Creates a PNextEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PNextEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PNextEvent} PNextEvent
         */
        PNextEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PNextEvent)
                return object;
            var message = new $root.v1.PNextEvent();
            if (object.messageEvent != null) {
                if (typeof object.messageEvent !== "object")
                    throw TypeError(".v1.PNextEvent.messageEvent: object expected");
                message.messageEvent = $root.v1.PMessageEvent.fromObject(object.messageEvent);
            }
            return message;
        };

        /**
         * Creates a plain object from a PNextEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PNextEvent
         * @static
         * @param {v1.PNextEvent} message PNextEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PNextEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (message.messageEvent != null && message.hasOwnProperty("messageEvent")) {
                object.messageEvent = $root.v1.PMessageEvent.toObject(message.messageEvent, options);
                if (options.oneofs)
                    object.field = "messageEvent";
            }
            return object;
        };

        /**
         * Converts this PNextEvent to JSON.
         * @function toJSON
         * @memberof v1.PNextEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PNextEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PNextEvent;
    })();

    v1.PMessageEvent = (function() {

        /**
         * Properties of a PMessageEvent.
         * @memberof v1
         * @interface IPMessageEvent
         * @property {number|Long|null} [nextSpanId] PMessageEvent nextSpanId
         * @property {string|null} [endPoint] PMessageEvent endPoint
         * @property {string|null} [destinationId] PMessageEvent destinationId
         */

        /**
         * Constructs a new PMessageEvent.
         * @memberof v1
         * @classdesc Represents a PMessageEvent.
         * @implements IPMessageEvent
         * @constructor
         * @param {v1.IPMessageEvent=} [properties] Properties to set
         */
        function PMessageEvent(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PMessageEvent nextSpanId.
         * @member {number|Long} nextSpanId
         * @memberof v1.PMessageEvent
         * @instance
         */
        PMessageEvent.prototype.nextSpanId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PMessageEvent endPoint.
         * @member {string} endPoint
         * @memberof v1.PMessageEvent
         * @instance
         */
        PMessageEvent.prototype.endPoint = "";

        /**
         * PMessageEvent destinationId.
         * @member {string} destinationId
         * @memberof v1.PMessageEvent
         * @instance
         */
        PMessageEvent.prototype.destinationId = "";

        /**
         * Creates a new PMessageEvent instance using the specified properties.
         * @function create
         * @memberof v1.PMessageEvent
         * @static
         * @param {v1.IPMessageEvent=} [properties] Properties to set
         * @returns {v1.PMessageEvent} PMessageEvent instance
         */
        PMessageEvent.create = function create(properties) {
            return new PMessageEvent(properties);
        };

        /**
         * Encodes the specified PMessageEvent message. Does not implicitly {@link v1.PMessageEvent.verify|verify} messages.
         * @function encode
         * @memberof v1.PMessageEvent
         * @static
         * @param {v1.IPMessageEvent} message PMessageEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PMessageEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.nextSpanId != null && message.hasOwnProperty("nextSpanId"))
                writer.uint32(/* id 1, wireType 1 =*/9).sfixed64(message.nextSpanId);
            if (message.endPoint != null && message.hasOwnProperty("endPoint"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.endPoint);
            if (message.destinationId != null && message.hasOwnProperty("destinationId"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.destinationId);
            return writer;
        };

        /**
         * Encodes the specified PMessageEvent message, length delimited. Does not implicitly {@link v1.PMessageEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PMessageEvent
         * @static
         * @param {v1.IPMessageEvent} message PMessageEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PMessageEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PMessageEvent message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PMessageEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PMessageEvent} PMessageEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PMessageEvent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PMessageEvent();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.nextSpanId = reader.sfixed64();
                    break;
                case 2:
                    message.endPoint = reader.string();
                    break;
                case 3:
                    message.destinationId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PMessageEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PMessageEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PMessageEvent} PMessageEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PMessageEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PMessageEvent message.
         * @function verify
         * @memberof v1.PMessageEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PMessageEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.nextSpanId != null && message.hasOwnProperty("nextSpanId"))
                if (!$util.isInteger(message.nextSpanId) && !(message.nextSpanId && $util.isInteger(message.nextSpanId.low) && $util.isInteger(message.nextSpanId.high)))
                    return "nextSpanId: integer|Long expected";
            if (message.endPoint != null && message.hasOwnProperty("endPoint"))
                if (!$util.isString(message.endPoint))
                    return "endPoint: string expected";
            if (message.destinationId != null && message.hasOwnProperty("destinationId"))
                if (!$util.isString(message.destinationId))
                    return "destinationId: string expected";
            return null;
        };

        /**
         * Creates a PMessageEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PMessageEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PMessageEvent} PMessageEvent
         */
        PMessageEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PMessageEvent)
                return object;
            var message = new $root.v1.PMessageEvent();
            if (object.nextSpanId != null)
                if ($util.Long)
                    (message.nextSpanId = $util.Long.fromValue(object.nextSpanId)).unsigned = false;
                else if (typeof object.nextSpanId === "string")
                    message.nextSpanId = parseInt(object.nextSpanId, 10);
                else if (typeof object.nextSpanId === "number")
                    message.nextSpanId = object.nextSpanId;
                else if (typeof object.nextSpanId === "object")
                    message.nextSpanId = new $util.LongBits(object.nextSpanId.low >>> 0, object.nextSpanId.high >>> 0).toNumber();
            if (object.endPoint != null)
                message.endPoint = String(object.endPoint);
            if (object.destinationId != null)
                message.destinationId = String(object.destinationId);
            return message;
        };

        /**
         * Creates a plain object from a PMessageEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PMessageEvent
         * @static
         * @param {v1.PMessageEvent} message PMessageEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PMessageEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.nextSpanId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.nextSpanId = options.longs === String ? "0" : 0;
                object.endPoint = "";
                object.destinationId = "";
            }
            if (message.nextSpanId != null && message.hasOwnProperty("nextSpanId"))
                if (typeof message.nextSpanId === "number")
                    object.nextSpanId = options.longs === String ? String(message.nextSpanId) : message.nextSpanId;
                else
                    object.nextSpanId = options.longs === String ? $util.Long.prototype.toString.call(message.nextSpanId) : options.longs === Number ? new $util.LongBits(message.nextSpanId.low >>> 0, message.nextSpanId.high >>> 0).toNumber() : message.nextSpanId;
            if (message.endPoint != null && message.hasOwnProperty("endPoint"))
                object.endPoint = message.endPoint;
            if (message.destinationId != null && message.hasOwnProperty("destinationId"))
                object.destinationId = message.destinationId;
            return object;
        };

        /**
         * Converts this PMessageEvent to JSON.
         * @function toJSON
         * @memberof v1.PMessageEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PMessageEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PMessageEvent;
    })();

    v1.PSpanChunk = (function() {

        /**
         * Properties of a PSpanChunk.
         * @memberof v1
         * @interface IPSpanChunk
         * @property {number|null} [version] PSpanChunk version
         * @property {v1.IPTransactionId|null} [transactionId] PSpanChunk transactionId
         * @property {number|Long|null} [spanId] PSpanChunk spanId
         * @property {string|null} [endPoint] PSpanChunk endPoint
         * @property {Array.<v1.IPSpanEvent>|null} [spanEvent] PSpanChunk spanEvent
         * @property {number|null} [applicationServiceType] PSpanChunk applicationServiceType
         * @property {number|Long|null} [keyTime] PSpanChunk keyTime
         * @property {v1.IPLocalAsyncId|null} [localAsyncId] PSpanChunk localAsyncId
         */

        /**
         * Constructs a new PSpanChunk.
         * @memberof v1
         * @classdesc Represents a PSpanChunk.
         * @implements IPSpanChunk
         * @constructor
         * @param {v1.IPSpanChunk=} [properties] Properties to set
         */
        function PSpanChunk(properties) {
            this.spanEvent = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PSpanChunk version.
         * @member {number} version
         * @memberof v1.PSpanChunk
         * @instance
         */
        PSpanChunk.prototype.version = 0;

        /**
         * PSpanChunk transactionId.
         * @member {v1.IPTransactionId|null|undefined} transactionId
         * @memberof v1.PSpanChunk
         * @instance
         */
        PSpanChunk.prototype.transactionId = null;

        /**
         * PSpanChunk spanId.
         * @member {number|Long} spanId
         * @memberof v1.PSpanChunk
         * @instance
         */
        PSpanChunk.prototype.spanId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PSpanChunk endPoint.
         * @member {string} endPoint
         * @memberof v1.PSpanChunk
         * @instance
         */
        PSpanChunk.prototype.endPoint = "";

        /**
         * PSpanChunk spanEvent.
         * @member {Array.<v1.IPSpanEvent>} spanEvent
         * @memberof v1.PSpanChunk
         * @instance
         */
        PSpanChunk.prototype.spanEvent = $util.emptyArray;

        /**
         * PSpanChunk applicationServiceType.
         * @member {number} applicationServiceType
         * @memberof v1.PSpanChunk
         * @instance
         */
        PSpanChunk.prototype.applicationServiceType = 0;

        /**
         * PSpanChunk keyTime.
         * @member {number|Long} keyTime
         * @memberof v1.PSpanChunk
         * @instance
         */
        PSpanChunk.prototype.keyTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PSpanChunk localAsyncId.
         * @member {v1.IPLocalAsyncId|null|undefined} localAsyncId
         * @memberof v1.PSpanChunk
         * @instance
         */
        PSpanChunk.prototype.localAsyncId = null;

        /**
         * Creates a new PSpanChunk instance using the specified properties.
         * @function create
         * @memberof v1.PSpanChunk
         * @static
         * @param {v1.IPSpanChunk=} [properties] Properties to set
         * @returns {v1.PSpanChunk} PSpanChunk instance
         */
        PSpanChunk.create = function create(properties) {
            return new PSpanChunk(properties);
        };

        /**
         * Encodes the specified PSpanChunk message. Does not implicitly {@link v1.PSpanChunk.verify|verify} messages.
         * @function encode
         * @memberof v1.PSpanChunk
         * @static
         * @param {v1.IPSpanChunk} message PSpanChunk message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PSpanChunk.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.version != null && message.hasOwnProperty("version"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.version);
            if (message.transactionId != null && message.hasOwnProperty("transactionId"))
                $root.v1.PTransactionId.encode(message.transactionId, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.spanId != null && message.hasOwnProperty("spanId"))
                writer.uint32(/* id 3, wireType 1 =*/25).sfixed64(message.spanId);
            if (message.endPoint != null && message.hasOwnProperty("endPoint"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.endPoint);
            if (message.spanEvent != null && message.spanEvent.length)
                for (var i = 0; i < message.spanEvent.length; ++i)
                    $root.v1.PSpanEvent.encode(message.spanEvent[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.applicationServiceType != null && message.hasOwnProperty("applicationServiceType"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.applicationServiceType);
            if (message.keyTime != null && message.hasOwnProperty("keyTime"))
                writer.uint32(/* id 7, wireType 0 =*/56).int64(message.keyTime);
            if (message.localAsyncId != null && message.hasOwnProperty("localAsyncId"))
                $root.v1.PLocalAsyncId.encode(message.localAsyncId, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified PSpanChunk message, length delimited. Does not implicitly {@link v1.PSpanChunk.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PSpanChunk
         * @static
         * @param {v1.IPSpanChunk} message PSpanChunk message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PSpanChunk.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PSpanChunk message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PSpanChunk
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PSpanChunk} PSpanChunk
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PSpanChunk.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PSpanChunk();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.version = reader.int32();
                    break;
                case 2:
                    message.transactionId = $root.v1.PTransactionId.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.spanId = reader.sfixed64();
                    break;
                case 4:
                    message.endPoint = reader.string();
                    break;
                case 5:
                    if (!(message.spanEvent && message.spanEvent.length))
                        message.spanEvent = [];
                    message.spanEvent.push($root.v1.PSpanEvent.decode(reader, reader.uint32()));
                    break;
                case 6:
                    message.applicationServiceType = reader.int32();
                    break;
                case 7:
                    message.keyTime = reader.int64();
                    break;
                case 8:
                    message.localAsyncId = $root.v1.PLocalAsyncId.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PSpanChunk message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PSpanChunk
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PSpanChunk} PSpanChunk
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PSpanChunk.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PSpanChunk message.
         * @function verify
         * @memberof v1.PSpanChunk
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PSpanChunk.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.version != null && message.hasOwnProperty("version"))
                if (!$util.isInteger(message.version))
                    return "version: integer expected";
            if (message.transactionId != null && message.hasOwnProperty("transactionId")) {
                var error = $root.v1.PTransactionId.verify(message.transactionId);
                if (error)
                    return "transactionId." + error;
            }
            if (message.spanId != null && message.hasOwnProperty("spanId"))
                if (!$util.isInteger(message.spanId) && !(message.spanId && $util.isInteger(message.spanId.low) && $util.isInteger(message.spanId.high)))
                    return "spanId: integer|Long expected";
            if (message.endPoint != null && message.hasOwnProperty("endPoint"))
                if (!$util.isString(message.endPoint))
                    return "endPoint: string expected";
            if (message.spanEvent != null && message.hasOwnProperty("spanEvent")) {
                if (!Array.isArray(message.spanEvent))
                    return "spanEvent: array expected";
                for (var i = 0; i < message.spanEvent.length; ++i) {
                    var error = $root.v1.PSpanEvent.verify(message.spanEvent[i]);
                    if (error)
                        return "spanEvent." + error;
                }
            }
            if (message.applicationServiceType != null && message.hasOwnProperty("applicationServiceType"))
                if (!$util.isInteger(message.applicationServiceType))
                    return "applicationServiceType: integer expected";
            if (message.keyTime != null && message.hasOwnProperty("keyTime"))
                if (!$util.isInteger(message.keyTime) && !(message.keyTime && $util.isInteger(message.keyTime.low) && $util.isInteger(message.keyTime.high)))
                    return "keyTime: integer|Long expected";
            if (message.localAsyncId != null && message.hasOwnProperty("localAsyncId")) {
                var error = $root.v1.PLocalAsyncId.verify(message.localAsyncId);
                if (error)
                    return "localAsyncId." + error;
            }
            return null;
        };

        /**
         * Creates a PSpanChunk message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PSpanChunk
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PSpanChunk} PSpanChunk
         */
        PSpanChunk.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PSpanChunk)
                return object;
            var message = new $root.v1.PSpanChunk();
            if (object.version != null)
                message.version = object.version | 0;
            if (object.transactionId != null) {
                if (typeof object.transactionId !== "object")
                    throw TypeError(".v1.PSpanChunk.transactionId: object expected");
                message.transactionId = $root.v1.PTransactionId.fromObject(object.transactionId);
            }
            if (object.spanId != null)
                if ($util.Long)
                    (message.spanId = $util.Long.fromValue(object.spanId)).unsigned = false;
                else if (typeof object.spanId === "string")
                    message.spanId = parseInt(object.spanId, 10);
                else if (typeof object.spanId === "number")
                    message.spanId = object.spanId;
                else if (typeof object.spanId === "object")
                    message.spanId = new $util.LongBits(object.spanId.low >>> 0, object.spanId.high >>> 0).toNumber();
            if (object.endPoint != null)
                message.endPoint = String(object.endPoint);
            if (object.spanEvent) {
                if (!Array.isArray(object.spanEvent))
                    throw TypeError(".v1.PSpanChunk.spanEvent: array expected");
                message.spanEvent = [];
                for (var i = 0; i < object.spanEvent.length; ++i) {
                    if (typeof object.spanEvent[i] !== "object")
                        throw TypeError(".v1.PSpanChunk.spanEvent: object expected");
                    message.spanEvent[i] = $root.v1.PSpanEvent.fromObject(object.spanEvent[i]);
                }
            }
            if (object.applicationServiceType != null)
                message.applicationServiceType = object.applicationServiceType | 0;
            if (object.keyTime != null)
                if ($util.Long)
                    (message.keyTime = $util.Long.fromValue(object.keyTime)).unsigned = false;
                else if (typeof object.keyTime === "string")
                    message.keyTime = parseInt(object.keyTime, 10);
                else if (typeof object.keyTime === "number")
                    message.keyTime = object.keyTime;
                else if (typeof object.keyTime === "object")
                    message.keyTime = new $util.LongBits(object.keyTime.low >>> 0, object.keyTime.high >>> 0).toNumber();
            if (object.localAsyncId != null) {
                if (typeof object.localAsyncId !== "object")
                    throw TypeError(".v1.PSpanChunk.localAsyncId: object expected");
                message.localAsyncId = $root.v1.PLocalAsyncId.fromObject(object.localAsyncId);
            }
            return message;
        };

        /**
         * Creates a plain object from a PSpanChunk message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PSpanChunk
         * @static
         * @param {v1.PSpanChunk} message PSpanChunk
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PSpanChunk.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.spanEvent = [];
            if (options.defaults) {
                object.version = 0;
                object.transactionId = null;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.spanId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.spanId = options.longs === String ? "0" : 0;
                object.endPoint = "";
                object.applicationServiceType = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.keyTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.keyTime = options.longs === String ? "0" : 0;
                object.localAsyncId = null;
            }
            if (message.version != null && message.hasOwnProperty("version"))
                object.version = message.version;
            if (message.transactionId != null && message.hasOwnProperty("transactionId"))
                object.transactionId = $root.v1.PTransactionId.toObject(message.transactionId, options);
            if (message.spanId != null && message.hasOwnProperty("spanId"))
                if (typeof message.spanId === "number")
                    object.spanId = options.longs === String ? String(message.spanId) : message.spanId;
                else
                    object.spanId = options.longs === String ? $util.Long.prototype.toString.call(message.spanId) : options.longs === Number ? new $util.LongBits(message.spanId.low >>> 0, message.spanId.high >>> 0).toNumber() : message.spanId;
            if (message.endPoint != null && message.hasOwnProperty("endPoint"))
                object.endPoint = message.endPoint;
            if (message.spanEvent && message.spanEvent.length) {
                object.spanEvent = [];
                for (var j = 0; j < message.spanEvent.length; ++j)
                    object.spanEvent[j] = $root.v1.PSpanEvent.toObject(message.spanEvent[j], options);
            }
            if (message.applicationServiceType != null && message.hasOwnProperty("applicationServiceType"))
                object.applicationServiceType = message.applicationServiceType;
            if (message.keyTime != null && message.hasOwnProperty("keyTime"))
                if (typeof message.keyTime === "number")
                    object.keyTime = options.longs === String ? String(message.keyTime) : message.keyTime;
                else
                    object.keyTime = options.longs === String ? $util.Long.prototype.toString.call(message.keyTime) : options.longs === Number ? new $util.LongBits(message.keyTime.low >>> 0, message.keyTime.high >>> 0).toNumber() : message.keyTime;
            if (message.localAsyncId != null && message.hasOwnProperty("localAsyncId"))
                object.localAsyncId = $root.v1.PLocalAsyncId.toObject(message.localAsyncId, options);
            return object;
        };

        /**
         * Converts this PSpanChunk to JSON.
         * @function toJSON
         * @memberof v1.PSpanChunk
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PSpanChunk.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PSpanChunk;
    })();

    v1.PResult = (function() {

        /**
         * Properties of a PResult.
         * @memberof v1
         * @interface IPResult
         * @property {boolean|null} [success] PResult success
         * @property {string|null} [message] PResult message
         */

        /**
         * Constructs a new PResult.
         * @memberof v1
         * @classdesc Represents a PResult.
         * @implements IPResult
         * @constructor
         * @param {v1.IPResult=} [properties] Properties to set
         */
        function PResult(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PResult success.
         * @member {boolean} success
         * @memberof v1.PResult
         * @instance
         */
        PResult.prototype.success = false;

        /**
         * PResult message.
         * @member {string} message
         * @memberof v1.PResult
         * @instance
         */
        PResult.prototype.message = "";

        /**
         * Creates a new PResult instance using the specified properties.
         * @function create
         * @memberof v1.PResult
         * @static
         * @param {v1.IPResult=} [properties] Properties to set
         * @returns {v1.PResult} PResult instance
         */
        PResult.create = function create(properties) {
            return new PResult(properties);
        };

        /**
         * Encodes the specified PResult message. Does not implicitly {@link v1.PResult.verify|verify} messages.
         * @function encode
         * @memberof v1.PResult
         * @static
         * @param {v1.IPResult} message PResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PResult.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && message.hasOwnProperty("success"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
            if (message.message != null && message.hasOwnProperty("message"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.message);
            return writer;
        };

        /**
         * Encodes the specified PResult message, length delimited. Does not implicitly {@link v1.PResult.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PResult
         * @static
         * @param {v1.IPResult} message PResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PResult.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PResult message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PResult} PResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PResult.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PResult();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.success = reader.bool();
                    break;
                case 2:
                    message.message = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PResult message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PResult} PResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PResult.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PResult message.
         * @function verify
         * @memberof v1.PResult
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PResult.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.success != null && message.hasOwnProperty("success"))
                if (typeof message.success !== "boolean")
                    return "success: boolean expected";
            if (message.message != null && message.hasOwnProperty("message"))
                if (!$util.isString(message.message))
                    return "message: string expected";
            return null;
        };

        /**
         * Creates a PResult message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PResult
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PResult} PResult
         */
        PResult.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PResult)
                return object;
            var message = new $root.v1.PResult();
            if (object.success != null)
                message.success = Boolean(object.success);
            if (object.message != null)
                message.message = String(object.message);
            return message;
        };

        /**
         * Creates a plain object from a PResult message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PResult
         * @static
         * @param {v1.PResult} message PResult
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PResult.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.success = false;
                object.message = "";
            }
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = message.success;
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = message.message;
            return object;
        };

        /**
         * Converts this PResult to JSON.
         * @function toJSON
         * @memberof v1.PResult
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PResult.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PResult;
    })();

    v1.PSqlMetaData = (function() {

        /**
         * Properties of a PSqlMetaData.
         * @memberof v1
         * @interface IPSqlMetaData
         * @property {number|null} [sqlId] PSqlMetaData sqlId
         * @property {string|null} [sql] PSqlMetaData sql
         */

        /**
         * Constructs a new PSqlMetaData.
         * @memberof v1
         * @classdesc Represents a PSqlMetaData.
         * @implements IPSqlMetaData
         * @constructor
         * @param {v1.IPSqlMetaData=} [properties] Properties to set
         */
        function PSqlMetaData(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PSqlMetaData sqlId.
         * @member {number} sqlId
         * @memberof v1.PSqlMetaData
         * @instance
         */
        PSqlMetaData.prototype.sqlId = 0;

        /**
         * PSqlMetaData sql.
         * @member {string} sql
         * @memberof v1.PSqlMetaData
         * @instance
         */
        PSqlMetaData.prototype.sql = "";

        /**
         * Creates a new PSqlMetaData instance using the specified properties.
         * @function create
         * @memberof v1.PSqlMetaData
         * @static
         * @param {v1.IPSqlMetaData=} [properties] Properties to set
         * @returns {v1.PSqlMetaData} PSqlMetaData instance
         */
        PSqlMetaData.create = function create(properties) {
            return new PSqlMetaData(properties);
        };

        /**
         * Encodes the specified PSqlMetaData message. Does not implicitly {@link v1.PSqlMetaData.verify|verify} messages.
         * @function encode
         * @memberof v1.PSqlMetaData
         * @static
         * @param {v1.IPSqlMetaData} message PSqlMetaData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PSqlMetaData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.sqlId != null && message.hasOwnProperty("sqlId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.sqlId);
            if (message.sql != null && message.hasOwnProperty("sql"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.sql);
            return writer;
        };

        /**
         * Encodes the specified PSqlMetaData message, length delimited. Does not implicitly {@link v1.PSqlMetaData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PSqlMetaData
         * @static
         * @param {v1.IPSqlMetaData} message PSqlMetaData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PSqlMetaData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PSqlMetaData message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PSqlMetaData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PSqlMetaData} PSqlMetaData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PSqlMetaData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PSqlMetaData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.sqlId = reader.int32();
                    break;
                case 2:
                    message.sql = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PSqlMetaData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PSqlMetaData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PSqlMetaData} PSqlMetaData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PSqlMetaData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PSqlMetaData message.
         * @function verify
         * @memberof v1.PSqlMetaData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PSqlMetaData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.sqlId != null && message.hasOwnProperty("sqlId"))
                if (!$util.isInteger(message.sqlId))
                    return "sqlId: integer expected";
            if (message.sql != null && message.hasOwnProperty("sql"))
                if (!$util.isString(message.sql))
                    return "sql: string expected";
            return null;
        };

        /**
         * Creates a PSqlMetaData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PSqlMetaData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PSqlMetaData} PSqlMetaData
         */
        PSqlMetaData.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PSqlMetaData)
                return object;
            var message = new $root.v1.PSqlMetaData();
            if (object.sqlId != null)
                message.sqlId = object.sqlId | 0;
            if (object.sql != null)
                message.sql = String(object.sql);
            return message;
        };

        /**
         * Creates a plain object from a PSqlMetaData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PSqlMetaData
         * @static
         * @param {v1.PSqlMetaData} message PSqlMetaData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PSqlMetaData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.sqlId = 0;
                object.sql = "";
            }
            if (message.sqlId != null && message.hasOwnProperty("sqlId"))
                object.sqlId = message.sqlId;
            if (message.sql != null && message.hasOwnProperty("sql"))
                object.sql = message.sql;
            return object;
        };

        /**
         * Converts this PSqlMetaData to JSON.
         * @function toJSON
         * @memberof v1.PSqlMetaData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PSqlMetaData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PSqlMetaData;
    })();

    v1.PApiMetaData = (function() {

        /**
         * Properties of a PApiMetaData.
         * @memberof v1
         * @interface IPApiMetaData
         * @property {number|null} [apiId] PApiMetaData apiId
         * @property {string|null} [apiInfo] PApiMetaData apiInfo
         * @property {number|null} [line] PApiMetaData line
         * @property {number|null} [type] PApiMetaData type
         */

        /**
         * Constructs a new PApiMetaData.
         * @memberof v1
         * @classdesc Represents a PApiMetaData.
         * @implements IPApiMetaData
         * @constructor
         * @param {v1.IPApiMetaData=} [properties] Properties to set
         */
        function PApiMetaData(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PApiMetaData apiId.
         * @member {number} apiId
         * @memberof v1.PApiMetaData
         * @instance
         */
        PApiMetaData.prototype.apiId = 0;

        /**
         * PApiMetaData apiInfo.
         * @member {string} apiInfo
         * @memberof v1.PApiMetaData
         * @instance
         */
        PApiMetaData.prototype.apiInfo = "";

        /**
         * PApiMetaData line.
         * @member {number} line
         * @memberof v1.PApiMetaData
         * @instance
         */
        PApiMetaData.prototype.line = 0;

        /**
         * PApiMetaData type.
         * @member {number} type
         * @memberof v1.PApiMetaData
         * @instance
         */
        PApiMetaData.prototype.type = 0;

        /**
         * Creates a new PApiMetaData instance using the specified properties.
         * @function create
         * @memberof v1.PApiMetaData
         * @static
         * @param {v1.IPApiMetaData=} [properties] Properties to set
         * @returns {v1.PApiMetaData} PApiMetaData instance
         */
        PApiMetaData.create = function create(properties) {
            return new PApiMetaData(properties);
        };

        /**
         * Encodes the specified PApiMetaData message. Does not implicitly {@link v1.PApiMetaData.verify|verify} messages.
         * @function encode
         * @memberof v1.PApiMetaData
         * @static
         * @param {v1.IPApiMetaData} message PApiMetaData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PApiMetaData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.apiId != null && message.hasOwnProperty("apiId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.apiId);
            if (message.apiInfo != null && message.hasOwnProperty("apiInfo"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.apiInfo);
            if (message.line != null && message.hasOwnProperty("line"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.line);
            if (message.type != null && message.hasOwnProperty("type"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.type);
            return writer;
        };

        /**
         * Encodes the specified PApiMetaData message, length delimited. Does not implicitly {@link v1.PApiMetaData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PApiMetaData
         * @static
         * @param {v1.IPApiMetaData} message PApiMetaData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PApiMetaData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PApiMetaData message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PApiMetaData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PApiMetaData} PApiMetaData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PApiMetaData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PApiMetaData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.apiId = reader.int32();
                    break;
                case 2:
                    message.apiInfo = reader.string();
                    break;
                case 3:
                    message.line = reader.int32();
                    break;
                case 4:
                    message.type = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PApiMetaData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PApiMetaData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PApiMetaData} PApiMetaData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PApiMetaData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PApiMetaData message.
         * @function verify
         * @memberof v1.PApiMetaData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PApiMetaData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.apiId != null && message.hasOwnProperty("apiId"))
                if (!$util.isInteger(message.apiId))
                    return "apiId: integer expected";
            if (message.apiInfo != null && message.hasOwnProperty("apiInfo"))
                if (!$util.isString(message.apiInfo))
                    return "apiInfo: string expected";
            if (message.line != null && message.hasOwnProperty("line"))
                if (!$util.isInteger(message.line))
                    return "line: integer expected";
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isInteger(message.type))
                    return "type: integer expected";
            return null;
        };

        /**
         * Creates a PApiMetaData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PApiMetaData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PApiMetaData} PApiMetaData
         */
        PApiMetaData.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PApiMetaData)
                return object;
            var message = new $root.v1.PApiMetaData();
            if (object.apiId != null)
                message.apiId = object.apiId | 0;
            if (object.apiInfo != null)
                message.apiInfo = String(object.apiInfo);
            if (object.line != null)
                message.line = object.line | 0;
            if (object.type != null)
                message.type = object.type | 0;
            return message;
        };

        /**
         * Creates a plain object from a PApiMetaData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PApiMetaData
         * @static
         * @param {v1.PApiMetaData} message PApiMetaData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PApiMetaData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.apiId = 0;
                object.apiInfo = "";
                object.line = 0;
                object.type = 0;
            }
            if (message.apiId != null && message.hasOwnProperty("apiId"))
                object.apiId = message.apiId;
            if (message.apiInfo != null && message.hasOwnProperty("apiInfo"))
                object.apiInfo = message.apiInfo;
            if (message.line != null && message.hasOwnProperty("line"))
                object.line = message.line;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            return object;
        };

        /**
         * Converts this PApiMetaData to JSON.
         * @function toJSON
         * @memberof v1.PApiMetaData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PApiMetaData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PApiMetaData;
    })();

    v1.PStringMetaData = (function() {

        /**
         * Properties of a PStringMetaData.
         * @memberof v1
         * @interface IPStringMetaData
         * @property {number|null} [stringId] PStringMetaData stringId
         * @property {string|null} [stringValue] PStringMetaData stringValue
         */

        /**
         * Constructs a new PStringMetaData.
         * @memberof v1
         * @classdesc Represents a PStringMetaData.
         * @implements IPStringMetaData
         * @constructor
         * @param {v1.IPStringMetaData=} [properties] Properties to set
         */
        function PStringMetaData(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PStringMetaData stringId.
         * @member {number} stringId
         * @memberof v1.PStringMetaData
         * @instance
         */
        PStringMetaData.prototype.stringId = 0;

        /**
         * PStringMetaData stringValue.
         * @member {string} stringValue
         * @memberof v1.PStringMetaData
         * @instance
         */
        PStringMetaData.prototype.stringValue = "";

        /**
         * Creates a new PStringMetaData instance using the specified properties.
         * @function create
         * @memberof v1.PStringMetaData
         * @static
         * @param {v1.IPStringMetaData=} [properties] Properties to set
         * @returns {v1.PStringMetaData} PStringMetaData instance
         */
        PStringMetaData.create = function create(properties) {
            return new PStringMetaData(properties);
        };

        /**
         * Encodes the specified PStringMetaData message. Does not implicitly {@link v1.PStringMetaData.verify|verify} messages.
         * @function encode
         * @memberof v1.PStringMetaData
         * @static
         * @param {v1.IPStringMetaData} message PStringMetaData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PStringMetaData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.stringId != null && message.hasOwnProperty("stringId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.stringId);
            if (message.stringValue != null && message.hasOwnProperty("stringValue"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.stringValue);
            return writer;
        };

        /**
         * Encodes the specified PStringMetaData message, length delimited. Does not implicitly {@link v1.PStringMetaData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PStringMetaData
         * @static
         * @param {v1.IPStringMetaData} message PStringMetaData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PStringMetaData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PStringMetaData message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PStringMetaData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PStringMetaData} PStringMetaData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PStringMetaData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PStringMetaData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.stringId = reader.int32();
                    break;
                case 2:
                    message.stringValue = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PStringMetaData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PStringMetaData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PStringMetaData} PStringMetaData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PStringMetaData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PStringMetaData message.
         * @function verify
         * @memberof v1.PStringMetaData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PStringMetaData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.stringId != null && message.hasOwnProperty("stringId"))
                if (!$util.isInteger(message.stringId))
                    return "stringId: integer expected";
            if (message.stringValue != null && message.hasOwnProperty("stringValue"))
                if (!$util.isString(message.stringValue))
                    return "stringValue: string expected";
            return null;
        };

        /**
         * Creates a PStringMetaData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PStringMetaData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PStringMetaData} PStringMetaData
         */
        PStringMetaData.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PStringMetaData)
                return object;
            var message = new $root.v1.PStringMetaData();
            if (object.stringId != null)
                message.stringId = object.stringId | 0;
            if (object.stringValue != null)
                message.stringValue = String(object.stringValue);
            return message;
        };

        /**
         * Creates a plain object from a PStringMetaData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PStringMetaData
         * @static
         * @param {v1.PStringMetaData} message PStringMetaData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PStringMetaData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.stringId = 0;
                object.stringValue = "";
            }
            if (message.stringId != null && message.hasOwnProperty("stringId"))
                object.stringId = message.stringId;
            if (message.stringValue != null && message.hasOwnProperty("stringValue"))
                object.stringValue = message.stringValue;
            return object;
        };

        /**
         * Converts this PStringMetaData to JSON.
         * @function toJSON
         * @memberof v1.PStringMetaData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PStringMetaData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PStringMetaData;
    })();

    return v1;
})();

$root.PIntStringValue = (function() {

    /**
     * Properties of a PIntStringValue.
     * @exports IPIntStringValue
     * @interface IPIntStringValue
     * @property {number|null} [intValue] PIntStringValue intValue
     * @property {google.protobuf.IStringValue|null} [stringValue] PIntStringValue stringValue
     */

    /**
     * Constructs a new PIntStringValue.
     * @exports PIntStringValue
     * @classdesc Represents a PIntStringValue.
     * @implements IPIntStringValue
     * @constructor
     * @param {IPIntStringValue=} [properties] Properties to set
     */
    function PIntStringValue(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PIntStringValue intValue.
     * @member {number} intValue
     * @memberof PIntStringValue
     * @instance
     */
    PIntStringValue.prototype.intValue = 0;

    /**
     * PIntStringValue stringValue.
     * @member {google.protobuf.IStringValue|null|undefined} stringValue
     * @memberof PIntStringValue
     * @instance
     */
    PIntStringValue.prototype.stringValue = null;

    /**
     * Creates a new PIntStringValue instance using the specified properties.
     * @function create
     * @memberof PIntStringValue
     * @static
     * @param {IPIntStringValue=} [properties] Properties to set
     * @returns {PIntStringValue} PIntStringValue instance
     */
    PIntStringValue.create = function create(properties) {
        return new PIntStringValue(properties);
    };

    /**
     * Encodes the specified PIntStringValue message. Does not implicitly {@link PIntStringValue.verify|verify} messages.
     * @function encode
     * @memberof PIntStringValue
     * @static
     * @param {IPIntStringValue} message PIntStringValue message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PIntStringValue.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.intValue != null && message.hasOwnProperty("intValue"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.intValue);
        if (message.stringValue != null && message.hasOwnProperty("stringValue"))
            $root.google.protobuf.StringValue.encode(message.stringValue, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified PIntStringValue message, length delimited. Does not implicitly {@link PIntStringValue.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PIntStringValue
     * @static
     * @param {IPIntStringValue} message PIntStringValue message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PIntStringValue.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PIntStringValue message from the specified reader or buffer.
     * @function decode
     * @memberof PIntStringValue
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PIntStringValue} PIntStringValue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PIntStringValue.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PIntStringValue();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.intValue = reader.int32();
                break;
            case 2:
                message.stringValue = $root.google.protobuf.StringValue.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PIntStringValue message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PIntStringValue
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PIntStringValue} PIntStringValue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PIntStringValue.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PIntStringValue message.
     * @function verify
     * @memberof PIntStringValue
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PIntStringValue.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.intValue != null && message.hasOwnProperty("intValue"))
            if (!$util.isInteger(message.intValue))
                return "intValue: integer expected";
        if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
            var error = $root.google.protobuf.StringValue.verify(message.stringValue);
            if (error)
                return "stringValue." + error;
        }
        return null;
    };

    /**
     * Creates a PIntStringValue message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PIntStringValue
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PIntStringValue} PIntStringValue
     */
    PIntStringValue.fromObject = function fromObject(object) {
        if (object instanceof $root.PIntStringValue)
            return object;
        var message = new $root.PIntStringValue();
        if (object.intValue != null)
            message.intValue = object.intValue | 0;
        if (object.stringValue != null) {
            if (typeof object.stringValue !== "object")
                throw TypeError(".PIntStringValue.stringValue: object expected");
            message.stringValue = $root.google.protobuf.StringValue.fromObject(object.stringValue);
        }
        return message;
    };

    /**
     * Creates a plain object from a PIntStringValue message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PIntStringValue
     * @static
     * @param {PIntStringValue} message PIntStringValue
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PIntStringValue.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.intValue = 0;
            object.stringValue = null;
        }
        if (message.intValue != null && message.hasOwnProperty("intValue"))
            object.intValue = message.intValue;
        if (message.stringValue != null && message.hasOwnProperty("stringValue"))
            object.stringValue = $root.google.protobuf.StringValue.toObject(message.stringValue, options);
        return object;
    };

    /**
     * Converts this PIntStringValue to JSON.
     * @function toJSON
     * @memberof PIntStringValue
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PIntStringValue.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PIntStringValue;
})();

$root.PIntStringStringValue = (function() {

    /**
     * Properties of a PIntStringStringValue.
     * @exports IPIntStringStringValue
     * @interface IPIntStringStringValue
     * @property {number|null} [intValue] PIntStringStringValue intValue
     * @property {google.protobuf.IStringValue|null} [stringValue1] PIntStringStringValue stringValue1
     * @property {google.protobuf.IStringValue|null} [stringValue2] PIntStringStringValue stringValue2
     */

    /**
     * Constructs a new PIntStringStringValue.
     * @exports PIntStringStringValue
     * @classdesc Represents a PIntStringStringValue.
     * @implements IPIntStringStringValue
     * @constructor
     * @param {IPIntStringStringValue=} [properties] Properties to set
     */
    function PIntStringStringValue(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PIntStringStringValue intValue.
     * @member {number} intValue
     * @memberof PIntStringStringValue
     * @instance
     */
    PIntStringStringValue.prototype.intValue = 0;

    /**
     * PIntStringStringValue stringValue1.
     * @member {google.protobuf.IStringValue|null|undefined} stringValue1
     * @memberof PIntStringStringValue
     * @instance
     */
    PIntStringStringValue.prototype.stringValue1 = null;

    /**
     * PIntStringStringValue stringValue2.
     * @member {google.protobuf.IStringValue|null|undefined} stringValue2
     * @memberof PIntStringStringValue
     * @instance
     */
    PIntStringStringValue.prototype.stringValue2 = null;

    /**
     * Creates a new PIntStringStringValue instance using the specified properties.
     * @function create
     * @memberof PIntStringStringValue
     * @static
     * @param {IPIntStringStringValue=} [properties] Properties to set
     * @returns {PIntStringStringValue} PIntStringStringValue instance
     */
    PIntStringStringValue.create = function create(properties) {
        return new PIntStringStringValue(properties);
    };

    /**
     * Encodes the specified PIntStringStringValue message. Does not implicitly {@link PIntStringStringValue.verify|verify} messages.
     * @function encode
     * @memberof PIntStringStringValue
     * @static
     * @param {IPIntStringStringValue} message PIntStringStringValue message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PIntStringStringValue.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.intValue != null && message.hasOwnProperty("intValue"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.intValue);
        if (message.stringValue1 != null && message.hasOwnProperty("stringValue1"))
            $root.google.protobuf.StringValue.encode(message.stringValue1, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.stringValue2 != null && message.hasOwnProperty("stringValue2"))
            $root.google.protobuf.StringValue.encode(message.stringValue2, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified PIntStringStringValue message, length delimited. Does not implicitly {@link PIntStringStringValue.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PIntStringStringValue
     * @static
     * @param {IPIntStringStringValue} message PIntStringStringValue message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PIntStringStringValue.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PIntStringStringValue message from the specified reader or buffer.
     * @function decode
     * @memberof PIntStringStringValue
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PIntStringStringValue} PIntStringStringValue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PIntStringStringValue.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PIntStringStringValue();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.intValue = reader.int32();
                break;
            case 2:
                message.stringValue1 = $root.google.protobuf.StringValue.decode(reader, reader.uint32());
                break;
            case 3:
                message.stringValue2 = $root.google.protobuf.StringValue.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PIntStringStringValue message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PIntStringStringValue
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PIntStringStringValue} PIntStringStringValue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PIntStringStringValue.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PIntStringStringValue message.
     * @function verify
     * @memberof PIntStringStringValue
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PIntStringStringValue.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.intValue != null && message.hasOwnProperty("intValue"))
            if (!$util.isInteger(message.intValue))
                return "intValue: integer expected";
        if (message.stringValue1 != null && message.hasOwnProperty("stringValue1")) {
            var error = $root.google.protobuf.StringValue.verify(message.stringValue1);
            if (error)
                return "stringValue1." + error;
        }
        if (message.stringValue2 != null && message.hasOwnProperty("stringValue2")) {
            var error = $root.google.protobuf.StringValue.verify(message.stringValue2);
            if (error)
                return "stringValue2." + error;
        }
        return null;
    };

    /**
     * Creates a PIntStringStringValue message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PIntStringStringValue
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PIntStringStringValue} PIntStringStringValue
     */
    PIntStringStringValue.fromObject = function fromObject(object) {
        if (object instanceof $root.PIntStringStringValue)
            return object;
        var message = new $root.PIntStringStringValue();
        if (object.intValue != null)
            message.intValue = object.intValue | 0;
        if (object.stringValue1 != null) {
            if (typeof object.stringValue1 !== "object")
                throw TypeError(".PIntStringStringValue.stringValue1: object expected");
            message.stringValue1 = $root.google.protobuf.StringValue.fromObject(object.stringValue1);
        }
        if (object.stringValue2 != null) {
            if (typeof object.stringValue2 !== "object")
                throw TypeError(".PIntStringStringValue.stringValue2: object expected");
            message.stringValue2 = $root.google.protobuf.StringValue.fromObject(object.stringValue2);
        }
        return message;
    };

    /**
     * Creates a plain object from a PIntStringStringValue message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PIntStringStringValue
     * @static
     * @param {PIntStringStringValue} message PIntStringStringValue
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PIntStringStringValue.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.intValue = 0;
            object.stringValue1 = null;
            object.stringValue2 = null;
        }
        if (message.intValue != null && message.hasOwnProperty("intValue"))
            object.intValue = message.intValue;
        if (message.stringValue1 != null && message.hasOwnProperty("stringValue1"))
            object.stringValue1 = $root.google.protobuf.StringValue.toObject(message.stringValue1, options);
        if (message.stringValue2 != null && message.hasOwnProperty("stringValue2"))
            object.stringValue2 = $root.google.protobuf.StringValue.toObject(message.stringValue2, options);
        return object;
    };

    /**
     * Converts this PIntStringStringValue to JSON.
     * @function toJSON
     * @memberof PIntStringStringValue
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PIntStringStringValue.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PIntStringStringValue;
})();

$root.PLongIntIntByteByteStringValue = (function() {

    /**
     * Properties of a PLongIntIntByteByteStringValue.
     * @exports IPLongIntIntByteByteStringValue
     * @interface IPLongIntIntByteByteStringValue
     * @property {number|Long|null} [longValue] PLongIntIntByteByteStringValue longValue
     * @property {number|null} [intValue1] PLongIntIntByteByteStringValue intValue1
     * @property {number|null} [intValue2] PLongIntIntByteByteStringValue intValue2
     * @property {number|null} [byteValue1] PLongIntIntByteByteStringValue byteValue1
     * @property {number|null} [byteValue2] PLongIntIntByteByteStringValue byteValue2
     * @property {google.protobuf.IStringValue|null} [stringValue] PLongIntIntByteByteStringValue stringValue
     */

    /**
     * Constructs a new PLongIntIntByteByteStringValue.
     * @exports PLongIntIntByteByteStringValue
     * @classdesc Represents a PLongIntIntByteByteStringValue.
     * @implements IPLongIntIntByteByteStringValue
     * @constructor
     * @param {IPLongIntIntByteByteStringValue=} [properties] Properties to set
     */
    function PLongIntIntByteByteStringValue(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PLongIntIntByteByteStringValue longValue.
     * @member {number|Long} longValue
     * @memberof PLongIntIntByteByteStringValue
     * @instance
     */
    PLongIntIntByteByteStringValue.prototype.longValue = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * PLongIntIntByteByteStringValue intValue1.
     * @member {number} intValue1
     * @memberof PLongIntIntByteByteStringValue
     * @instance
     */
    PLongIntIntByteByteStringValue.prototype.intValue1 = 0;

    /**
     * PLongIntIntByteByteStringValue intValue2.
     * @member {number} intValue2
     * @memberof PLongIntIntByteByteStringValue
     * @instance
     */
    PLongIntIntByteByteStringValue.prototype.intValue2 = 0;

    /**
     * PLongIntIntByteByteStringValue byteValue1.
     * @member {number} byteValue1
     * @memberof PLongIntIntByteByteStringValue
     * @instance
     */
    PLongIntIntByteByteStringValue.prototype.byteValue1 = 0;

    /**
     * PLongIntIntByteByteStringValue byteValue2.
     * @member {number} byteValue2
     * @memberof PLongIntIntByteByteStringValue
     * @instance
     */
    PLongIntIntByteByteStringValue.prototype.byteValue2 = 0;

    /**
     * PLongIntIntByteByteStringValue stringValue.
     * @member {google.protobuf.IStringValue|null|undefined} stringValue
     * @memberof PLongIntIntByteByteStringValue
     * @instance
     */
    PLongIntIntByteByteStringValue.prototype.stringValue = null;

    /**
     * Creates a new PLongIntIntByteByteStringValue instance using the specified properties.
     * @function create
     * @memberof PLongIntIntByteByteStringValue
     * @static
     * @param {IPLongIntIntByteByteStringValue=} [properties] Properties to set
     * @returns {PLongIntIntByteByteStringValue} PLongIntIntByteByteStringValue instance
     */
    PLongIntIntByteByteStringValue.create = function create(properties) {
        return new PLongIntIntByteByteStringValue(properties);
    };

    /**
     * Encodes the specified PLongIntIntByteByteStringValue message. Does not implicitly {@link PLongIntIntByteByteStringValue.verify|verify} messages.
     * @function encode
     * @memberof PLongIntIntByteByteStringValue
     * @static
     * @param {IPLongIntIntByteByteStringValue} message PLongIntIntByteByteStringValue message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PLongIntIntByteByteStringValue.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.longValue != null && message.hasOwnProperty("longValue"))
            writer.uint32(/* id 1, wireType 0 =*/8).int64(message.longValue);
        if (message.intValue1 != null && message.hasOwnProperty("intValue1"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.intValue1);
        if (message.intValue2 != null && message.hasOwnProperty("intValue2"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.intValue2);
        if (message.byteValue1 != null && message.hasOwnProperty("byteValue1"))
            writer.uint32(/* id 4, wireType 0 =*/32).sint32(message.byteValue1);
        if (message.byteValue2 != null && message.hasOwnProperty("byteValue2"))
            writer.uint32(/* id 5, wireType 0 =*/40).sint32(message.byteValue2);
        if (message.stringValue != null && message.hasOwnProperty("stringValue"))
            $root.google.protobuf.StringValue.encode(message.stringValue, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified PLongIntIntByteByteStringValue message, length delimited. Does not implicitly {@link PLongIntIntByteByteStringValue.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PLongIntIntByteByteStringValue
     * @static
     * @param {IPLongIntIntByteByteStringValue} message PLongIntIntByteByteStringValue message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PLongIntIntByteByteStringValue.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PLongIntIntByteByteStringValue message from the specified reader or buffer.
     * @function decode
     * @memberof PLongIntIntByteByteStringValue
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PLongIntIntByteByteStringValue} PLongIntIntByteByteStringValue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PLongIntIntByteByteStringValue.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PLongIntIntByteByteStringValue();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.longValue = reader.int64();
                break;
            case 2:
                message.intValue1 = reader.int32();
                break;
            case 3:
                message.intValue2 = reader.int32();
                break;
            case 4:
                message.byteValue1 = reader.sint32();
                break;
            case 5:
                message.byteValue2 = reader.sint32();
                break;
            case 6:
                message.stringValue = $root.google.protobuf.StringValue.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PLongIntIntByteByteStringValue message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PLongIntIntByteByteStringValue
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PLongIntIntByteByteStringValue} PLongIntIntByteByteStringValue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PLongIntIntByteByteStringValue.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PLongIntIntByteByteStringValue message.
     * @function verify
     * @memberof PLongIntIntByteByteStringValue
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PLongIntIntByteByteStringValue.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.longValue != null && message.hasOwnProperty("longValue"))
            if (!$util.isInteger(message.longValue) && !(message.longValue && $util.isInteger(message.longValue.low) && $util.isInteger(message.longValue.high)))
                return "longValue: integer|Long expected";
        if (message.intValue1 != null && message.hasOwnProperty("intValue1"))
            if (!$util.isInteger(message.intValue1))
                return "intValue1: integer expected";
        if (message.intValue2 != null && message.hasOwnProperty("intValue2"))
            if (!$util.isInteger(message.intValue2))
                return "intValue2: integer expected";
        if (message.byteValue1 != null && message.hasOwnProperty("byteValue1"))
            if (!$util.isInteger(message.byteValue1))
                return "byteValue1: integer expected";
        if (message.byteValue2 != null && message.hasOwnProperty("byteValue2"))
            if (!$util.isInteger(message.byteValue2))
                return "byteValue2: integer expected";
        if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
            var error = $root.google.protobuf.StringValue.verify(message.stringValue);
            if (error)
                return "stringValue." + error;
        }
        return null;
    };

    /**
     * Creates a PLongIntIntByteByteStringValue message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PLongIntIntByteByteStringValue
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PLongIntIntByteByteStringValue} PLongIntIntByteByteStringValue
     */
    PLongIntIntByteByteStringValue.fromObject = function fromObject(object) {
        if (object instanceof $root.PLongIntIntByteByteStringValue)
            return object;
        var message = new $root.PLongIntIntByteByteStringValue();
        if (object.longValue != null)
            if ($util.Long)
                (message.longValue = $util.Long.fromValue(object.longValue)).unsigned = false;
            else if (typeof object.longValue === "string")
                message.longValue = parseInt(object.longValue, 10);
            else if (typeof object.longValue === "number")
                message.longValue = object.longValue;
            else if (typeof object.longValue === "object")
                message.longValue = new $util.LongBits(object.longValue.low >>> 0, object.longValue.high >>> 0).toNumber();
        if (object.intValue1 != null)
            message.intValue1 = object.intValue1 | 0;
        if (object.intValue2 != null)
            message.intValue2 = object.intValue2 | 0;
        if (object.byteValue1 != null)
            message.byteValue1 = object.byteValue1 | 0;
        if (object.byteValue2 != null)
            message.byteValue2 = object.byteValue2 | 0;
        if (object.stringValue != null) {
            if (typeof object.stringValue !== "object")
                throw TypeError(".PLongIntIntByteByteStringValue.stringValue: object expected");
            message.stringValue = $root.google.protobuf.StringValue.fromObject(object.stringValue);
        }
        return message;
    };

    /**
     * Creates a plain object from a PLongIntIntByteByteStringValue message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PLongIntIntByteByteStringValue
     * @static
     * @param {PLongIntIntByteByteStringValue} message PLongIntIntByteByteStringValue
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PLongIntIntByteByteStringValue.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.longValue = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.longValue = options.longs === String ? "0" : 0;
            object.intValue1 = 0;
            object.intValue2 = 0;
            object.byteValue1 = 0;
            object.byteValue2 = 0;
            object.stringValue = null;
        }
        if (message.longValue != null && message.hasOwnProperty("longValue"))
            if (typeof message.longValue === "number")
                object.longValue = options.longs === String ? String(message.longValue) : message.longValue;
            else
                object.longValue = options.longs === String ? $util.Long.prototype.toString.call(message.longValue) : options.longs === Number ? new $util.LongBits(message.longValue.low >>> 0, message.longValue.high >>> 0).toNumber() : message.longValue;
        if (message.intValue1 != null && message.hasOwnProperty("intValue1"))
            object.intValue1 = message.intValue1;
        if (message.intValue2 != null && message.hasOwnProperty("intValue2"))
            object.intValue2 = message.intValue2;
        if (message.byteValue1 != null && message.hasOwnProperty("byteValue1"))
            object.byteValue1 = message.byteValue1;
        if (message.byteValue2 != null && message.hasOwnProperty("byteValue2"))
            object.byteValue2 = message.byteValue2;
        if (message.stringValue != null && message.hasOwnProperty("stringValue"))
            object.stringValue = $root.google.protobuf.StringValue.toObject(message.stringValue, options);
        return object;
    };

    /**
     * Converts this PLongIntIntByteByteStringValue to JSON.
     * @function toJSON
     * @memberof PLongIntIntByteByteStringValue
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PLongIntIntByteByteStringValue.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PLongIntIntByteByteStringValue;
})();

$root.PIntBooleanIntBooleanValue = (function() {

    /**
     * Properties of a PIntBooleanIntBooleanValue.
     * @exports IPIntBooleanIntBooleanValue
     * @interface IPIntBooleanIntBooleanValue
     * @property {number|null} [intValue1] PIntBooleanIntBooleanValue intValue1
     * @property {boolean|null} [boolValue1] PIntBooleanIntBooleanValue boolValue1
     * @property {number|null} [intValue2] PIntBooleanIntBooleanValue intValue2
     * @property {boolean|null} [boolValue2] PIntBooleanIntBooleanValue boolValue2
     */

    /**
     * Constructs a new PIntBooleanIntBooleanValue.
     * @exports PIntBooleanIntBooleanValue
     * @classdesc Represents a PIntBooleanIntBooleanValue.
     * @implements IPIntBooleanIntBooleanValue
     * @constructor
     * @param {IPIntBooleanIntBooleanValue=} [properties] Properties to set
     */
    function PIntBooleanIntBooleanValue(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PIntBooleanIntBooleanValue intValue1.
     * @member {number} intValue1
     * @memberof PIntBooleanIntBooleanValue
     * @instance
     */
    PIntBooleanIntBooleanValue.prototype.intValue1 = 0;

    /**
     * PIntBooleanIntBooleanValue boolValue1.
     * @member {boolean} boolValue1
     * @memberof PIntBooleanIntBooleanValue
     * @instance
     */
    PIntBooleanIntBooleanValue.prototype.boolValue1 = false;

    /**
     * PIntBooleanIntBooleanValue intValue2.
     * @member {number} intValue2
     * @memberof PIntBooleanIntBooleanValue
     * @instance
     */
    PIntBooleanIntBooleanValue.prototype.intValue2 = 0;

    /**
     * PIntBooleanIntBooleanValue boolValue2.
     * @member {boolean} boolValue2
     * @memberof PIntBooleanIntBooleanValue
     * @instance
     */
    PIntBooleanIntBooleanValue.prototype.boolValue2 = false;

    /**
     * Creates a new PIntBooleanIntBooleanValue instance using the specified properties.
     * @function create
     * @memberof PIntBooleanIntBooleanValue
     * @static
     * @param {IPIntBooleanIntBooleanValue=} [properties] Properties to set
     * @returns {PIntBooleanIntBooleanValue} PIntBooleanIntBooleanValue instance
     */
    PIntBooleanIntBooleanValue.create = function create(properties) {
        return new PIntBooleanIntBooleanValue(properties);
    };

    /**
     * Encodes the specified PIntBooleanIntBooleanValue message. Does not implicitly {@link PIntBooleanIntBooleanValue.verify|verify} messages.
     * @function encode
     * @memberof PIntBooleanIntBooleanValue
     * @static
     * @param {IPIntBooleanIntBooleanValue} message PIntBooleanIntBooleanValue message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PIntBooleanIntBooleanValue.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.intValue1 != null && message.hasOwnProperty("intValue1"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.intValue1);
        if (message.boolValue1 != null && message.hasOwnProperty("boolValue1"))
            writer.uint32(/* id 2, wireType 0 =*/16).bool(message.boolValue1);
        if (message.intValue2 != null && message.hasOwnProperty("intValue2"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.intValue2);
        if (message.boolValue2 != null && message.hasOwnProperty("boolValue2"))
            writer.uint32(/* id 4, wireType 0 =*/32).bool(message.boolValue2);
        return writer;
    };

    /**
     * Encodes the specified PIntBooleanIntBooleanValue message, length delimited. Does not implicitly {@link PIntBooleanIntBooleanValue.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PIntBooleanIntBooleanValue
     * @static
     * @param {IPIntBooleanIntBooleanValue} message PIntBooleanIntBooleanValue message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PIntBooleanIntBooleanValue.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PIntBooleanIntBooleanValue message from the specified reader or buffer.
     * @function decode
     * @memberof PIntBooleanIntBooleanValue
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PIntBooleanIntBooleanValue} PIntBooleanIntBooleanValue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PIntBooleanIntBooleanValue.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PIntBooleanIntBooleanValue();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.intValue1 = reader.int32();
                break;
            case 2:
                message.boolValue1 = reader.bool();
                break;
            case 3:
                message.intValue2 = reader.int32();
                break;
            case 4:
                message.boolValue2 = reader.bool();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PIntBooleanIntBooleanValue message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PIntBooleanIntBooleanValue
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PIntBooleanIntBooleanValue} PIntBooleanIntBooleanValue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PIntBooleanIntBooleanValue.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PIntBooleanIntBooleanValue message.
     * @function verify
     * @memberof PIntBooleanIntBooleanValue
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PIntBooleanIntBooleanValue.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.intValue1 != null && message.hasOwnProperty("intValue1"))
            if (!$util.isInteger(message.intValue1))
                return "intValue1: integer expected";
        if (message.boolValue1 != null && message.hasOwnProperty("boolValue1"))
            if (typeof message.boolValue1 !== "boolean")
                return "boolValue1: boolean expected";
        if (message.intValue2 != null && message.hasOwnProperty("intValue2"))
            if (!$util.isInteger(message.intValue2))
                return "intValue2: integer expected";
        if (message.boolValue2 != null && message.hasOwnProperty("boolValue2"))
            if (typeof message.boolValue2 !== "boolean")
                return "boolValue2: boolean expected";
        return null;
    };

    /**
     * Creates a PIntBooleanIntBooleanValue message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PIntBooleanIntBooleanValue
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PIntBooleanIntBooleanValue} PIntBooleanIntBooleanValue
     */
    PIntBooleanIntBooleanValue.fromObject = function fromObject(object) {
        if (object instanceof $root.PIntBooleanIntBooleanValue)
            return object;
        var message = new $root.PIntBooleanIntBooleanValue();
        if (object.intValue1 != null)
            message.intValue1 = object.intValue1 | 0;
        if (object.boolValue1 != null)
            message.boolValue1 = Boolean(object.boolValue1);
        if (object.intValue2 != null)
            message.intValue2 = object.intValue2 | 0;
        if (object.boolValue2 != null)
            message.boolValue2 = Boolean(object.boolValue2);
        return message;
    };

    /**
     * Creates a plain object from a PIntBooleanIntBooleanValue message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PIntBooleanIntBooleanValue
     * @static
     * @param {PIntBooleanIntBooleanValue} message PIntBooleanIntBooleanValue
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PIntBooleanIntBooleanValue.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.intValue1 = 0;
            object.boolValue1 = false;
            object.intValue2 = 0;
            object.boolValue2 = false;
        }
        if (message.intValue1 != null && message.hasOwnProperty("intValue1"))
            object.intValue1 = message.intValue1;
        if (message.boolValue1 != null && message.hasOwnProperty("boolValue1"))
            object.boolValue1 = message.boolValue1;
        if (message.intValue2 != null && message.hasOwnProperty("intValue2"))
            object.intValue2 = message.intValue2;
        if (message.boolValue2 != null && message.hasOwnProperty("boolValue2"))
            object.boolValue2 = message.boolValue2;
        return object;
    };

    /**
     * Converts this PIntBooleanIntBooleanValue to JSON.
     * @function toJSON
     * @memberof PIntBooleanIntBooleanValue
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PIntBooleanIntBooleanValue.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PIntBooleanIntBooleanValue;
})();

$root.PStringStringValue = (function() {

    /**
     * Properties of a PStringStringValue.
     * @exports IPStringStringValue
     * @interface IPStringStringValue
     * @property {google.protobuf.IStringValue|null} [stringValue1] PStringStringValue stringValue1
     * @property {google.protobuf.IStringValue|null} [stringValue2] PStringStringValue stringValue2
     */

    /**
     * Constructs a new PStringStringValue.
     * @exports PStringStringValue
     * @classdesc Represents a PStringStringValue.
     * @implements IPStringStringValue
     * @constructor
     * @param {IPStringStringValue=} [properties] Properties to set
     */
    function PStringStringValue(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PStringStringValue stringValue1.
     * @member {google.protobuf.IStringValue|null|undefined} stringValue1
     * @memberof PStringStringValue
     * @instance
     */
    PStringStringValue.prototype.stringValue1 = null;

    /**
     * PStringStringValue stringValue2.
     * @member {google.protobuf.IStringValue|null|undefined} stringValue2
     * @memberof PStringStringValue
     * @instance
     */
    PStringStringValue.prototype.stringValue2 = null;

    /**
     * Creates a new PStringStringValue instance using the specified properties.
     * @function create
     * @memberof PStringStringValue
     * @static
     * @param {IPStringStringValue=} [properties] Properties to set
     * @returns {PStringStringValue} PStringStringValue instance
     */
    PStringStringValue.create = function create(properties) {
        return new PStringStringValue(properties);
    };

    /**
     * Encodes the specified PStringStringValue message. Does not implicitly {@link PStringStringValue.verify|verify} messages.
     * @function encode
     * @memberof PStringStringValue
     * @static
     * @param {IPStringStringValue} message PStringStringValue message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PStringStringValue.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.stringValue1 != null && message.hasOwnProperty("stringValue1"))
            $root.google.protobuf.StringValue.encode(message.stringValue1, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.stringValue2 != null && message.hasOwnProperty("stringValue2"))
            $root.google.protobuf.StringValue.encode(message.stringValue2, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified PStringStringValue message, length delimited. Does not implicitly {@link PStringStringValue.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PStringStringValue
     * @static
     * @param {IPStringStringValue} message PStringStringValue message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PStringStringValue.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PStringStringValue message from the specified reader or buffer.
     * @function decode
     * @memberof PStringStringValue
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PStringStringValue} PStringStringValue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PStringStringValue.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PStringStringValue();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.stringValue1 = $root.google.protobuf.StringValue.decode(reader, reader.uint32());
                break;
            case 2:
                message.stringValue2 = $root.google.protobuf.StringValue.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PStringStringValue message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PStringStringValue
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PStringStringValue} PStringStringValue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PStringStringValue.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PStringStringValue message.
     * @function verify
     * @memberof PStringStringValue
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PStringStringValue.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.stringValue1 != null && message.hasOwnProperty("stringValue1")) {
            var error = $root.google.protobuf.StringValue.verify(message.stringValue1);
            if (error)
                return "stringValue1." + error;
        }
        if (message.stringValue2 != null && message.hasOwnProperty("stringValue2")) {
            var error = $root.google.protobuf.StringValue.verify(message.stringValue2);
            if (error)
                return "stringValue2." + error;
        }
        return null;
    };

    /**
     * Creates a PStringStringValue message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PStringStringValue
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PStringStringValue} PStringStringValue
     */
    PStringStringValue.fromObject = function fromObject(object) {
        if (object instanceof $root.PStringStringValue)
            return object;
        var message = new $root.PStringStringValue();
        if (object.stringValue1 != null) {
            if (typeof object.stringValue1 !== "object")
                throw TypeError(".PStringStringValue.stringValue1: object expected");
            message.stringValue1 = $root.google.protobuf.StringValue.fromObject(object.stringValue1);
        }
        if (object.stringValue2 != null) {
            if (typeof object.stringValue2 !== "object")
                throw TypeError(".PStringStringValue.stringValue2: object expected");
            message.stringValue2 = $root.google.protobuf.StringValue.fromObject(object.stringValue2);
        }
        return message;
    };

    /**
     * Creates a plain object from a PStringStringValue message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PStringStringValue
     * @static
     * @param {PStringStringValue} message PStringStringValue
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PStringStringValue.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.stringValue1 = null;
            object.stringValue2 = null;
        }
        if (message.stringValue1 != null && message.hasOwnProperty("stringValue1"))
            object.stringValue1 = $root.google.protobuf.StringValue.toObject(message.stringValue1, options);
        if (message.stringValue2 != null && message.hasOwnProperty("stringValue2"))
            object.stringValue2 = $root.google.protobuf.StringValue.toObject(message.stringValue2, options);
        return object;
    };

    /**
     * Converts this PStringStringValue to JSON.
     * @function toJSON
     * @memberof PStringStringValue
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PStringStringValue.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PStringStringValue;
})();

$root.PAnnotationValue = (function() {

    /**
     * Properties of a PAnnotationValue.
     * @exports IPAnnotationValue
     * @interface IPAnnotationValue
     * @property {string|null} [stringValue] PAnnotationValue stringValue
     * @property {boolean|null} [boolValue] PAnnotationValue boolValue
     * @property {number|null} [intValue] PAnnotationValue intValue
     * @property {number|Long|null} [longValue] PAnnotationValue longValue
     * @property {number|null} [shortValue] PAnnotationValue shortValue
     * @property {number|null} [doubleValue] PAnnotationValue doubleValue
     * @property {Uint8Array|null} [binaryValue] PAnnotationValue binaryValue
     * @property {number|null} [byteValue] PAnnotationValue byteValue
     * @property {IPIntStringValue|null} [intStringValue] PAnnotationValue intStringValue
     * @property {IPStringStringValue|null} [stringStringValue] PAnnotationValue stringStringValue
     * @property {IPIntStringStringValue|null} [intStringStringValue] PAnnotationValue intStringStringValue
     * @property {IPLongIntIntByteByteStringValue|null} [longIntIntByteByteStringValue] PAnnotationValue longIntIntByteByteStringValue
     * @property {IPIntBooleanIntBooleanValue|null} [intBooleanIntBooleanValue] PAnnotationValue intBooleanIntBooleanValue
     */

    /**
     * Constructs a new PAnnotationValue.
     * @exports PAnnotationValue
     * @classdesc Represents a PAnnotationValue.
     * @implements IPAnnotationValue
     * @constructor
     * @param {IPAnnotationValue=} [properties] Properties to set
     */
    function PAnnotationValue(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PAnnotationValue stringValue.
     * @member {string} stringValue
     * @memberof PAnnotationValue
     * @instance
     */
    PAnnotationValue.prototype.stringValue = "";

    /**
     * PAnnotationValue boolValue.
     * @member {boolean} boolValue
     * @memberof PAnnotationValue
     * @instance
     */
    PAnnotationValue.prototype.boolValue = false;

    /**
     * PAnnotationValue intValue.
     * @member {number} intValue
     * @memberof PAnnotationValue
     * @instance
     */
    PAnnotationValue.prototype.intValue = 0;

    /**
     * PAnnotationValue longValue.
     * @member {number|Long} longValue
     * @memberof PAnnotationValue
     * @instance
     */
    PAnnotationValue.prototype.longValue = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * PAnnotationValue shortValue.
     * @member {number} shortValue
     * @memberof PAnnotationValue
     * @instance
     */
    PAnnotationValue.prototype.shortValue = 0;

    /**
     * PAnnotationValue doubleValue.
     * @member {number} doubleValue
     * @memberof PAnnotationValue
     * @instance
     */
    PAnnotationValue.prototype.doubleValue = 0;

    /**
     * PAnnotationValue binaryValue.
     * @member {Uint8Array} binaryValue
     * @memberof PAnnotationValue
     * @instance
     */
    PAnnotationValue.prototype.binaryValue = $util.newBuffer([]);

    /**
     * PAnnotationValue byteValue.
     * @member {number} byteValue
     * @memberof PAnnotationValue
     * @instance
     */
    PAnnotationValue.prototype.byteValue = 0;

    /**
     * PAnnotationValue intStringValue.
     * @member {IPIntStringValue|null|undefined} intStringValue
     * @memberof PAnnotationValue
     * @instance
     */
    PAnnotationValue.prototype.intStringValue = null;

    /**
     * PAnnotationValue stringStringValue.
     * @member {IPStringStringValue|null|undefined} stringStringValue
     * @memberof PAnnotationValue
     * @instance
     */
    PAnnotationValue.prototype.stringStringValue = null;

    /**
     * PAnnotationValue intStringStringValue.
     * @member {IPIntStringStringValue|null|undefined} intStringStringValue
     * @memberof PAnnotationValue
     * @instance
     */
    PAnnotationValue.prototype.intStringStringValue = null;

    /**
     * PAnnotationValue longIntIntByteByteStringValue.
     * @member {IPLongIntIntByteByteStringValue|null|undefined} longIntIntByteByteStringValue
     * @memberof PAnnotationValue
     * @instance
     */
    PAnnotationValue.prototype.longIntIntByteByteStringValue = null;

    /**
     * PAnnotationValue intBooleanIntBooleanValue.
     * @member {IPIntBooleanIntBooleanValue|null|undefined} intBooleanIntBooleanValue
     * @memberof PAnnotationValue
     * @instance
     */
    PAnnotationValue.prototype.intBooleanIntBooleanValue = null;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * PAnnotationValue field.
     * @member {"stringValue"|"boolValue"|"intValue"|"longValue"|"shortValue"|"doubleValue"|"binaryValue"|"byteValue"|"intStringValue"|"stringStringValue"|"intStringStringValue"|"longIntIntByteByteStringValue"|"intBooleanIntBooleanValue"|undefined} field
     * @memberof PAnnotationValue
     * @instance
     */
    Object.defineProperty(PAnnotationValue.prototype, "field", {
        get: $util.oneOfGetter($oneOfFields = ["stringValue", "boolValue", "intValue", "longValue", "shortValue", "doubleValue", "binaryValue", "byteValue", "intStringValue", "stringStringValue", "intStringStringValue", "longIntIntByteByteStringValue", "intBooleanIntBooleanValue"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new PAnnotationValue instance using the specified properties.
     * @function create
     * @memberof PAnnotationValue
     * @static
     * @param {IPAnnotationValue=} [properties] Properties to set
     * @returns {PAnnotationValue} PAnnotationValue instance
     */
    PAnnotationValue.create = function create(properties) {
        return new PAnnotationValue(properties);
    };

    /**
     * Encodes the specified PAnnotationValue message. Does not implicitly {@link PAnnotationValue.verify|verify} messages.
     * @function encode
     * @memberof PAnnotationValue
     * @static
     * @param {IPAnnotationValue} message PAnnotationValue message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PAnnotationValue.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.stringValue != null && message.hasOwnProperty("stringValue"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.stringValue);
        if (message.boolValue != null && message.hasOwnProperty("boolValue"))
            writer.uint32(/* id 2, wireType 0 =*/16).bool(message.boolValue);
        if (message.intValue != null && message.hasOwnProperty("intValue"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.intValue);
        if (message.longValue != null && message.hasOwnProperty("longValue"))
            writer.uint32(/* id 4, wireType 0 =*/32).int64(message.longValue);
        if (message.shortValue != null && message.hasOwnProperty("shortValue"))
            writer.uint32(/* id 5, wireType 0 =*/40).sint32(message.shortValue);
        if (message.doubleValue != null && message.hasOwnProperty("doubleValue"))
            writer.uint32(/* id 6, wireType 1 =*/49).double(message.doubleValue);
        if (message.binaryValue != null && message.hasOwnProperty("binaryValue"))
            writer.uint32(/* id 7, wireType 2 =*/58).bytes(message.binaryValue);
        if (message.byteValue != null && message.hasOwnProperty("byteValue"))
            writer.uint32(/* id 8, wireType 0 =*/64).sint32(message.byteValue);
        if (message.intStringValue != null && message.hasOwnProperty("intStringValue"))
            $root.PIntStringValue.encode(message.intStringValue, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
        if (message.stringStringValue != null && message.hasOwnProperty("stringStringValue"))
            $root.PStringStringValue.encode(message.stringStringValue, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
        if (message.intStringStringValue != null && message.hasOwnProperty("intStringStringValue"))
            $root.PIntStringStringValue.encode(message.intStringStringValue, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
        if (message.longIntIntByteByteStringValue != null && message.hasOwnProperty("longIntIntByteByteStringValue"))
            $root.PLongIntIntByteByteStringValue.encode(message.longIntIntByteByteStringValue, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
        if (message.intBooleanIntBooleanValue != null && message.hasOwnProperty("intBooleanIntBooleanValue"))
            $root.PIntBooleanIntBooleanValue.encode(message.intBooleanIntBooleanValue, writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified PAnnotationValue message, length delimited. Does not implicitly {@link PAnnotationValue.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PAnnotationValue
     * @static
     * @param {IPAnnotationValue} message PAnnotationValue message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PAnnotationValue.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PAnnotationValue message from the specified reader or buffer.
     * @function decode
     * @memberof PAnnotationValue
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PAnnotationValue} PAnnotationValue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PAnnotationValue.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PAnnotationValue();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.stringValue = reader.string();
                break;
            case 2:
                message.boolValue = reader.bool();
                break;
            case 3:
                message.intValue = reader.int32();
                break;
            case 4:
                message.longValue = reader.int64();
                break;
            case 5:
                message.shortValue = reader.sint32();
                break;
            case 6:
                message.doubleValue = reader.double();
                break;
            case 7:
                message.binaryValue = reader.bytes();
                break;
            case 8:
                message.byteValue = reader.sint32();
                break;
            case 9:
                message.intStringValue = $root.PIntStringValue.decode(reader, reader.uint32());
                break;
            case 10:
                message.stringStringValue = $root.PStringStringValue.decode(reader, reader.uint32());
                break;
            case 11:
                message.intStringStringValue = $root.PIntStringStringValue.decode(reader, reader.uint32());
                break;
            case 12:
                message.longIntIntByteByteStringValue = $root.PLongIntIntByteByteStringValue.decode(reader, reader.uint32());
                break;
            case 13:
                message.intBooleanIntBooleanValue = $root.PIntBooleanIntBooleanValue.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PAnnotationValue message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PAnnotationValue
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PAnnotationValue} PAnnotationValue
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PAnnotationValue.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PAnnotationValue message.
     * @function verify
     * @memberof PAnnotationValue
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PAnnotationValue.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        var properties = {};
        if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
            properties.field = 1;
            if (!$util.isString(message.stringValue))
                return "stringValue: string expected";
        }
        if (message.boolValue != null && message.hasOwnProperty("boolValue")) {
            if (properties.field === 1)
                return "field: multiple values";
            properties.field = 1;
            if (typeof message.boolValue !== "boolean")
                return "boolValue: boolean expected";
        }
        if (message.intValue != null && message.hasOwnProperty("intValue")) {
            if (properties.field === 1)
                return "field: multiple values";
            properties.field = 1;
            if (!$util.isInteger(message.intValue))
                return "intValue: integer expected";
        }
        if (message.longValue != null && message.hasOwnProperty("longValue")) {
            if (properties.field === 1)
                return "field: multiple values";
            properties.field = 1;
            if (!$util.isInteger(message.longValue) && !(message.longValue && $util.isInteger(message.longValue.low) && $util.isInteger(message.longValue.high)))
                return "longValue: integer|Long expected";
        }
        if (message.shortValue != null && message.hasOwnProperty("shortValue")) {
            if (properties.field === 1)
                return "field: multiple values";
            properties.field = 1;
            if (!$util.isInteger(message.shortValue))
                return "shortValue: integer expected";
        }
        if (message.doubleValue != null && message.hasOwnProperty("doubleValue")) {
            if (properties.field === 1)
                return "field: multiple values";
            properties.field = 1;
            if (typeof message.doubleValue !== "number")
                return "doubleValue: number expected";
        }
        if (message.binaryValue != null && message.hasOwnProperty("binaryValue")) {
            if (properties.field === 1)
                return "field: multiple values";
            properties.field = 1;
            if (!(message.binaryValue && typeof message.binaryValue.length === "number" || $util.isString(message.binaryValue)))
                return "binaryValue: buffer expected";
        }
        if (message.byteValue != null && message.hasOwnProperty("byteValue")) {
            if (properties.field === 1)
                return "field: multiple values";
            properties.field = 1;
            if (!$util.isInteger(message.byteValue))
                return "byteValue: integer expected";
        }
        if (message.intStringValue != null && message.hasOwnProperty("intStringValue")) {
            if (properties.field === 1)
                return "field: multiple values";
            properties.field = 1;
            {
                var error = $root.PIntStringValue.verify(message.intStringValue);
                if (error)
                    return "intStringValue." + error;
            }
        }
        if (message.stringStringValue != null && message.hasOwnProperty("stringStringValue")) {
            if (properties.field === 1)
                return "field: multiple values";
            properties.field = 1;
            {
                var error = $root.PStringStringValue.verify(message.stringStringValue);
                if (error)
                    return "stringStringValue." + error;
            }
        }
        if (message.intStringStringValue != null && message.hasOwnProperty("intStringStringValue")) {
            if (properties.field === 1)
                return "field: multiple values";
            properties.field = 1;
            {
                var error = $root.PIntStringStringValue.verify(message.intStringStringValue);
                if (error)
                    return "intStringStringValue." + error;
            }
        }
        if (message.longIntIntByteByteStringValue != null && message.hasOwnProperty("longIntIntByteByteStringValue")) {
            if (properties.field === 1)
                return "field: multiple values";
            properties.field = 1;
            {
                var error = $root.PLongIntIntByteByteStringValue.verify(message.longIntIntByteByteStringValue);
                if (error)
                    return "longIntIntByteByteStringValue." + error;
            }
        }
        if (message.intBooleanIntBooleanValue != null && message.hasOwnProperty("intBooleanIntBooleanValue")) {
            if (properties.field === 1)
                return "field: multiple values";
            properties.field = 1;
            {
                var error = $root.PIntBooleanIntBooleanValue.verify(message.intBooleanIntBooleanValue);
                if (error)
                    return "intBooleanIntBooleanValue." + error;
            }
        }
        return null;
    };

    /**
     * Creates a PAnnotationValue message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PAnnotationValue
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PAnnotationValue} PAnnotationValue
     */
    PAnnotationValue.fromObject = function fromObject(object) {
        if (object instanceof $root.PAnnotationValue)
            return object;
        var message = new $root.PAnnotationValue();
        if (object.stringValue != null)
            message.stringValue = String(object.stringValue);
        if (object.boolValue != null)
            message.boolValue = Boolean(object.boolValue);
        if (object.intValue != null)
            message.intValue = object.intValue | 0;
        if (object.longValue != null)
            if ($util.Long)
                (message.longValue = $util.Long.fromValue(object.longValue)).unsigned = false;
            else if (typeof object.longValue === "string")
                message.longValue = parseInt(object.longValue, 10);
            else if (typeof object.longValue === "number")
                message.longValue = object.longValue;
            else if (typeof object.longValue === "object")
                message.longValue = new $util.LongBits(object.longValue.low >>> 0, object.longValue.high >>> 0).toNumber();
        if (object.shortValue != null)
            message.shortValue = object.shortValue | 0;
        if (object.doubleValue != null)
            message.doubleValue = Number(object.doubleValue);
        if (object.binaryValue != null)
            if (typeof object.binaryValue === "string")
                $util.base64.decode(object.binaryValue, message.binaryValue = $util.newBuffer($util.base64.length(object.binaryValue)), 0);
            else if (object.binaryValue.length)
                message.binaryValue = object.binaryValue;
        if (object.byteValue != null)
            message.byteValue = object.byteValue | 0;
        if (object.intStringValue != null) {
            if (typeof object.intStringValue !== "object")
                throw TypeError(".PAnnotationValue.intStringValue: object expected");
            message.intStringValue = $root.PIntStringValue.fromObject(object.intStringValue);
        }
        if (object.stringStringValue != null) {
            if (typeof object.stringStringValue !== "object")
                throw TypeError(".PAnnotationValue.stringStringValue: object expected");
            message.stringStringValue = $root.PStringStringValue.fromObject(object.stringStringValue);
        }
        if (object.intStringStringValue != null) {
            if (typeof object.intStringStringValue !== "object")
                throw TypeError(".PAnnotationValue.intStringStringValue: object expected");
            message.intStringStringValue = $root.PIntStringStringValue.fromObject(object.intStringStringValue);
        }
        if (object.longIntIntByteByteStringValue != null) {
            if (typeof object.longIntIntByteByteStringValue !== "object")
                throw TypeError(".PAnnotationValue.longIntIntByteByteStringValue: object expected");
            message.longIntIntByteByteStringValue = $root.PLongIntIntByteByteStringValue.fromObject(object.longIntIntByteByteStringValue);
        }
        if (object.intBooleanIntBooleanValue != null) {
            if (typeof object.intBooleanIntBooleanValue !== "object")
                throw TypeError(".PAnnotationValue.intBooleanIntBooleanValue: object expected");
            message.intBooleanIntBooleanValue = $root.PIntBooleanIntBooleanValue.fromObject(object.intBooleanIntBooleanValue);
        }
        return message;
    };

    /**
     * Creates a plain object from a PAnnotationValue message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PAnnotationValue
     * @static
     * @param {PAnnotationValue} message PAnnotationValue
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PAnnotationValue.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
            object.stringValue = message.stringValue;
            if (options.oneofs)
                object.field = "stringValue";
        }
        if (message.boolValue != null && message.hasOwnProperty("boolValue")) {
            object.boolValue = message.boolValue;
            if (options.oneofs)
                object.field = "boolValue";
        }
        if (message.intValue != null && message.hasOwnProperty("intValue")) {
            object.intValue = message.intValue;
            if (options.oneofs)
                object.field = "intValue";
        }
        if (message.longValue != null && message.hasOwnProperty("longValue")) {
            if (typeof message.longValue === "number")
                object.longValue = options.longs === String ? String(message.longValue) : message.longValue;
            else
                object.longValue = options.longs === String ? $util.Long.prototype.toString.call(message.longValue) : options.longs === Number ? new $util.LongBits(message.longValue.low >>> 0, message.longValue.high >>> 0).toNumber() : message.longValue;
            if (options.oneofs)
                object.field = "longValue";
        }
        if (message.shortValue != null && message.hasOwnProperty("shortValue")) {
            object.shortValue = message.shortValue;
            if (options.oneofs)
                object.field = "shortValue";
        }
        if (message.doubleValue != null && message.hasOwnProperty("doubleValue")) {
            object.doubleValue = options.json && !isFinite(message.doubleValue) ? String(message.doubleValue) : message.doubleValue;
            if (options.oneofs)
                object.field = "doubleValue";
        }
        if (message.binaryValue != null && message.hasOwnProperty("binaryValue")) {
            object.binaryValue = options.bytes === String ? $util.base64.encode(message.binaryValue, 0, message.binaryValue.length) : options.bytes === Array ? Array.prototype.slice.call(message.binaryValue) : message.binaryValue;
            if (options.oneofs)
                object.field = "binaryValue";
        }
        if (message.byteValue != null && message.hasOwnProperty("byteValue")) {
            object.byteValue = message.byteValue;
            if (options.oneofs)
                object.field = "byteValue";
        }
        if (message.intStringValue != null && message.hasOwnProperty("intStringValue")) {
            object.intStringValue = $root.PIntStringValue.toObject(message.intStringValue, options);
            if (options.oneofs)
                object.field = "intStringValue";
        }
        if (message.stringStringValue != null && message.hasOwnProperty("stringStringValue")) {
            object.stringStringValue = $root.PStringStringValue.toObject(message.stringStringValue, options);
            if (options.oneofs)
                object.field = "stringStringValue";
        }
        if (message.intStringStringValue != null && message.hasOwnProperty("intStringStringValue")) {
            object.intStringStringValue = $root.PIntStringStringValue.toObject(message.intStringStringValue, options);
            if (options.oneofs)
                object.field = "intStringStringValue";
        }
        if (message.longIntIntByteByteStringValue != null && message.hasOwnProperty("longIntIntByteByteStringValue")) {
            object.longIntIntByteByteStringValue = $root.PLongIntIntByteByteStringValue.toObject(message.longIntIntByteByteStringValue, options);
            if (options.oneofs)
                object.field = "longIntIntByteByteStringValue";
        }
        if (message.intBooleanIntBooleanValue != null && message.hasOwnProperty("intBooleanIntBooleanValue")) {
            object.intBooleanIntBooleanValue = $root.PIntBooleanIntBooleanValue.toObject(message.intBooleanIntBooleanValue, options);
            if (options.oneofs)
                object.field = "intBooleanIntBooleanValue";
        }
        return object;
    };

    /**
     * Converts this PAnnotationValue to JSON.
     * @function toJSON
     * @memberof PAnnotationValue
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PAnnotationValue.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PAnnotationValue;
})();

$root.PAnnotation = (function() {

    /**
     * Properties of a PAnnotation.
     * @exports IPAnnotation
     * @interface IPAnnotation
     * @property {number|null} [key] PAnnotation key
     * @property {IPAnnotationValue|null} [value] PAnnotation value
     */

    /**
     * Constructs a new PAnnotation.
     * @exports PAnnotation
     * @classdesc Represents a PAnnotation.
     * @implements IPAnnotation
     * @constructor
     * @param {IPAnnotation=} [properties] Properties to set
     */
    function PAnnotation(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PAnnotation key.
     * @member {number} key
     * @memberof PAnnotation
     * @instance
     */
    PAnnotation.prototype.key = 0;

    /**
     * PAnnotation value.
     * @member {IPAnnotationValue|null|undefined} value
     * @memberof PAnnotation
     * @instance
     */
    PAnnotation.prototype.value = null;

    /**
     * Creates a new PAnnotation instance using the specified properties.
     * @function create
     * @memberof PAnnotation
     * @static
     * @param {IPAnnotation=} [properties] Properties to set
     * @returns {PAnnotation} PAnnotation instance
     */
    PAnnotation.create = function create(properties) {
        return new PAnnotation(properties);
    };

    /**
     * Encodes the specified PAnnotation message. Does not implicitly {@link PAnnotation.verify|verify} messages.
     * @function encode
     * @memberof PAnnotation
     * @static
     * @param {IPAnnotation} message PAnnotation message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PAnnotation.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.key != null && message.hasOwnProperty("key"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.key);
        if (message.value != null && message.hasOwnProperty("value"))
            $root.PAnnotationValue.encode(message.value, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified PAnnotation message, length delimited. Does not implicitly {@link PAnnotation.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PAnnotation
     * @static
     * @param {IPAnnotation} message PAnnotation message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PAnnotation.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PAnnotation message from the specified reader or buffer.
     * @function decode
     * @memberof PAnnotation
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PAnnotation} PAnnotation
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PAnnotation.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PAnnotation();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.key = reader.int32();
                break;
            case 2:
                message.value = $root.PAnnotationValue.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PAnnotation message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PAnnotation
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PAnnotation} PAnnotation
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PAnnotation.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PAnnotation message.
     * @function verify
     * @memberof PAnnotation
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PAnnotation.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.key != null && message.hasOwnProperty("key"))
            if (!$util.isInteger(message.key))
                return "key: integer expected";
        if (message.value != null && message.hasOwnProperty("value")) {
            var error = $root.PAnnotationValue.verify(message.value);
            if (error)
                return "value." + error;
        }
        return null;
    };

    /**
     * Creates a PAnnotation message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PAnnotation
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PAnnotation} PAnnotation
     */
    PAnnotation.fromObject = function fromObject(object) {
        if (object instanceof $root.PAnnotation)
            return object;
        var message = new $root.PAnnotation();
        if (object.key != null)
            message.key = object.key | 0;
        if (object.value != null) {
            if (typeof object.value !== "object")
                throw TypeError(".PAnnotation.value: object expected");
            message.value = $root.PAnnotationValue.fromObject(object.value);
        }
        return message;
    };

    /**
     * Creates a plain object from a PAnnotation message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PAnnotation
     * @static
     * @param {PAnnotation} message PAnnotation
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PAnnotation.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.key = 0;
            object.value = null;
        }
        if (message.key != null && message.hasOwnProperty("key"))
            object.key = message.key;
        if (message.value != null && message.hasOwnProperty("value"))
            object.value = $root.PAnnotationValue.toObject(message.value, options);
        return object;
    };

    /**
     * Converts this PAnnotation to JSON.
     * @function toJSON
     * @memberof PAnnotation
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PAnnotation.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PAnnotation;
})();

$root.google = (function() {

    /**
     * Namespace google.
     * @exports google
     * @namespace
     */
    var google = {};

    google.protobuf = (function() {

        /**
         * Namespace protobuf.
         * @memberof google
         * @namespace
         */
        var protobuf = {};

        protobuf.Empty = (function() {

            /**
             * Properties of an Empty.
             * @memberof google.protobuf
             * @interface IEmpty
             */

            /**
             * Constructs a new Empty.
             * @memberof google.protobuf
             * @classdesc Represents an Empty.
             * @implements IEmpty
             * @constructor
             * @param {google.protobuf.IEmpty=} [properties] Properties to set
             */
            function Empty(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new Empty instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Empty
             * @static
             * @param {google.protobuf.IEmpty=} [properties] Properties to set
             * @returns {google.protobuf.Empty} Empty instance
             */
            Empty.create = function create(properties) {
                return new Empty(properties);
            };

            /**
             * Encodes the specified Empty message. Does not implicitly {@link google.protobuf.Empty.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Empty
             * @static
             * @param {google.protobuf.IEmpty} message Empty message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Empty.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified Empty message, length delimited. Does not implicitly {@link google.protobuf.Empty.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Empty
             * @static
             * @param {google.protobuf.IEmpty} message Empty message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Empty.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Empty message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Empty
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Empty} Empty
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Empty.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Empty();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Empty message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Empty
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Empty} Empty
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Empty.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Empty message.
             * @function verify
             * @memberof google.protobuf.Empty
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Empty.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates an Empty message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Empty
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Empty} Empty
             */
            Empty.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Empty)
                    return object;
                return new $root.google.protobuf.Empty();
            };

            /**
             * Creates a plain object from an Empty message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Empty
             * @static
             * @param {google.protobuf.Empty} message Empty
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Empty.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this Empty to JSON.
             * @function toJSON
             * @memberof google.protobuf.Empty
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Empty.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Empty;
        })();

        protobuf.DoubleValue = (function() {

            /**
             * Properties of a DoubleValue.
             * @memberof google.protobuf
             * @interface IDoubleValue
             * @property {number|null} [value] DoubleValue value
             */

            /**
             * Constructs a new DoubleValue.
             * @memberof google.protobuf
             * @classdesc Represents a DoubleValue.
             * @implements IDoubleValue
             * @constructor
             * @param {google.protobuf.IDoubleValue=} [properties] Properties to set
             */
            function DoubleValue(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DoubleValue value.
             * @member {number} value
             * @memberof google.protobuf.DoubleValue
             * @instance
             */
            DoubleValue.prototype.value = 0;

            /**
             * Creates a new DoubleValue instance using the specified properties.
             * @function create
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {google.protobuf.IDoubleValue=} [properties] Properties to set
             * @returns {google.protobuf.DoubleValue} DoubleValue instance
             */
            DoubleValue.create = function create(properties) {
                return new DoubleValue(properties);
            };

            /**
             * Encodes the specified DoubleValue message. Does not implicitly {@link google.protobuf.DoubleValue.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {google.protobuf.IDoubleValue} message DoubleValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DoubleValue.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 1, wireType 1 =*/9).double(message.value);
                return writer;
            };

            /**
             * Encodes the specified DoubleValue message, length delimited. Does not implicitly {@link google.protobuf.DoubleValue.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {google.protobuf.IDoubleValue} message DoubleValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DoubleValue.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DoubleValue message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.DoubleValue} DoubleValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DoubleValue.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.DoubleValue();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.double();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a DoubleValue message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.DoubleValue} DoubleValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DoubleValue.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DoubleValue message.
             * @function verify
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DoubleValue.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (typeof message.value !== "number")
                        return "value: number expected";
                return null;
            };

            /**
             * Creates a DoubleValue message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.DoubleValue} DoubleValue
             */
            DoubleValue.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.DoubleValue)
                    return object;
                var message = new $root.google.protobuf.DoubleValue();
                if (object.value != null)
                    message.value = Number(object.value);
                return message;
            };

            /**
             * Creates a plain object from a DoubleValue message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.DoubleValue
             * @static
             * @param {google.protobuf.DoubleValue} message DoubleValue
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DoubleValue.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.value = 0;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = options.json && !isFinite(message.value) ? String(message.value) : message.value;
                return object;
            };

            /**
             * Converts this DoubleValue to JSON.
             * @function toJSON
             * @memberof google.protobuf.DoubleValue
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DoubleValue.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return DoubleValue;
        })();

        protobuf.FloatValue = (function() {

            /**
             * Properties of a FloatValue.
             * @memberof google.protobuf
             * @interface IFloatValue
             * @property {number|null} [value] FloatValue value
             */

            /**
             * Constructs a new FloatValue.
             * @memberof google.protobuf
             * @classdesc Represents a FloatValue.
             * @implements IFloatValue
             * @constructor
             * @param {google.protobuf.IFloatValue=} [properties] Properties to set
             */
            function FloatValue(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * FloatValue value.
             * @member {number} value
             * @memberof google.protobuf.FloatValue
             * @instance
             */
            FloatValue.prototype.value = 0;

            /**
             * Creates a new FloatValue instance using the specified properties.
             * @function create
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {google.protobuf.IFloatValue=} [properties] Properties to set
             * @returns {google.protobuf.FloatValue} FloatValue instance
             */
            FloatValue.create = function create(properties) {
                return new FloatValue(properties);
            };

            /**
             * Encodes the specified FloatValue message. Does not implicitly {@link google.protobuf.FloatValue.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {google.protobuf.IFloatValue} message FloatValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FloatValue.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 1, wireType 5 =*/13).float(message.value);
                return writer;
            };

            /**
             * Encodes the specified FloatValue message, length delimited. Does not implicitly {@link google.protobuf.FloatValue.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {google.protobuf.IFloatValue} message FloatValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FloatValue.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a FloatValue message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.FloatValue} FloatValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FloatValue.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.FloatValue();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.float();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a FloatValue message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.FloatValue} FloatValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FloatValue.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a FloatValue message.
             * @function verify
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            FloatValue.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (typeof message.value !== "number")
                        return "value: number expected";
                return null;
            };

            /**
             * Creates a FloatValue message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.FloatValue} FloatValue
             */
            FloatValue.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.FloatValue)
                    return object;
                var message = new $root.google.protobuf.FloatValue();
                if (object.value != null)
                    message.value = Number(object.value);
                return message;
            };

            /**
             * Creates a plain object from a FloatValue message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.FloatValue
             * @static
             * @param {google.protobuf.FloatValue} message FloatValue
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            FloatValue.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.value = 0;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = options.json && !isFinite(message.value) ? String(message.value) : message.value;
                return object;
            };

            /**
             * Converts this FloatValue to JSON.
             * @function toJSON
             * @memberof google.protobuf.FloatValue
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            FloatValue.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return FloatValue;
        })();

        protobuf.Int64Value = (function() {

            /**
             * Properties of an Int64Value.
             * @memberof google.protobuf
             * @interface IInt64Value
             * @property {number|Long|null} [value] Int64Value value
             */

            /**
             * Constructs a new Int64Value.
             * @memberof google.protobuf
             * @classdesc Represents an Int64Value.
             * @implements IInt64Value
             * @constructor
             * @param {google.protobuf.IInt64Value=} [properties] Properties to set
             */
            function Int64Value(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Int64Value value.
             * @member {number|Long} value
             * @memberof google.protobuf.Int64Value
             * @instance
             */
            Int64Value.prototype.value = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Creates a new Int64Value instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {google.protobuf.IInt64Value=} [properties] Properties to set
             * @returns {google.protobuf.Int64Value} Int64Value instance
             */
            Int64Value.create = function create(properties) {
                return new Int64Value(properties);
            };

            /**
             * Encodes the specified Int64Value message. Does not implicitly {@link google.protobuf.Int64Value.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {google.protobuf.IInt64Value} message Int64Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Int64Value.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int64(message.value);
                return writer;
            };

            /**
             * Encodes the specified Int64Value message, length delimited. Does not implicitly {@link google.protobuf.Int64Value.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {google.protobuf.IInt64Value} message Int64Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Int64Value.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Int64Value message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Int64Value} Int64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Int64Value.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Int64Value();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.int64();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Int64Value message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Int64Value} Int64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Int64Value.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Int64Value message.
             * @function verify
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Int64Value.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!$util.isInteger(message.value) && !(message.value && $util.isInteger(message.value.low) && $util.isInteger(message.value.high)))
                        return "value: integer|Long expected";
                return null;
            };

            /**
             * Creates an Int64Value message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Int64Value} Int64Value
             */
            Int64Value.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Int64Value)
                    return object;
                var message = new $root.google.protobuf.Int64Value();
                if (object.value != null)
                    if ($util.Long)
                        (message.value = $util.Long.fromValue(object.value)).unsigned = false;
                    else if (typeof object.value === "string")
                        message.value = parseInt(object.value, 10);
                    else if (typeof object.value === "number")
                        message.value = object.value;
                    else if (typeof object.value === "object")
                        message.value = new $util.LongBits(object.value.low >>> 0, object.value.high >>> 0).toNumber();
                return message;
            };

            /**
             * Creates a plain object from an Int64Value message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Int64Value
             * @static
             * @param {google.protobuf.Int64Value} message Int64Value
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Int64Value.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.value = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.value = options.longs === String ? "0" : 0;
                if (message.value != null && message.hasOwnProperty("value"))
                    if (typeof message.value === "number")
                        object.value = options.longs === String ? String(message.value) : message.value;
                    else
                        object.value = options.longs === String ? $util.Long.prototype.toString.call(message.value) : options.longs === Number ? new $util.LongBits(message.value.low >>> 0, message.value.high >>> 0).toNumber() : message.value;
                return object;
            };

            /**
             * Converts this Int64Value to JSON.
             * @function toJSON
             * @memberof google.protobuf.Int64Value
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Int64Value.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Int64Value;
        })();

        protobuf.UInt64Value = (function() {

            /**
             * Properties of a UInt64Value.
             * @memberof google.protobuf
             * @interface IUInt64Value
             * @property {number|Long|null} [value] UInt64Value value
             */

            /**
             * Constructs a new UInt64Value.
             * @memberof google.protobuf
             * @classdesc Represents a UInt64Value.
             * @implements IUInt64Value
             * @constructor
             * @param {google.protobuf.IUInt64Value=} [properties] Properties to set
             */
            function UInt64Value(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * UInt64Value value.
             * @member {number|Long} value
             * @memberof google.protobuf.UInt64Value
             * @instance
             */
            UInt64Value.prototype.value = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new UInt64Value instance using the specified properties.
             * @function create
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {google.protobuf.IUInt64Value=} [properties] Properties to set
             * @returns {google.protobuf.UInt64Value} UInt64Value instance
             */
            UInt64Value.create = function create(properties) {
                return new UInt64Value(properties);
            };

            /**
             * Encodes the specified UInt64Value message. Does not implicitly {@link google.protobuf.UInt64Value.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {google.protobuf.IUInt64Value} message UInt64Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UInt64Value.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.value);
                return writer;
            };

            /**
             * Encodes the specified UInt64Value message, length delimited. Does not implicitly {@link google.protobuf.UInt64Value.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {google.protobuf.IUInt64Value} message UInt64Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UInt64Value.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a UInt64Value message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.UInt64Value} UInt64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UInt64Value.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.UInt64Value();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.uint64();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a UInt64Value message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.UInt64Value} UInt64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UInt64Value.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a UInt64Value message.
             * @function verify
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UInt64Value.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!$util.isInteger(message.value) && !(message.value && $util.isInteger(message.value.low) && $util.isInteger(message.value.high)))
                        return "value: integer|Long expected";
                return null;
            };

            /**
             * Creates a UInt64Value message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.UInt64Value} UInt64Value
             */
            UInt64Value.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.UInt64Value)
                    return object;
                var message = new $root.google.protobuf.UInt64Value();
                if (object.value != null)
                    if ($util.Long)
                        (message.value = $util.Long.fromValue(object.value)).unsigned = true;
                    else if (typeof object.value === "string")
                        message.value = parseInt(object.value, 10);
                    else if (typeof object.value === "number")
                        message.value = object.value;
                    else if (typeof object.value === "object")
                        message.value = new $util.LongBits(object.value.low >>> 0, object.value.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a UInt64Value message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.UInt64Value
             * @static
             * @param {google.protobuf.UInt64Value} message UInt64Value
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UInt64Value.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.value = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.value = options.longs === String ? "0" : 0;
                if (message.value != null && message.hasOwnProperty("value"))
                    if (typeof message.value === "number")
                        object.value = options.longs === String ? String(message.value) : message.value;
                    else
                        object.value = options.longs === String ? $util.Long.prototype.toString.call(message.value) : options.longs === Number ? new $util.LongBits(message.value.low >>> 0, message.value.high >>> 0).toNumber(true) : message.value;
                return object;
            };

            /**
             * Converts this UInt64Value to JSON.
             * @function toJSON
             * @memberof google.protobuf.UInt64Value
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UInt64Value.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return UInt64Value;
        })();

        protobuf.Int32Value = (function() {

            /**
             * Properties of an Int32Value.
             * @memberof google.protobuf
             * @interface IInt32Value
             * @property {number|null} [value] Int32Value value
             */

            /**
             * Constructs a new Int32Value.
             * @memberof google.protobuf
             * @classdesc Represents an Int32Value.
             * @implements IInt32Value
             * @constructor
             * @param {google.protobuf.IInt32Value=} [properties] Properties to set
             */
            function Int32Value(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Int32Value value.
             * @member {number} value
             * @memberof google.protobuf.Int32Value
             * @instance
             */
            Int32Value.prototype.value = 0;

            /**
             * Creates a new Int32Value instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {google.protobuf.IInt32Value=} [properties] Properties to set
             * @returns {google.protobuf.Int32Value} Int32Value instance
             */
            Int32Value.create = function create(properties) {
                return new Int32Value(properties);
            };

            /**
             * Encodes the specified Int32Value message. Does not implicitly {@link google.protobuf.Int32Value.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {google.protobuf.IInt32Value} message Int32Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Int32Value.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.value);
                return writer;
            };

            /**
             * Encodes the specified Int32Value message, length delimited. Does not implicitly {@link google.protobuf.Int32Value.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {google.protobuf.IInt32Value} message Int32Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Int32Value.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Int32Value message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Int32Value} Int32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Int32Value.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Int32Value();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Int32Value message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Int32Value} Int32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Int32Value.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Int32Value message.
             * @function verify
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Int32Value.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!$util.isInteger(message.value))
                        return "value: integer expected";
                return null;
            };

            /**
             * Creates an Int32Value message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Int32Value} Int32Value
             */
            Int32Value.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Int32Value)
                    return object;
                var message = new $root.google.protobuf.Int32Value();
                if (object.value != null)
                    message.value = object.value | 0;
                return message;
            };

            /**
             * Creates a plain object from an Int32Value message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Int32Value
             * @static
             * @param {google.protobuf.Int32Value} message Int32Value
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Int32Value.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.value = 0;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = message.value;
                return object;
            };

            /**
             * Converts this Int32Value to JSON.
             * @function toJSON
             * @memberof google.protobuf.Int32Value
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Int32Value.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Int32Value;
        })();

        protobuf.UInt32Value = (function() {

            /**
             * Properties of a UInt32Value.
             * @memberof google.protobuf
             * @interface IUInt32Value
             * @property {number|null} [value] UInt32Value value
             */

            /**
             * Constructs a new UInt32Value.
             * @memberof google.protobuf
             * @classdesc Represents a UInt32Value.
             * @implements IUInt32Value
             * @constructor
             * @param {google.protobuf.IUInt32Value=} [properties] Properties to set
             */
            function UInt32Value(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * UInt32Value value.
             * @member {number} value
             * @memberof google.protobuf.UInt32Value
             * @instance
             */
            UInt32Value.prototype.value = 0;

            /**
             * Creates a new UInt32Value instance using the specified properties.
             * @function create
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {google.protobuf.IUInt32Value=} [properties] Properties to set
             * @returns {google.protobuf.UInt32Value} UInt32Value instance
             */
            UInt32Value.create = function create(properties) {
                return new UInt32Value(properties);
            };

            /**
             * Encodes the specified UInt32Value message. Does not implicitly {@link google.protobuf.UInt32Value.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {google.protobuf.IUInt32Value} message UInt32Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UInt32Value.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.value);
                return writer;
            };

            /**
             * Encodes the specified UInt32Value message, length delimited. Does not implicitly {@link google.protobuf.UInt32Value.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {google.protobuf.IUInt32Value} message UInt32Value message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UInt32Value.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a UInt32Value message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.UInt32Value} UInt32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UInt32Value.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.UInt32Value();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.uint32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a UInt32Value message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.UInt32Value} UInt32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UInt32Value.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a UInt32Value message.
             * @function verify
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UInt32Value.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!$util.isInteger(message.value))
                        return "value: integer expected";
                return null;
            };

            /**
             * Creates a UInt32Value message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.UInt32Value} UInt32Value
             */
            UInt32Value.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.UInt32Value)
                    return object;
                var message = new $root.google.protobuf.UInt32Value();
                if (object.value != null)
                    message.value = object.value >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a UInt32Value message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.UInt32Value
             * @static
             * @param {google.protobuf.UInt32Value} message UInt32Value
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UInt32Value.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.value = 0;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = message.value;
                return object;
            };

            /**
             * Converts this UInt32Value to JSON.
             * @function toJSON
             * @memberof google.protobuf.UInt32Value
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UInt32Value.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return UInt32Value;
        })();

        protobuf.BoolValue = (function() {

            /**
             * Properties of a BoolValue.
             * @memberof google.protobuf
             * @interface IBoolValue
             * @property {boolean|null} [value] BoolValue value
             */

            /**
             * Constructs a new BoolValue.
             * @memberof google.protobuf
             * @classdesc Represents a BoolValue.
             * @implements IBoolValue
             * @constructor
             * @param {google.protobuf.IBoolValue=} [properties] Properties to set
             */
            function BoolValue(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * BoolValue value.
             * @member {boolean} value
             * @memberof google.protobuf.BoolValue
             * @instance
             */
            BoolValue.prototype.value = false;

            /**
             * Creates a new BoolValue instance using the specified properties.
             * @function create
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {google.protobuf.IBoolValue=} [properties] Properties to set
             * @returns {google.protobuf.BoolValue} BoolValue instance
             */
            BoolValue.create = function create(properties) {
                return new BoolValue(properties);
            };

            /**
             * Encodes the specified BoolValue message. Does not implicitly {@link google.protobuf.BoolValue.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {google.protobuf.IBoolValue} message BoolValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BoolValue.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.value);
                return writer;
            };

            /**
             * Encodes the specified BoolValue message, length delimited. Does not implicitly {@link google.protobuf.BoolValue.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {google.protobuf.IBoolValue} message BoolValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BoolValue.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a BoolValue message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.BoolValue} BoolValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BoolValue.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.BoolValue();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.bool();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a BoolValue message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.BoolValue} BoolValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BoolValue.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a BoolValue message.
             * @function verify
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            BoolValue.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (typeof message.value !== "boolean")
                        return "value: boolean expected";
                return null;
            };

            /**
             * Creates a BoolValue message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.BoolValue} BoolValue
             */
            BoolValue.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.BoolValue)
                    return object;
                var message = new $root.google.protobuf.BoolValue();
                if (object.value != null)
                    message.value = Boolean(object.value);
                return message;
            };

            /**
             * Creates a plain object from a BoolValue message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.BoolValue
             * @static
             * @param {google.protobuf.BoolValue} message BoolValue
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            BoolValue.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.value = false;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = message.value;
                return object;
            };

            /**
             * Converts this BoolValue to JSON.
             * @function toJSON
             * @memberof google.protobuf.BoolValue
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            BoolValue.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return BoolValue;
        })();

        protobuf.StringValue = (function() {

            /**
             * Properties of a StringValue.
             * @memberof google.protobuf
             * @interface IStringValue
             * @property {string|null} [value] StringValue value
             */

            /**
             * Constructs a new StringValue.
             * @memberof google.protobuf
             * @classdesc Represents a StringValue.
             * @implements IStringValue
             * @constructor
             * @param {google.protobuf.IStringValue=} [properties] Properties to set
             */
            function StringValue(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * StringValue value.
             * @member {string} value
             * @memberof google.protobuf.StringValue
             * @instance
             */
            StringValue.prototype.value = "";

            /**
             * Creates a new StringValue instance using the specified properties.
             * @function create
             * @memberof google.protobuf.StringValue
             * @static
             * @param {google.protobuf.IStringValue=} [properties] Properties to set
             * @returns {google.protobuf.StringValue} StringValue instance
             */
            StringValue.create = function create(properties) {
                return new StringValue(properties);
            };

            /**
             * Encodes the specified StringValue message. Does not implicitly {@link google.protobuf.StringValue.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.StringValue
             * @static
             * @param {google.protobuf.IStringValue} message StringValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            StringValue.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.value);
                return writer;
            };

            /**
             * Encodes the specified StringValue message, length delimited. Does not implicitly {@link google.protobuf.StringValue.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.StringValue
             * @static
             * @param {google.protobuf.IStringValue} message StringValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            StringValue.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a StringValue message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.StringValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.StringValue} StringValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            StringValue.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.StringValue();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a StringValue message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.StringValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.StringValue} StringValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            StringValue.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a StringValue message.
             * @function verify
             * @memberof google.protobuf.StringValue
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            StringValue.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!$util.isString(message.value))
                        return "value: string expected";
                return null;
            };

            /**
             * Creates a StringValue message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.StringValue
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.StringValue} StringValue
             */
            StringValue.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.StringValue)
                    return object;
                var message = new $root.google.protobuf.StringValue();
                if (object.value != null)
                    message.value = String(object.value);
                return message;
            };

            /**
             * Creates a plain object from a StringValue message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.StringValue
             * @static
             * @param {google.protobuf.StringValue} message StringValue
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            StringValue.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.value = "";
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = message.value;
                return object;
            };

            /**
             * Converts this StringValue to JSON.
             * @function toJSON
             * @memberof google.protobuf.StringValue
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            StringValue.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return StringValue;
        })();

        protobuf.BytesValue = (function() {

            /**
             * Properties of a BytesValue.
             * @memberof google.protobuf
             * @interface IBytesValue
             * @property {Uint8Array|null} [value] BytesValue value
             */

            /**
             * Constructs a new BytesValue.
             * @memberof google.protobuf
             * @classdesc Represents a BytesValue.
             * @implements IBytesValue
             * @constructor
             * @param {google.protobuf.IBytesValue=} [properties] Properties to set
             */
            function BytesValue(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * BytesValue value.
             * @member {Uint8Array} value
             * @memberof google.protobuf.BytesValue
             * @instance
             */
            BytesValue.prototype.value = $util.newBuffer([]);

            /**
             * Creates a new BytesValue instance using the specified properties.
             * @function create
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {google.protobuf.IBytesValue=} [properties] Properties to set
             * @returns {google.protobuf.BytesValue} BytesValue instance
             */
            BytesValue.create = function create(properties) {
                return new BytesValue(properties);
            };

            /**
             * Encodes the specified BytesValue message. Does not implicitly {@link google.protobuf.BytesValue.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {google.protobuf.IBytesValue} message BytesValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BytesValue.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.value);
                return writer;
            };

            /**
             * Encodes the specified BytesValue message, length delimited. Does not implicitly {@link google.protobuf.BytesValue.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {google.protobuf.IBytesValue} message BytesValue message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BytesValue.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a BytesValue message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.BytesValue} BytesValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BytesValue.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.BytesValue();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.value = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a BytesValue message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.BytesValue} BytesValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BytesValue.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a BytesValue message.
             * @function verify
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            BytesValue.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!(message.value && typeof message.value.length === "number" || $util.isString(message.value)))
                        return "value: buffer expected";
                return null;
            };

            /**
             * Creates a BytesValue message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.BytesValue} BytesValue
             */
            BytesValue.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.BytesValue)
                    return object;
                var message = new $root.google.protobuf.BytesValue();
                if (object.value != null)
                    if (typeof object.value === "string")
                        $util.base64.decode(object.value, message.value = $util.newBuffer($util.base64.length(object.value)), 0);
                    else if (object.value.length)
                        message.value = object.value;
                return message;
            };

            /**
             * Creates a plain object from a BytesValue message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.BytesValue
             * @static
             * @param {google.protobuf.BytesValue} message BytesValue
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            BytesValue.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    if (options.bytes === String)
                        object.value = "";
                    else {
                        object.value = [];
                        if (options.bytes !== Array)
                            object.value = $util.newBuffer(object.value);
                    }
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = options.bytes === String ? $util.base64.encode(message.value, 0, message.value.length) : options.bytes === Array ? Array.prototype.slice.call(message.value) : message.value;
                return object;
            };

            /**
             * Converts this BytesValue to JSON.
             * @function toJSON
             * @memberof google.protobuf.BytesValue
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            BytesValue.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return BytesValue;
        })();

        return protobuf;
    })();

    return google;
})();

module.exports = $root;
