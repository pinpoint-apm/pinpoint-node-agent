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

    /**
     * PCommandType enum.
     * @name v1.PCommandType
     * @enum {string}
     * @property {number} NONE=0 NONE value
     * @property {number} PING=100 PING value
     * @property {number} PONG=101 PONG value
     * @property {number} ECHO=710 ECHO value
     * @property {number} ACTIVE_THREAD_COUNT=730 ACTIVE_THREAD_COUNT value
     * @property {number} ACTIVE_THREAD_DUMP=740 ACTIVE_THREAD_DUMP value
     * @property {number} ACTIVE_THREAD_LIGHT_DUMP=750 ACTIVE_THREAD_LIGHT_DUMP value
     */
    v1.PCommandType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "NONE"] = 0;
        values[valuesById[100] = "PING"] = 100;
        values[valuesById[101] = "PONG"] = 101;
        values[valuesById[710] = "ECHO"] = 710;
        values[valuesById[730] = "ACTIVE_THREAD_COUNT"] = 730;
        values[valuesById[740] = "ACTIVE_THREAD_DUMP"] = 740;
        values[valuesById[750] = "ACTIVE_THREAD_LIGHT_DUMP"] = 750;
        return values;
    })();

    v1.PCmdMessage = (function() {

        /**
         * Properties of a PCmdMessage.
         * @memberof v1
         * @interface IPCmdMessage
         * @property {v1.IPCmdServiceHandshake|null} [handshakeMessage] PCmdMessage handshakeMessage
         * @property {v1.IPCmdResponse|null} [failMessage] PCmdMessage failMessage
         */

        /**
         * Constructs a new PCmdMessage.
         * @memberof v1
         * @classdesc Represents a PCmdMessage.
         * @implements IPCmdMessage
         * @constructor
         * @param {v1.IPCmdMessage=} [properties] Properties to set
         */
        function PCmdMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PCmdMessage handshakeMessage.
         * @member {v1.IPCmdServiceHandshake|null|undefined} handshakeMessage
         * @memberof v1.PCmdMessage
         * @instance
         */
        PCmdMessage.prototype.handshakeMessage = null;

        /**
         * PCmdMessage failMessage.
         * @member {v1.IPCmdResponse|null|undefined} failMessage
         * @memberof v1.PCmdMessage
         * @instance
         */
        PCmdMessage.prototype.failMessage = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * PCmdMessage message.
         * @member {"handshakeMessage"|"failMessage"|undefined} message
         * @memberof v1.PCmdMessage
         * @instance
         */
        Object.defineProperty(PCmdMessage.prototype, "message", {
            get: $util.oneOfGetter($oneOfFields = ["handshakeMessage", "failMessage"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new PCmdMessage instance using the specified properties.
         * @function create
         * @memberof v1.PCmdMessage
         * @static
         * @param {v1.IPCmdMessage=} [properties] Properties to set
         * @returns {v1.PCmdMessage} PCmdMessage instance
         */
        PCmdMessage.create = function create(properties) {
            return new PCmdMessage(properties);
        };

        /**
         * Encodes the specified PCmdMessage message. Does not implicitly {@link v1.PCmdMessage.verify|verify} messages.
         * @function encode
         * @memberof v1.PCmdMessage
         * @static
         * @param {v1.IPCmdMessage} message PCmdMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PCmdMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.handshakeMessage != null && message.hasOwnProperty("handshakeMessage"))
                $root.v1.PCmdServiceHandshake.encode(message.handshakeMessage, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.failMessage != null && message.hasOwnProperty("failMessage"))
                $root.v1.PCmdResponse.encode(message.failMessage, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified PCmdMessage message, length delimited. Does not implicitly {@link v1.PCmdMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PCmdMessage
         * @static
         * @param {v1.IPCmdMessage} message PCmdMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PCmdMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PCmdMessage message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PCmdMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PCmdMessage} PCmdMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PCmdMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PCmdMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.handshakeMessage = $root.v1.PCmdServiceHandshake.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.failMessage = $root.v1.PCmdResponse.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PCmdMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PCmdMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PCmdMessage} PCmdMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PCmdMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PCmdMessage message.
         * @function verify
         * @memberof v1.PCmdMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PCmdMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.handshakeMessage != null && message.hasOwnProperty("handshakeMessage")) {
                properties.message = 1;
                {
                    var error = $root.v1.PCmdServiceHandshake.verify(message.handshakeMessage);
                    if (error)
                        return "handshakeMessage." + error;
                }
            }
            if (message.failMessage != null && message.hasOwnProperty("failMessage")) {
                if (properties.message === 1)
                    return "message: multiple values";
                properties.message = 1;
                {
                    var error = $root.v1.PCmdResponse.verify(message.failMessage);
                    if (error)
                        return "failMessage." + error;
                }
            }
            return null;
        };

        /**
         * Creates a PCmdMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PCmdMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PCmdMessage} PCmdMessage
         */
        PCmdMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PCmdMessage)
                return object;
            var message = new $root.v1.PCmdMessage();
            if (object.handshakeMessage != null) {
                if (typeof object.handshakeMessage !== "object")
                    throw TypeError(".v1.PCmdMessage.handshakeMessage: object expected");
                message.handshakeMessage = $root.v1.PCmdServiceHandshake.fromObject(object.handshakeMessage);
            }
            if (object.failMessage != null) {
                if (typeof object.failMessage !== "object")
                    throw TypeError(".v1.PCmdMessage.failMessage: object expected");
                message.failMessage = $root.v1.PCmdResponse.fromObject(object.failMessage);
            }
            return message;
        };

        /**
         * Creates a plain object from a PCmdMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PCmdMessage
         * @static
         * @param {v1.PCmdMessage} message PCmdMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PCmdMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (message.handshakeMessage != null && message.hasOwnProperty("handshakeMessage")) {
                object.handshakeMessage = $root.v1.PCmdServiceHandshake.toObject(message.handshakeMessage, options);
                if (options.oneofs)
                    object.message = "handshakeMessage";
            }
            if (message.failMessage != null && message.hasOwnProperty("failMessage")) {
                object.failMessage = $root.v1.PCmdResponse.toObject(message.failMessage, options);
                if (options.oneofs)
                    object.message = "failMessage";
            }
            return object;
        };

        /**
         * Converts this PCmdMessage to JSON.
         * @function toJSON
         * @memberof v1.PCmdMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PCmdMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PCmdMessage;
    })();

    v1.PCmdServiceHandshake = (function() {

        /**
         * Properties of a PCmdServiceHandshake.
         * @memberof v1
         * @interface IPCmdServiceHandshake
         * @property {Array.<number>|null} [supportCommandServiceKey] PCmdServiceHandshake supportCommandServiceKey
         */

        /**
         * Constructs a new PCmdServiceHandshake.
         * @memberof v1
         * @classdesc Represents a PCmdServiceHandshake.
         * @implements IPCmdServiceHandshake
         * @constructor
         * @param {v1.IPCmdServiceHandshake=} [properties] Properties to set
         */
        function PCmdServiceHandshake(properties) {
            this.supportCommandServiceKey = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PCmdServiceHandshake supportCommandServiceKey.
         * @member {Array.<number>} supportCommandServiceKey
         * @memberof v1.PCmdServiceHandshake
         * @instance
         */
        PCmdServiceHandshake.prototype.supportCommandServiceKey = $util.emptyArray;

        /**
         * Creates a new PCmdServiceHandshake instance using the specified properties.
         * @function create
         * @memberof v1.PCmdServiceHandshake
         * @static
         * @param {v1.IPCmdServiceHandshake=} [properties] Properties to set
         * @returns {v1.PCmdServiceHandshake} PCmdServiceHandshake instance
         */
        PCmdServiceHandshake.create = function create(properties) {
            return new PCmdServiceHandshake(properties);
        };

        /**
         * Encodes the specified PCmdServiceHandshake message. Does not implicitly {@link v1.PCmdServiceHandshake.verify|verify} messages.
         * @function encode
         * @memberof v1.PCmdServiceHandshake
         * @static
         * @param {v1.IPCmdServiceHandshake} message PCmdServiceHandshake message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PCmdServiceHandshake.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.supportCommandServiceKey != null && message.supportCommandServiceKey.length) {
                writer.uint32(/* id 1, wireType 2 =*/10).fork();
                for (var i = 0; i < message.supportCommandServiceKey.length; ++i)
                    writer.int32(message.supportCommandServiceKey[i]);
                writer.ldelim();
            }
            return writer;
        };

        /**
         * Encodes the specified PCmdServiceHandshake message, length delimited. Does not implicitly {@link v1.PCmdServiceHandshake.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PCmdServiceHandshake
         * @static
         * @param {v1.IPCmdServiceHandshake} message PCmdServiceHandshake message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PCmdServiceHandshake.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PCmdServiceHandshake message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PCmdServiceHandshake
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PCmdServiceHandshake} PCmdServiceHandshake
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PCmdServiceHandshake.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PCmdServiceHandshake();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.supportCommandServiceKey && message.supportCommandServiceKey.length))
                        message.supportCommandServiceKey = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.supportCommandServiceKey.push(reader.int32());
                    } else
                        message.supportCommandServiceKey.push(reader.int32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PCmdServiceHandshake message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PCmdServiceHandshake
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PCmdServiceHandshake} PCmdServiceHandshake
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PCmdServiceHandshake.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PCmdServiceHandshake message.
         * @function verify
         * @memberof v1.PCmdServiceHandshake
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PCmdServiceHandshake.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.supportCommandServiceKey != null && message.hasOwnProperty("supportCommandServiceKey")) {
                if (!Array.isArray(message.supportCommandServiceKey))
                    return "supportCommandServiceKey: array expected";
                for (var i = 0; i < message.supportCommandServiceKey.length; ++i)
                    if (!$util.isInteger(message.supportCommandServiceKey[i]))
                        return "supportCommandServiceKey: integer[] expected";
            }
            return null;
        };

        /**
         * Creates a PCmdServiceHandshake message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PCmdServiceHandshake
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PCmdServiceHandshake} PCmdServiceHandshake
         */
        PCmdServiceHandshake.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PCmdServiceHandshake)
                return object;
            var message = new $root.v1.PCmdServiceHandshake();
            if (object.supportCommandServiceKey) {
                if (!Array.isArray(object.supportCommandServiceKey))
                    throw TypeError(".v1.PCmdServiceHandshake.supportCommandServiceKey: array expected");
                message.supportCommandServiceKey = [];
                for (var i = 0; i < object.supportCommandServiceKey.length; ++i)
                    message.supportCommandServiceKey[i] = object.supportCommandServiceKey[i] | 0;
            }
            return message;
        };

        /**
         * Creates a plain object from a PCmdServiceHandshake message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PCmdServiceHandshake
         * @static
         * @param {v1.PCmdServiceHandshake} message PCmdServiceHandshake
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PCmdServiceHandshake.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.supportCommandServiceKey = [];
            if (message.supportCommandServiceKey && message.supportCommandServiceKey.length) {
                object.supportCommandServiceKey = [];
                for (var j = 0; j < message.supportCommandServiceKey.length; ++j)
                    object.supportCommandServiceKey[j] = message.supportCommandServiceKey[j];
            }
            return object;
        };

        /**
         * Converts this PCmdServiceHandshake to JSON.
         * @function toJSON
         * @memberof v1.PCmdServiceHandshake
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PCmdServiceHandshake.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PCmdServiceHandshake;
    })();

    v1.PCmdResponse = (function() {

        /**
         * Properties of a PCmdResponse.
         * @memberof v1
         * @interface IPCmdResponse
         * @property {number|null} [responseId] PCmdResponse responseId
         * @property {number|null} [status] PCmdResponse status
         * @property {google.protobuf.IStringValue|null} [message] PCmdResponse message
         */

        /**
         * Constructs a new PCmdResponse.
         * @memberof v1
         * @classdesc Represents a PCmdResponse.
         * @implements IPCmdResponse
         * @constructor
         * @param {v1.IPCmdResponse=} [properties] Properties to set
         */
        function PCmdResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PCmdResponse responseId.
         * @member {number} responseId
         * @memberof v1.PCmdResponse
         * @instance
         */
        PCmdResponse.prototype.responseId = 0;

        /**
         * PCmdResponse status.
         * @member {number} status
         * @memberof v1.PCmdResponse
         * @instance
         */
        PCmdResponse.prototype.status = 0;

        /**
         * PCmdResponse message.
         * @member {google.protobuf.IStringValue|null|undefined} message
         * @memberof v1.PCmdResponse
         * @instance
         */
        PCmdResponse.prototype.message = null;

        /**
         * Creates a new PCmdResponse instance using the specified properties.
         * @function create
         * @memberof v1.PCmdResponse
         * @static
         * @param {v1.IPCmdResponse=} [properties] Properties to set
         * @returns {v1.PCmdResponse} PCmdResponse instance
         */
        PCmdResponse.create = function create(properties) {
            return new PCmdResponse(properties);
        };

        /**
         * Encodes the specified PCmdResponse message. Does not implicitly {@link v1.PCmdResponse.verify|verify} messages.
         * @function encode
         * @memberof v1.PCmdResponse
         * @static
         * @param {v1.IPCmdResponse} message PCmdResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PCmdResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.responseId != null && message.hasOwnProperty("responseId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.responseId);
            if (message.status != null && message.hasOwnProperty("status"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.status);
            if (message.message != null && message.hasOwnProperty("message"))
                $root.google.protobuf.StringValue.encode(message.message, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified PCmdResponse message, length delimited. Does not implicitly {@link v1.PCmdResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PCmdResponse
         * @static
         * @param {v1.IPCmdResponse} message PCmdResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PCmdResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PCmdResponse message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PCmdResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PCmdResponse} PCmdResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PCmdResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PCmdResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.responseId = reader.int32();
                    break;
                case 2:
                    message.status = reader.int32();
                    break;
                case 3:
                    message.message = $root.google.protobuf.StringValue.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PCmdResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PCmdResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PCmdResponse} PCmdResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PCmdResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PCmdResponse message.
         * @function verify
         * @memberof v1.PCmdResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PCmdResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.responseId != null && message.hasOwnProperty("responseId"))
                if (!$util.isInteger(message.responseId))
                    return "responseId: integer expected";
            if (message.status != null && message.hasOwnProperty("status"))
                if (!$util.isInteger(message.status))
                    return "status: integer expected";
            if (message.message != null && message.hasOwnProperty("message")) {
                var error = $root.google.protobuf.StringValue.verify(message.message);
                if (error)
                    return "message." + error;
            }
            return null;
        };

        /**
         * Creates a PCmdResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PCmdResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PCmdResponse} PCmdResponse
         */
        PCmdResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PCmdResponse)
                return object;
            var message = new $root.v1.PCmdResponse();
            if (object.responseId != null)
                message.responseId = object.responseId | 0;
            if (object.status != null)
                message.status = object.status | 0;
            if (object.message != null) {
                if (typeof object.message !== "object")
                    throw TypeError(".v1.PCmdResponse.message: object expected");
                message.message = $root.google.protobuf.StringValue.fromObject(object.message);
            }
            return message;
        };

        /**
         * Creates a plain object from a PCmdResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PCmdResponse
         * @static
         * @param {v1.PCmdResponse} message PCmdResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PCmdResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.responseId = 0;
                object.status = 0;
                object.message = null;
            }
            if (message.responseId != null && message.hasOwnProperty("responseId"))
                object.responseId = message.responseId;
            if (message.status != null && message.hasOwnProperty("status"))
                object.status = message.status;
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = $root.google.protobuf.StringValue.toObject(message.message, options);
            return object;
        };

        /**
         * Converts this PCmdResponse to JSON.
         * @function toJSON
         * @memberof v1.PCmdResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PCmdResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PCmdResponse;
    })();

    v1.PCmdStreamResponse = (function() {

        /**
         * Properties of a PCmdStreamResponse.
         * @memberof v1
         * @interface IPCmdStreamResponse
         * @property {number|null} [responseId] PCmdStreamResponse responseId
         * @property {number|null} [sequenceId] PCmdStreamResponse sequenceId
         * @property {google.protobuf.IStringValue|null} [message] PCmdStreamResponse message
         */

        /**
         * Constructs a new PCmdStreamResponse.
         * @memberof v1
         * @classdesc Represents a PCmdStreamResponse.
         * @implements IPCmdStreamResponse
         * @constructor
         * @param {v1.IPCmdStreamResponse=} [properties] Properties to set
         */
        function PCmdStreamResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PCmdStreamResponse responseId.
         * @member {number} responseId
         * @memberof v1.PCmdStreamResponse
         * @instance
         */
        PCmdStreamResponse.prototype.responseId = 0;

        /**
         * PCmdStreamResponse sequenceId.
         * @member {number} sequenceId
         * @memberof v1.PCmdStreamResponse
         * @instance
         */
        PCmdStreamResponse.prototype.sequenceId = 0;

        /**
         * PCmdStreamResponse message.
         * @member {google.protobuf.IStringValue|null|undefined} message
         * @memberof v1.PCmdStreamResponse
         * @instance
         */
        PCmdStreamResponse.prototype.message = null;

        /**
         * Creates a new PCmdStreamResponse instance using the specified properties.
         * @function create
         * @memberof v1.PCmdStreamResponse
         * @static
         * @param {v1.IPCmdStreamResponse=} [properties] Properties to set
         * @returns {v1.PCmdStreamResponse} PCmdStreamResponse instance
         */
        PCmdStreamResponse.create = function create(properties) {
            return new PCmdStreamResponse(properties);
        };

        /**
         * Encodes the specified PCmdStreamResponse message. Does not implicitly {@link v1.PCmdStreamResponse.verify|verify} messages.
         * @function encode
         * @memberof v1.PCmdStreamResponse
         * @static
         * @param {v1.IPCmdStreamResponse} message PCmdStreamResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PCmdStreamResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.responseId != null && message.hasOwnProperty("responseId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.responseId);
            if (message.sequenceId != null && message.hasOwnProperty("sequenceId"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.sequenceId);
            if (message.message != null && message.hasOwnProperty("message"))
                $root.google.protobuf.StringValue.encode(message.message, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified PCmdStreamResponse message, length delimited. Does not implicitly {@link v1.PCmdStreamResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PCmdStreamResponse
         * @static
         * @param {v1.IPCmdStreamResponse} message PCmdStreamResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PCmdStreamResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PCmdStreamResponse message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PCmdStreamResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PCmdStreamResponse} PCmdStreamResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PCmdStreamResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PCmdStreamResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.responseId = reader.int32();
                    break;
                case 2:
                    message.sequenceId = reader.int32();
                    break;
                case 3:
                    message.message = $root.google.protobuf.StringValue.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PCmdStreamResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PCmdStreamResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PCmdStreamResponse} PCmdStreamResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PCmdStreamResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PCmdStreamResponse message.
         * @function verify
         * @memberof v1.PCmdStreamResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PCmdStreamResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.responseId != null && message.hasOwnProperty("responseId"))
                if (!$util.isInteger(message.responseId))
                    return "responseId: integer expected";
            if (message.sequenceId != null && message.hasOwnProperty("sequenceId"))
                if (!$util.isInteger(message.sequenceId))
                    return "sequenceId: integer expected";
            if (message.message != null && message.hasOwnProperty("message")) {
                var error = $root.google.protobuf.StringValue.verify(message.message);
                if (error)
                    return "message." + error;
            }
            return null;
        };

        /**
         * Creates a PCmdStreamResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PCmdStreamResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PCmdStreamResponse} PCmdStreamResponse
         */
        PCmdStreamResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PCmdStreamResponse)
                return object;
            var message = new $root.v1.PCmdStreamResponse();
            if (object.responseId != null)
                message.responseId = object.responseId | 0;
            if (object.sequenceId != null)
                message.sequenceId = object.sequenceId | 0;
            if (object.message != null) {
                if (typeof object.message !== "object")
                    throw TypeError(".v1.PCmdStreamResponse.message: object expected");
                message.message = $root.google.protobuf.StringValue.fromObject(object.message);
            }
            return message;
        };

        /**
         * Creates a plain object from a PCmdStreamResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PCmdStreamResponse
         * @static
         * @param {v1.PCmdStreamResponse} message PCmdStreamResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PCmdStreamResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.responseId = 0;
                object.sequenceId = 0;
                object.message = null;
            }
            if (message.responseId != null && message.hasOwnProperty("responseId"))
                object.responseId = message.responseId;
            if (message.sequenceId != null && message.hasOwnProperty("sequenceId"))
                object.sequenceId = message.sequenceId;
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = $root.google.protobuf.StringValue.toObject(message.message, options);
            return object;
        };

        /**
         * Converts this PCmdStreamResponse to JSON.
         * @function toJSON
         * @memberof v1.PCmdStreamResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PCmdStreamResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PCmdStreamResponse;
    })();

    v1.PCmdRequest = (function() {

        /**
         * Properties of a PCmdRequest.
         * @memberof v1
         * @interface IPCmdRequest
         * @property {number|null} [requestId] PCmdRequest requestId
         * @property {v1.IPCmdEcho|null} [commandEcho] PCmdRequest commandEcho
         * @property {v1.IPCmdActiveThreadCount|null} [commandActiveThreadCount] PCmdRequest commandActiveThreadCount
         * @property {v1.IPCmdActiveThreadDump|null} [commandActiveThreadDump] PCmdRequest commandActiveThreadDump
         * @property {v1.IPCmdActiveThreadLightDump|null} [commandActiveThreadLightDump] PCmdRequest commandActiveThreadLightDump
         */

        /**
         * Constructs a new PCmdRequest.
         * @memberof v1
         * @classdesc Represents a PCmdRequest.
         * @implements IPCmdRequest
         * @constructor
         * @param {v1.IPCmdRequest=} [properties] Properties to set
         */
        function PCmdRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PCmdRequest requestId.
         * @member {number} requestId
         * @memberof v1.PCmdRequest
         * @instance
         */
        PCmdRequest.prototype.requestId = 0;

        /**
         * PCmdRequest commandEcho.
         * @member {v1.IPCmdEcho|null|undefined} commandEcho
         * @memberof v1.PCmdRequest
         * @instance
         */
        PCmdRequest.prototype.commandEcho = null;

        /**
         * PCmdRequest commandActiveThreadCount.
         * @member {v1.IPCmdActiveThreadCount|null|undefined} commandActiveThreadCount
         * @memberof v1.PCmdRequest
         * @instance
         */
        PCmdRequest.prototype.commandActiveThreadCount = null;

        /**
         * PCmdRequest commandActiveThreadDump.
         * @member {v1.IPCmdActiveThreadDump|null|undefined} commandActiveThreadDump
         * @memberof v1.PCmdRequest
         * @instance
         */
        PCmdRequest.prototype.commandActiveThreadDump = null;

        /**
         * PCmdRequest commandActiveThreadLightDump.
         * @member {v1.IPCmdActiveThreadLightDump|null|undefined} commandActiveThreadLightDump
         * @memberof v1.PCmdRequest
         * @instance
         */
        PCmdRequest.prototype.commandActiveThreadLightDump = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * PCmdRequest command.
         * @member {"commandEcho"|"commandActiveThreadCount"|"commandActiveThreadDump"|"commandActiveThreadLightDump"|undefined} command
         * @memberof v1.PCmdRequest
         * @instance
         */
        Object.defineProperty(PCmdRequest.prototype, "command", {
            get: $util.oneOfGetter($oneOfFields = ["commandEcho", "commandActiveThreadCount", "commandActiveThreadDump", "commandActiveThreadLightDump"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new PCmdRequest instance using the specified properties.
         * @function create
         * @memberof v1.PCmdRequest
         * @static
         * @param {v1.IPCmdRequest=} [properties] Properties to set
         * @returns {v1.PCmdRequest} PCmdRequest instance
         */
        PCmdRequest.create = function create(properties) {
            return new PCmdRequest(properties);
        };

        /**
         * Encodes the specified PCmdRequest message. Does not implicitly {@link v1.PCmdRequest.verify|verify} messages.
         * @function encode
         * @memberof v1.PCmdRequest
         * @static
         * @param {v1.IPCmdRequest} message PCmdRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PCmdRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.requestId != null && message.hasOwnProperty("requestId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.requestId);
            if (message.commandEcho != null && message.hasOwnProperty("commandEcho"))
                $root.v1.PCmdEcho.encode(message.commandEcho, writer.uint32(/* id 710, wireType 2 =*/5682).fork()).ldelim();
            if (message.commandActiveThreadCount != null && message.hasOwnProperty("commandActiveThreadCount"))
                $root.v1.PCmdActiveThreadCount.encode(message.commandActiveThreadCount, writer.uint32(/* id 730, wireType 2 =*/5842).fork()).ldelim();
            if (message.commandActiveThreadDump != null && message.hasOwnProperty("commandActiveThreadDump"))
                $root.v1.PCmdActiveThreadDump.encode(message.commandActiveThreadDump, writer.uint32(/* id 740, wireType 2 =*/5922).fork()).ldelim();
            if (message.commandActiveThreadLightDump != null && message.hasOwnProperty("commandActiveThreadLightDump"))
                $root.v1.PCmdActiveThreadLightDump.encode(message.commandActiveThreadLightDump, writer.uint32(/* id 750, wireType 2 =*/6002).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified PCmdRequest message, length delimited. Does not implicitly {@link v1.PCmdRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PCmdRequest
         * @static
         * @param {v1.IPCmdRequest} message PCmdRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PCmdRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PCmdRequest message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PCmdRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PCmdRequest} PCmdRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PCmdRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PCmdRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.requestId = reader.int32();
                    break;
                case 710:
                    message.commandEcho = $root.v1.PCmdEcho.decode(reader, reader.uint32());
                    break;
                case 730:
                    message.commandActiveThreadCount = $root.v1.PCmdActiveThreadCount.decode(reader, reader.uint32());
                    break;
                case 740:
                    message.commandActiveThreadDump = $root.v1.PCmdActiveThreadDump.decode(reader, reader.uint32());
                    break;
                case 750:
                    message.commandActiveThreadLightDump = $root.v1.PCmdActiveThreadLightDump.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PCmdRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PCmdRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PCmdRequest} PCmdRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PCmdRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PCmdRequest message.
         * @function verify
         * @memberof v1.PCmdRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PCmdRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.requestId != null && message.hasOwnProperty("requestId"))
                if (!$util.isInteger(message.requestId))
                    return "requestId: integer expected";
            if (message.commandEcho != null && message.hasOwnProperty("commandEcho")) {
                properties.command = 1;
                {
                    var error = $root.v1.PCmdEcho.verify(message.commandEcho);
                    if (error)
                        return "commandEcho." + error;
                }
            }
            if (message.commandActiveThreadCount != null && message.hasOwnProperty("commandActiveThreadCount")) {
                if (properties.command === 1)
                    return "command: multiple values";
                properties.command = 1;
                {
                    var error = $root.v1.PCmdActiveThreadCount.verify(message.commandActiveThreadCount);
                    if (error)
                        return "commandActiveThreadCount." + error;
                }
            }
            if (message.commandActiveThreadDump != null && message.hasOwnProperty("commandActiveThreadDump")) {
                if (properties.command === 1)
                    return "command: multiple values";
                properties.command = 1;
                {
                    var error = $root.v1.PCmdActiveThreadDump.verify(message.commandActiveThreadDump);
                    if (error)
                        return "commandActiveThreadDump." + error;
                }
            }
            if (message.commandActiveThreadLightDump != null && message.hasOwnProperty("commandActiveThreadLightDump")) {
                if (properties.command === 1)
                    return "command: multiple values";
                properties.command = 1;
                {
                    var error = $root.v1.PCmdActiveThreadLightDump.verify(message.commandActiveThreadLightDump);
                    if (error)
                        return "commandActiveThreadLightDump." + error;
                }
            }
            return null;
        };

        /**
         * Creates a PCmdRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PCmdRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PCmdRequest} PCmdRequest
         */
        PCmdRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PCmdRequest)
                return object;
            var message = new $root.v1.PCmdRequest();
            if (object.requestId != null)
                message.requestId = object.requestId | 0;
            if (object.commandEcho != null) {
                if (typeof object.commandEcho !== "object")
                    throw TypeError(".v1.PCmdRequest.commandEcho: object expected");
                message.commandEcho = $root.v1.PCmdEcho.fromObject(object.commandEcho);
            }
            if (object.commandActiveThreadCount != null) {
                if (typeof object.commandActiveThreadCount !== "object")
                    throw TypeError(".v1.PCmdRequest.commandActiveThreadCount: object expected");
                message.commandActiveThreadCount = $root.v1.PCmdActiveThreadCount.fromObject(object.commandActiveThreadCount);
            }
            if (object.commandActiveThreadDump != null) {
                if (typeof object.commandActiveThreadDump !== "object")
                    throw TypeError(".v1.PCmdRequest.commandActiveThreadDump: object expected");
                message.commandActiveThreadDump = $root.v1.PCmdActiveThreadDump.fromObject(object.commandActiveThreadDump);
            }
            if (object.commandActiveThreadLightDump != null) {
                if (typeof object.commandActiveThreadLightDump !== "object")
                    throw TypeError(".v1.PCmdRequest.commandActiveThreadLightDump: object expected");
                message.commandActiveThreadLightDump = $root.v1.PCmdActiveThreadLightDump.fromObject(object.commandActiveThreadLightDump);
            }
            return message;
        };

        /**
         * Creates a plain object from a PCmdRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PCmdRequest
         * @static
         * @param {v1.PCmdRequest} message PCmdRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PCmdRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.requestId = 0;
            if (message.requestId != null && message.hasOwnProperty("requestId"))
                object.requestId = message.requestId;
            if (message.commandEcho != null && message.hasOwnProperty("commandEcho")) {
                object.commandEcho = $root.v1.PCmdEcho.toObject(message.commandEcho, options);
                if (options.oneofs)
                    object.command = "commandEcho";
            }
            if (message.commandActiveThreadCount != null && message.hasOwnProperty("commandActiveThreadCount")) {
                object.commandActiveThreadCount = $root.v1.PCmdActiveThreadCount.toObject(message.commandActiveThreadCount, options);
                if (options.oneofs)
                    object.command = "commandActiveThreadCount";
            }
            if (message.commandActiveThreadDump != null && message.hasOwnProperty("commandActiveThreadDump")) {
                object.commandActiveThreadDump = $root.v1.PCmdActiveThreadDump.toObject(message.commandActiveThreadDump, options);
                if (options.oneofs)
                    object.command = "commandActiveThreadDump";
            }
            if (message.commandActiveThreadLightDump != null && message.hasOwnProperty("commandActiveThreadLightDump")) {
                object.commandActiveThreadLightDump = $root.v1.PCmdActiveThreadLightDump.toObject(message.commandActiveThreadLightDump, options);
                if (options.oneofs)
                    object.command = "commandActiveThreadLightDump";
            }
            return object;
        };

        /**
         * Converts this PCmdRequest to JSON.
         * @function toJSON
         * @memberof v1.PCmdRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PCmdRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PCmdRequest;
    })();

    v1.PCmdEcho = (function() {

        /**
         * Properties of a PCmdEcho.
         * @memberof v1
         * @interface IPCmdEcho
         * @property {string|null} [message] PCmdEcho message
         */

        /**
         * Constructs a new PCmdEcho.
         * @memberof v1
         * @classdesc Represents a PCmdEcho.
         * @implements IPCmdEcho
         * @constructor
         * @param {v1.IPCmdEcho=} [properties] Properties to set
         */
        function PCmdEcho(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PCmdEcho message.
         * @member {string} message
         * @memberof v1.PCmdEcho
         * @instance
         */
        PCmdEcho.prototype.message = "";

        /**
         * Creates a new PCmdEcho instance using the specified properties.
         * @function create
         * @memberof v1.PCmdEcho
         * @static
         * @param {v1.IPCmdEcho=} [properties] Properties to set
         * @returns {v1.PCmdEcho} PCmdEcho instance
         */
        PCmdEcho.create = function create(properties) {
            return new PCmdEcho(properties);
        };

        /**
         * Encodes the specified PCmdEcho message. Does not implicitly {@link v1.PCmdEcho.verify|verify} messages.
         * @function encode
         * @memberof v1.PCmdEcho
         * @static
         * @param {v1.IPCmdEcho} message PCmdEcho message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PCmdEcho.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.message != null && message.hasOwnProperty("message"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.message);
            return writer;
        };

        /**
         * Encodes the specified PCmdEcho message, length delimited. Does not implicitly {@link v1.PCmdEcho.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PCmdEcho
         * @static
         * @param {v1.IPCmdEcho} message PCmdEcho message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PCmdEcho.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PCmdEcho message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PCmdEcho
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PCmdEcho} PCmdEcho
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PCmdEcho.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PCmdEcho();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
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
         * Decodes a PCmdEcho message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PCmdEcho
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PCmdEcho} PCmdEcho
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PCmdEcho.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PCmdEcho message.
         * @function verify
         * @memberof v1.PCmdEcho
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PCmdEcho.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.message != null && message.hasOwnProperty("message"))
                if (!$util.isString(message.message))
                    return "message: string expected";
            return null;
        };

        /**
         * Creates a PCmdEcho message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PCmdEcho
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PCmdEcho} PCmdEcho
         */
        PCmdEcho.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PCmdEcho)
                return object;
            var message = new $root.v1.PCmdEcho();
            if (object.message != null)
                message.message = String(object.message);
            return message;
        };

        /**
         * Creates a plain object from a PCmdEcho message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PCmdEcho
         * @static
         * @param {v1.PCmdEcho} message PCmdEcho
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PCmdEcho.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.message = "";
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = message.message;
            return object;
        };

        /**
         * Converts this PCmdEcho to JSON.
         * @function toJSON
         * @memberof v1.PCmdEcho
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PCmdEcho.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PCmdEcho;
    })();

    v1.PCmdEchoResponse = (function() {

        /**
         * Properties of a PCmdEchoResponse.
         * @memberof v1
         * @interface IPCmdEchoResponse
         * @property {v1.IPCmdResponse|null} [commonResponse] PCmdEchoResponse commonResponse
         * @property {string|null} [message] PCmdEchoResponse message
         */

        /**
         * Constructs a new PCmdEchoResponse.
         * @memberof v1
         * @classdesc Represents a PCmdEchoResponse.
         * @implements IPCmdEchoResponse
         * @constructor
         * @param {v1.IPCmdEchoResponse=} [properties] Properties to set
         */
        function PCmdEchoResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PCmdEchoResponse commonResponse.
         * @member {v1.IPCmdResponse|null|undefined} commonResponse
         * @memberof v1.PCmdEchoResponse
         * @instance
         */
        PCmdEchoResponse.prototype.commonResponse = null;

        /**
         * PCmdEchoResponse message.
         * @member {string} message
         * @memberof v1.PCmdEchoResponse
         * @instance
         */
        PCmdEchoResponse.prototype.message = "";

        /**
         * Creates a new PCmdEchoResponse instance using the specified properties.
         * @function create
         * @memberof v1.PCmdEchoResponse
         * @static
         * @param {v1.IPCmdEchoResponse=} [properties] Properties to set
         * @returns {v1.PCmdEchoResponse} PCmdEchoResponse instance
         */
        PCmdEchoResponse.create = function create(properties) {
            return new PCmdEchoResponse(properties);
        };

        /**
         * Encodes the specified PCmdEchoResponse message. Does not implicitly {@link v1.PCmdEchoResponse.verify|verify} messages.
         * @function encode
         * @memberof v1.PCmdEchoResponse
         * @static
         * @param {v1.IPCmdEchoResponse} message PCmdEchoResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PCmdEchoResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.commonResponse != null && message.hasOwnProperty("commonResponse"))
                $root.v1.PCmdResponse.encode(message.commonResponse, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.message != null && message.hasOwnProperty("message"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.message);
            return writer;
        };

        /**
         * Encodes the specified PCmdEchoResponse message, length delimited. Does not implicitly {@link v1.PCmdEchoResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PCmdEchoResponse
         * @static
         * @param {v1.IPCmdEchoResponse} message PCmdEchoResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PCmdEchoResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PCmdEchoResponse message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PCmdEchoResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PCmdEchoResponse} PCmdEchoResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PCmdEchoResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PCmdEchoResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.commonResponse = $root.v1.PCmdResponse.decode(reader, reader.uint32());
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
         * Decodes a PCmdEchoResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PCmdEchoResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PCmdEchoResponse} PCmdEchoResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PCmdEchoResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PCmdEchoResponse message.
         * @function verify
         * @memberof v1.PCmdEchoResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PCmdEchoResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.commonResponse != null && message.hasOwnProperty("commonResponse")) {
                var error = $root.v1.PCmdResponse.verify(message.commonResponse);
                if (error)
                    return "commonResponse." + error;
            }
            if (message.message != null && message.hasOwnProperty("message"))
                if (!$util.isString(message.message))
                    return "message: string expected";
            return null;
        };

        /**
         * Creates a PCmdEchoResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PCmdEchoResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PCmdEchoResponse} PCmdEchoResponse
         */
        PCmdEchoResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PCmdEchoResponse)
                return object;
            var message = new $root.v1.PCmdEchoResponse();
            if (object.commonResponse != null) {
                if (typeof object.commonResponse !== "object")
                    throw TypeError(".v1.PCmdEchoResponse.commonResponse: object expected");
                message.commonResponse = $root.v1.PCmdResponse.fromObject(object.commonResponse);
            }
            if (object.message != null)
                message.message = String(object.message);
            return message;
        };

        /**
         * Creates a plain object from a PCmdEchoResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PCmdEchoResponse
         * @static
         * @param {v1.PCmdEchoResponse} message PCmdEchoResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PCmdEchoResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.commonResponse = null;
                object.message = "";
            }
            if (message.commonResponse != null && message.hasOwnProperty("commonResponse"))
                object.commonResponse = $root.v1.PCmdResponse.toObject(message.commonResponse, options);
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = message.message;
            return object;
        };

        /**
         * Converts this PCmdEchoResponse to JSON.
         * @function toJSON
         * @memberof v1.PCmdEchoResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PCmdEchoResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PCmdEchoResponse;
    })();

    v1.PCmdActiveThreadDump = (function() {

        /**
         * Properties of a PCmdActiveThreadDump.
         * @memberof v1
         * @interface IPCmdActiveThreadDump
         * @property {number|null} [limit] PCmdActiveThreadDump limit
         * @property {Array.<string>|null} [threadName] PCmdActiveThreadDump threadName
         * @property {Array.<number|Long>|null} [localTraceId] PCmdActiveThreadDump localTraceId
         */

        /**
         * Constructs a new PCmdActiveThreadDump.
         * @memberof v1
         * @classdesc Represents a PCmdActiveThreadDump.
         * @implements IPCmdActiveThreadDump
         * @constructor
         * @param {v1.IPCmdActiveThreadDump=} [properties] Properties to set
         */
        function PCmdActiveThreadDump(properties) {
            this.threadName = [];
            this.localTraceId = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PCmdActiveThreadDump limit.
         * @member {number} limit
         * @memberof v1.PCmdActiveThreadDump
         * @instance
         */
        PCmdActiveThreadDump.prototype.limit = 0;

        /**
         * PCmdActiveThreadDump threadName.
         * @member {Array.<string>} threadName
         * @memberof v1.PCmdActiveThreadDump
         * @instance
         */
        PCmdActiveThreadDump.prototype.threadName = $util.emptyArray;

        /**
         * PCmdActiveThreadDump localTraceId.
         * @member {Array.<number|Long>} localTraceId
         * @memberof v1.PCmdActiveThreadDump
         * @instance
         */
        PCmdActiveThreadDump.prototype.localTraceId = $util.emptyArray;

        /**
         * Creates a new PCmdActiveThreadDump instance using the specified properties.
         * @function create
         * @memberof v1.PCmdActiveThreadDump
         * @static
         * @param {v1.IPCmdActiveThreadDump=} [properties] Properties to set
         * @returns {v1.PCmdActiveThreadDump} PCmdActiveThreadDump instance
         */
        PCmdActiveThreadDump.create = function create(properties) {
            return new PCmdActiveThreadDump(properties);
        };

        /**
         * Encodes the specified PCmdActiveThreadDump message. Does not implicitly {@link v1.PCmdActiveThreadDump.verify|verify} messages.
         * @function encode
         * @memberof v1.PCmdActiveThreadDump
         * @static
         * @param {v1.IPCmdActiveThreadDump} message PCmdActiveThreadDump message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PCmdActiveThreadDump.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.limit != null && message.hasOwnProperty("limit"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.limit);
            if (message.threadName != null && message.threadName.length)
                for (var i = 0; i < message.threadName.length; ++i)
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.threadName[i]);
            if (message.localTraceId != null && message.localTraceId.length) {
                writer.uint32(/* id 3, wireType 2 =*/26).fork();
                for (var i = 0; i < message.localTraceId.length; ++i)
                    writer.int64(message.localTraceId[i]);
                writer.ldelim();
            }
            return writer;
        };

        /**
         * Encodes the specified PCmdActiveThreadDump message, length delimited. Does not implicitly {@link v1.PCmdActiveThreadDump.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PCmdActiveThreadDump
         * @static
         * @param {v1.IPCmdActiveThreadDump} message PCmdActiveThreadDump message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PCmdActiveThreadDump.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PCmdActiveThreadDump message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PCmdActiveThreadDump
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PCmdActiveThreadDump} PCmdActiveThreadDump
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PCmdActiveThreadDump.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PCmdActiveThreadDump();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.limit = reader.int32();
                    break;
                case 2:
                    if (!(message.threadName && message.threadName.length))
                        message.threadName = [];
                    message.threadName.push(reader.string());
                    break;
                case 3:
                    if (!(message.localTraceId && message.localTraceId.length))
                        message.localTraceId = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.localTraceId.push(reader.int64());
                    } else
                        message.localTraceId.push(reader.int64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PCmdActiveThreadDump message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PCmdActiveThreadDump
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PCmdActiveThreadDump} PCmdActiveThreadDump
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PCmdActiveThreadDump.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PCmdActiveThreadDump message.
         * @function verify
         * @memberof v1.PCmdActiveThreadDump
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PCmdActiveThreadDump.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.limit != null && message.hasOwnProperty("limit"))
                if (!$util.isInteger(message.limit))
                    return "limit: integer expected";
            if (message.threadName != null && message.hasOwnProperty("threadName")) {
                if (!Array.isArray(message.threadName))
                    return "threadName: array expected";
                for (var i = 0; i < message.threadName.length; ++i)
                    if (!$util.isString(message.threadName[i]))
                        return "threadName: string[] expected";
            }
            if (message.localTraceId != null && message.hasOwnProperty("localTraceId")) {
                if (!Array.isArray(message.localTraceId))
                    return "localTraceId: array expected";
                for (var i = 0; i < message.localTraceId.length; ++i)
                    if (!$util.isInteger(message.localTraceId[i]) && !(message.localTraceId[i] && $util.isInteger(message.localTraceId[i].low) && $util.isInteger(message.localTraceId[i].high)))
                        return "localTraceId: integer|Long[] expected";
            }
            return null;
        };

        /**
         * Creates a PCmdActiveThreadDump message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PCmdActiveThreadDump
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PCmdActiveThreadDump} PCmdActiveThreadDump
         */
        PCmdActiveThreadDump.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PCmdActiveThreadDump)
                return object;
            var message = new $root.v1.PCmdActiveThreadDump();
            if (object.limit != null)
                message.limit = object.limit | 0;
            if (object.threadName) {
                if (!Array.isArray(object.threadName))
                    throw TypeError(".v1.PCmdActiveThreadDump.threadName: array expected");
                message.threadName = [];
                for (var i = 0; i < object.threadName.length; ++i)
                    message.threadName[i] = String(object.threadName[i]);
            }
            if (object.localTraceId) {
                if (!Array.isArray(object.localTraceId))
                    throw TypeError(".v1.PCmdActiveThreadDump.localTraceId: array expected");
                message.localTraceId = [];
                for (var i = 0; i < object.localTraceId.length; ++i)
                    if ($util.Long)
                        (message.localTraceId[i] = $util.Long.fromValue(object.localTraceId[i])).unsigned = false;
                    else if (typeof object.localTraceId[i] === "string")
                        message.localTraceId[i] = parseInt(object.localTraceId[i], 10);
                    else if (typeof object.localTraceId[i] === "number")
                        message.localTraceId[i] = object.localTraceId[i];
                    else if (typeof object.localTraceId[i] === "object")
                        message.localTraceId[i] = new $util.LongBits(object.localTraceId[i].low >>> 0, object.localTraceId[i].high >>> 0).toNumber();
            }
            return message;
        };

        /**
         * Creates a plain object from a PCmdActiveThreadDump message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PCmdActiveThreadDump
         * @static
         * @param {v1.PCmdActiveThreadDump} message PCmdActiveThreadDump
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PCmdActiveThreadDump.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.threadName = [];
                object.localTraceId = [];
            }
            if (options.defaults)
                object.limit = 0;
            if (message.limit != null && message.hasOwnProperty("limit"))
                object.limit = message.limit;
            if (message.threadName && message.threadName.length) {
                object.threadName = [];
                for (var j = 0; j < message.threadName.length; ++j)
                    object.threadName[j] = message.threadName[j];
            }
            if (message.localTraceId && message.localTraceId.length) {
                object.localTraceId = [];
                for (var j = 0; j < message.localTraceId.length; ++j)
                    if (typeof message.localTraceId[j] === "number")
                        object.localTraceId[j] = options.longs === String ? String(message.localTraceId[j]) : message.localTraceId[j];
                    else
                        object.localTraceId[j] = options.longs === String ? $util.Long.prototype.toString.call(message.localTraceId[j]) : options.longs === Number ? new $util.LongBits(message.localTraceId[j].low >>> 0, message.localTraceId[j].high >>> 0).toNumber() : message.localTraceId[j];
            }
            return object;
        };

        /**
         * Converts this PCmdActiveThreadDump to JSON.
         * @function toJSON
         * @memberof v1.PCmdActiveThreadDump
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PCmdActiveThreadDump.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PCmdActiveThreadDump;
    })();

    v1.PCmdActiveThreadDumpRes = (function() {

        /**
         * Properties of a PCmdActiveThreadDumpRes.
         * @memberof v1
         * @interface IPCmdActiveThreadDumpRes
         * @property {v1.IPCmdResponse|null} [commonResponse] PCmdActiveThreadDumpRes commonResponse
         * @property {Array.<v1.IPActiveThreadDump>|null} [threadDump] PCmdActiveThreadDumpRes threadDump
         * @property {string|null} [type] PCmdActiveThreadDumpRes type
         * @property {string|null} [subType] PCmdActiveThreadDumpRes subType
         * @property {string|null} [version] PCmdActiveThreadDumpRes version
         */

        /**
         * Constructs a new PCmdActiveThreadDumpRes.
         * @memberof v1
         * @classdesc Represents a PCmdActiveThreadDumpRes.
         * @implements IPCmdActiveThreadDumpRes
         * @constructor
         * @param {v1.IPCmdActiveThreadDumpRes=} [properties] Properties to set
         */
        function PCmdActiveThreadDumpRes(properties) {
            this.threadDump = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PCmdActiveThreadDumpRes commonResponse.
         * @member {v1.IPCmdResponse|null|undefined} commonResponse
         * @memberof v1.PCmdActiveThreadDumpRes
         * @instance
         */
        PCmdActiveThreadDumpRes.prototype.commonResponse = null;

        /**
         * PCmdActiveThreadDumpRes threadDump.
         * @member {Array.<v1.IPActiveThreadDump>} threadDump
         * @memberof v1.PCmdActiveThreadDumpRes
         * @instance
         */
        PCmdActiveThreadDumpRes.prototype.threadDump = $util.emptyArray;

        /**
         * PCmdActiveThreadDumpRes type.
         * @member {string} type
         * @memberof v1.PCmdActiveThreadDumpRes
         * @instance
         */
        PCmdActiveThreadDumpRes.prototype.type = "";

        /**
         * PCmdActiveThreadDumpRes subType.
         * @member {string} subType
         * @memberof v1.PCmdActiveThreadDumpRes
         * @instance
         */
        PCmdActiveThreadDumpRes.prototype.subType = "";

        /**
         * PCmdActiveThreadDumpRes version.
         * @member {string} version
         * @memberof v1.PCmdActiveThreadDumpRes
         * @instance
         */
        PCmdActiveThreadDumpRes.prototype.version = "";

        /**
         * Creates a new PCmdActiveThreadDumpRes instance using the specified properties.
         * @function create
         * @memberof v1.PCmdActiveThreadDumpRes
         * @static
         * @param {v1.IPCmdActiveThreadDumpRes=} [properties] Properties to set
         * @returns {v1.PCmdActiveThreadDumpRes} PCmdActiveThreadDumpRes instance
         */
        PCmdActiveThreadDumpRes.create = function create(properties) {
            return new PCmdActiveThreadDumpRes(properties);
        };

        /**
         * Encodes the specified PCmdActiveThreadDumpRes message. Does not implicitly {@link v1.PCmdActiveThreadDumpRes.verify|verify} messages.
         * @function encode
         * @memberof v1.PCmdActiveThreadDumpRes
         * @static
         * @param {v1.IPCmdActiveThreadDumpRes} message PCmdActiveThreadDumpRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PCmdActiveThreadDumpRes.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.commonResponse != null && message.hasOwnProperty("commonResponse"))
                $root.v1.PCmdResponse.encode(message.commonResponse, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.threadDump != null && message.threadDump.length)
                for (var i = 0; i < message.threadDump.length; ++i)
                    $root.v1.PActiveThreadDump.encode(message.threadDump[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.type != null && message.hasOwnProperty("type"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.type);
            if (message.subType != null && message.hasOwnProperty("subType"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.subType);
            if (message.version != null && message.hasOwnProperty("version"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.version);
            return writer;
        };

        /**
         * Encodes the specified PCmdActiveThreadDumpRes message, length delimited. Does not implicitly {@link v1.PCmdActiveThreadDumpRes.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PCmdActiveThreadDumpRes
         * @static
         * @param {v1.IPCmdActiveThreadDumpRes} message PCmdActiveThreadDumpRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PCmdActiveThreadDumpRes.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PCmdActiveThreadDumpRes message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PCmdActiveThreadDumpRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PCmdActiveThreadDumpRes} PCmdActiveThreadDumpRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PCmdActiveThreadDumpRes.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PCmdActiveThreadDumpRes();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.commonResponse = $root.v1.PCmdResponse.decode(reader, reader.uint32());
                    break;
                case 2:
                    if (!(message.threadDump && message.threadDump.length))
                        message.threadDump = [];
                    message.threadDump.push($root.v1.PActiveThreadDump.decode(reader, reader.uint32()));
                    break;
                case 3:
                    message.type = reader.string();
                    break;
                case 4:
                    message.subType = reader.string();
                    break;
                case 5:
                    message.version = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PCmdActiveThreadDumpRes message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PCmdActiveThreadDumpRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PCmdActiveThreadDumpRes} PCmdActiveThreadDumpRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PCmdActiveThreadDumpRes.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PCmdActiveThreadDumpRes message.
         * @function verify
         * @memberof v1.PCmdActiveThreadDumpRes
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PCmdActiveThreadDumpRes.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.commonResponse != null && message.hasOwnProperty("commonResponse")) {
                var error = $root.v1.PCmdResponse.verify(message.commonResponse);
                if (error)
                    return "commonResponse." + error;
            }
            if (message.threadDump != null && message.hasOwnProperty("threadDump")) {
                if (!Array.isArray(message.threadDump))
                    return "threadDump: array expected";
                for (var i = 0; i < message.threadDump.length; ++i) {
                    var error = $root.v1.PActiveThreadDump.verify(message.threadDump[i]);
                    if (error)
                        return "threadDump." + error;
                }
            }
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isString(message.type))
                    return "type: string expected";
            if (message.subType != null && message.hasOwnProperty("subType"))
                if (!$util.isString(message.subType))
                    return "subType: string expected";
            if (message.version != null && message.hasOwnProperty("version"))
                if (!$util.isString(message.version))
                    return "version: string expected";
            return null;
        };

        /**
         * Creates a PCmdActiveThreadDumpRes message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PCmdActiveThreadDumpRes
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PCmdActiveThreadDumpRes} PCmdActiveThreadDumpRes
         */
        PCmdActiveThreadDumpRes.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PCmdActiveThreadDumpRes)
                return object;
            var message = new $root.v1.PCmdActiveThreadDumpRes();
            if (object.commonResponse != null) {
                if (typeof object.commonResponse !== "object")
                    throw TypeError(".v1.PCmdActiveThreadDumpRes.commonResponse: object expected");
                message.commonResponse = $root.v1.PCmdResponse.fromObject(object.commonResponse);
            }
            if (object.threadDump) {
                if (!Array.isArray(object.threadDump))
                    throw TypeError(".v1.PCmdActiveThreadDumpRes.threadDump: array expected");
                message.threadDump = [];
                for (var i = 0; i < object.threadDump.length; ++i) {
                    if (typeof object.threadDump[i] !== "object")
                        throw TypeError(".v1.PCmdActiveThreadDumpRes.threadDump: object expected");
                    message.threadDump[i] = $root.v1.PActiveThreadDump.fromObject(object.threadDump[i]);
                }
            }
            if (object.type != null)
                message.type = String(object.type);
            if (object.subType != null)
                message.subType = String(object.subType);
            if (object.version != null)
                message.version = String(object.version);
            return message;
        };

        /**
         * Creates a plain object from a PCmdActiveThreadDumpRes message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PCmdActiveThreadDumpRes
         * @static
         * @param {v1.PCmdActiveThreadDumpRes} message PCmdActiveThreadDumpRes
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PCmdActiveThreadDumpRes.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.threadDump = [];
            if (options.defaults) {
                object.commonResponse = null;
                object.type = "";
                object.subType = "";
                object.version = "";
            }
            if (message.commonResponse != null && message.hasOwnProperty("commonResponse"))
                object.commonResponse = $root.v1.PCmdResponse.toObject(message.commonResponse, options);
            if (message.threadDump && message.threadDump.length) {
                object.threadDump = [];
                for (var j = 0; j < message.threadDump.length; ++j)
                    object.threadDump[j] = $root.v1.PActiveThreadDump.toObject(message.threadDump[j], options);
            }
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            if (message.subType != null && message.hasOwnProperty("subType"))
                object.subType = message.subType;
            if (message.version != null && message.hasOwnProperty("version"))
                object.version = message.version;
            return object;
        };

        /**
         * Converts this PCmdActiveThreadDumpRes to JSON.
         * @function toJSON
         * @memberof v1.PCmdActiveThreadDumpRes
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PCmdActiveThreadDumpRes.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PCmdActiveThreadDumpRes;
    })();

    v1.PCmdActiveThreadLightDump = (function() {

        /**
         * Properties of a PCmdActiveThreadLightDump.
         * @memberof v1
         * @interface IPCmdActiveThreadLightDump
         * @property {number|null} [limit] PCmdActiveThreadLightDump limit
         * @property {Array.<string>|null} [threadName] PCmdActiveThreadLightDump threadName
         * @property {Array.<number|Long>|null} [localTraceId] PCmdActiveThreadLightDump localTraceId
         */

        /**
         * Constructs a new PCmdActiveThreadLightDump.
         * @memberof v1
         * @classdesc Represents a PCmdActiveThreadLightDump.
         * @implements IPCmdActiveThreadLightDump
         * @constructor
         * @param {v1.IPCmdActiveThreadLightDump=} [properties] Properties to set
         */
        function PCmdActiveThreadLightDump(properties) {
            this.threadName = [];
            this.localTraceId = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PCmdActiveThreadLightDump limit.
         * @member {number} limit
         * @memberof v1.PCmdActiveThreadLightDump
         * @instance
         */
        PCmdActiveThreadLightDump.prototype.limit = 0;

        /**
         * PCmdActiveThreadLightDump threadName.
         * @member {Array.<string>} threadName
         * @memberof v1.PCmdActiveThreadLightDump
         * @instance
         */
        PCmdActiveThreadLightDump.prototype.threadName = $util.emptyArray;

        /**
         * PCmdActiveThreadLightDump localTraceId.
         * @member {Array.<number|Long>} localTraceId
         * @memberof v1.PCmdActiveThreadLightDump
         * @instance
         */
        PCmdActiveThreadLightDump.prototype.localTraceId = $util.emptyArray;

        /**
         * Creates a new PCmdActiveThreadLightDump instance using the specified properties.
         * @function create
         * @memberof v1.PCmdActiveThreadLightDump
         * @static
         * @param {v1.IPCmdActiveThreadLightDump=} [properties] Properties to set
         * @returns {v1.PCmdActiveThreadLightDump} PCmdActiveThreadLightDump instance
         */
        PCmdActiveThreadLightDump.create = function create(properties) {
            return new PCmdActiveThreadLightDump(properties);
        };

        /**
         * Encodes the specified PCmdActiveThreadLightDump message. Does not implicitly {@link v1.PCmdActiveThreadLightDump.verify|verify} messages.
         * @function encode
         * @memberof v1.PCmdActiveThreadLightDump
         * @static
         * @param {v1.IPCmdActiveThreadLightDump} message PCmdActiveThreadLightDump message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PCmdActiveThreadLightDump.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.limit != null && message.hasOwnProperty("limit"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.limit);
            if (message.threadName != null && message.threadName.length)
                for (var i = 0; i < message.threadName.length; ++i)
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.threadName[i]);
            if (message.localTraceId != null && message.localTraceId.length) {
                writer.uint32(/* id 3, wireType 2 =*/26).fork();
                for (var i = 0; i < message.localTraceId.length; ++i)
                    writer.int64(message.localTraceId[i]);
                writer.ldelim();
            }
            return writer;
        };

        /**
         * Encodes the specified PCmdActiveThreadLightDump message, length delimited. Does not implicitly {@link v1.PCmdActiveThreadLightDump.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PCmdActiveThreadLightDump
         * @static
         * @param {v1.IPCmdActiveThreadLightDump} message PCmdActiveThreadLightDump message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PCmdActiveThreadLightDump.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PCmdActiveThreadLightDump message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PCmdActiveThreadLightDump
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PCmdActiveThreadLightDump} PCmdActiveThreadLightDump
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PCmdActiveThreadLightDump.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PCmdActiveThreadLightDump();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.limit = reader.int32();
                    break;
                case 2:
                    if (!(message.threadName && message.threadName.length))
                        message.threadName = [];
                    message.threadName.push(reader.string());
                    break;
                case 3:
                    if (!(message.localTraceId && message.localTraceId.length))
                        message.localTraceId = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.localTraceId.push(reader.int64());
                    } else
                        message.localTraceId.push(reader.int64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PCmdActiveThreadLightDump message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PCmdActiveThreadLightDump
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PCmdActiveThreadLightDump} PCmdActiveThreadLightDump
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PCmdActiveThreadLightDump.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PCmdActiveThreadLightDump message.
         * @function verify
         * @memberof v1.PCmdActiveThreadLightDump
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PCmdActiveThreadLightDump.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.limit != null && message.hasOwnProperty("limit"))
                if (!$util.isInteger(message.limit))
                    return "limit: integer expected";
            if (message.threadName != null && message.hasOwnProperty("threadName")) {
                if (!Array.isArray(message.threadName))
                    return "threadName: array expected";
                for (var i = 0; i < message.threadName.length; ++i)
                    if (!$util.isString(message.threadName[i]))
                        return "threadName: string[] expected";
            }
            if (message.localTraceId != null && message.hasOwnProperty("localTraceId")) {
                if (!Array.isArray(message.localTraceId))
                    return "localTraceId: array expected";
                for (var i = 0; i < message.localTraceId.length; ++i)
                    if (!$util.isInteger(message.localTraceId[i]) && !(message.localTraceId[i] && $util.isInteger(message.localTraceId[i].low) && $util.isInteger(message.localTraceId[i].high)))
                        return "localTraceId: integer|Long[] expected";
            }
            return null;
        };

        /**
         * Creates a PCmdActiveThreadLightDump message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PCmdActiveThreadLightDump
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PCmdActiveThreadLightDump} PCmdActiveThreadLightDump
         */
        PCmdActiveThreadLightDump.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PCmdActiveThreadLightDump)
                return object;
            var message = new $root.v1.PCmdActiveThreadLightDump();
            if (object.limit != null)
                message.limit = object.limit | 0;
            if (object.threadName) {
                if (!Array.isArray(object.threadName))
                    throw TypeError(".v1.PCmdActiveThreadLightDump.threadName: array expected");
                message.threadName = [];
                for (var i = 0; i < object.threadName.length; ++i)
                    message.threadName[i] = String(object.threadName[i]);
            }
            if (object.localTraceId) {
                if (!Array.isArray(object.localTraceId))
                    throw TypeError(".v1.PCmdActiveThreadLightDump.localTraceId: array expected");
                message.localTraceId = [];
                for (var i = 0; i < object.localTraceId.length; ++i)
                    if ($util.Long)
                        (message.localTraceId[i] = $util.Long.fromValue(object.localTraceId[i])).unsigned = false;
                    else if (typeof object.localTraceId[i] === "string")
                        message.localTraceId[i] = parseInt(object.localTraceId[i], 10);
                    else if (typeof object.localTraceId[i] === "number")
                        message.localTraceId[i] = object.localTraceId[i];
                    else if (typeof object.localTraceId[i] === "object")
                        message.localTraceId[i] = new $util.LongBits(object.localTraceId[i].low >>> 0, object.localTraceId[i].high >>> 0).toNumber();
            }
            return message;
        };

        /**
         * Creates a plain object from a PCmdActiveThreadLightDump message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PCmdActiveThreadLightDump
         * @static
         * @param {v1.PCmdActiveThreadLightDump} message PCmdActiveThreadLightDump
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PCmdActiveThreadLightDump.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.threadName = [];
                object.localTraceId = [];
            }
            if (options.defaults)
                object.limit = 0;
            if (message.limit != null && message.hasOwnProperty("limit"))
                object.limit = message.limit;
            if (message.threadName && message.threadName.length) {
                object.threadName = [];
                for (var j = 0; j < message.threadName.length; ++j)
                    object.threadName[j] = message.threadName[j];
            }
            if (message.localTraceId && message.localTraceId.length) {
                object.localTraceId = [];
                for (var j = 0; j < message.localTraceId.length; ++j)
                    if (typeof message.localTraceId[j] === "number")
                        object.localTraceId[j] = options.longs === String ? String(message.localTraceId[j]) : message.localTraceId[j];
                    else
                        object.localTraceId[j] = options.longs === String ? $util.Long.prototype.toString.call(message.localTraceId[j]) : options.longs === Number ? new $util.LongBits(message.localTraceId[j].low >>> 0, message.localTraceId[j].high >>> 0).toNumber() : message.localTraceId[j];
            }
            return object;
        };

        /**
         * Converts this PCmdActiveThreadLightDump to JSON.
         * @function toJSON
         * @memberof v1.PCmdActiveThreadLightDump
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PCmdActiveThreadLightDump.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PCmdActiveThreadLightDump;
    })();

    v1.PCmdActiveThreadLightDumpRes = (function() {

        /**
         * Properties of a PCmdActiveThreadLightDumpRes.
         * @memberof v1
         * @interface IPCmdActiveThreadLightDumpRes
         * @property {v1.IPCmdResponse|null} [commonResponse] PCmdActiveThreadLightDumpRes commonResponse
         * @property {Array.<v1.IPActiveThreadLightDump>|null} [threadDump] PCmdActiveThreadLightDumpRes threadDump
         * @property {string|null} [type] PCmdActiveThreadLightDumpRes type
         * @property {string|null} [subType] PCmdActiveThreadLightDumpRes subType
         * @property {string|null} [version] PCmdActiveThreadLightDumpRes version
         */

        /**
         * Constructs a new PCmdActiveThreadLightDumpRes.
         * @memberof v1
         * @classdesc Represents a PCmdActiveThreadLightDumpRes.
         * @implements IPCmdActiveThreadLightDumpRes
         * @constructor
         * @param {v1.IPCmdActiveThreadLightDumpRes=} [properties] Properties to set
         */
        function PCmdActiveThreadLightDumpRes(properties) {
            this.threadDump = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PCmdActiveThreadLightDumpRes commonResponse.
         * @member {v1.IPCmdResponse|null|undefined} commonResponse
         * @memberof v1.PCmdActiveThreadLightDumpRes
         * @instance
         */
        PCmdActiveThreadLightDumpRes.prototype.commonResponse = null;

        /**
         * PCmdActiveThreadLightDumpRes threadDump.
         * @member {Array.<v1.IPActiveThreadLightDump>} threadDump
         * @memberof v1.PCmdActiveThreadLightDumpRes
         * @instance
         */
        PCmdActiveThreadLightDumpRes.prototype.threadDump = $util.emptyArray;

        /**
         * PCmdActiveThreadLightDumpRes type.
         * @member {string} type
         * @memberof v1.PCmdActiveThreadLightDumpRes
         * @instance
         */
        PCmdActiveThreadLightDumpRes.prototype.type = "";

        /**
         * PCmdActiveThreadLightDumpRes subType.
         * @member {string} subType
         * @memberof v1.PCmdActiveThreadLightDumpRes
         * @instance
         */
        PCmdActiveThreadLightDumpRes.prototype.subType = "";

        /**
         * PCmdActiveThreadLightDumpRes version.
         * @member {string} version
         * @memberof v1.PCmdActiveThreadLightDumpRes
         * @instance
         */
        PCmdActiveThreadLightDumpRes.prototype.version = "";

        /**
         * Creates a new PCmdActiveThreadLightDumpRes instance using the specified properties.
         * @function create
         * @memberof v1.PCmdActiveThreadLightDumpRes
         * @static
         * @param {v1.IPCmdActiveThreadLightDumpRes=} [properties] Properties to set
         * @returns {v1.PCmdActiveThreadLightDumpRes} PCmdActiveThreadLightDumpRes instance
         */
        PCmdActiveThreadLightDumpRes.create = function create(properties) {
            return new PCmdActiveThreadLightDumpRes(properties);
        };

        /**
         * Encodes the specified PCmdActiveThreadLightDumpRes message. Does not implicitly {@link v1.PCmdActiveThreadLightDumpRes.verify|verify} messages.
         * @function encode
         * @memberof v1.PCmdActiveThreadLightDumpRes
         * @static
         * @param {v1.IPCmdActiveThreadLightDumpRes} message PCmdActiveThreadLightDumpRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PCmdActiveThreadLightDumpRes.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.commonResponse != null && message.hasOwnProperty("commonResponse"))
                $root.v1.PCmdResponse.encode(message.commonResponse, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.threadDump != null && message.threadDump.length)
                for (var i = 0; i < message.threadDump.length; ++i)
                    $root.v1.PActiveThreadLightDump.encode(message.threadDump[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.type != null && message.hasOwnProperty("type"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.type);
            if (message.subType != null && message.hasOwnProperty("subType"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.subType);
            if (message.version != null && message.hasOwnProperty("version"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.version);
            return writer;
        };

        /**
         * Encodes the specified PCmdActiveThreadLightDumpRes message, length delimited. Does not implicitly {@link v1.PCmdActiveThreadLightDumpRes.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PCmdActiveThreadLightDumpRes
         * @static
         * @param {v1.IPCmdActiveThreadLightDumpRes} message PCmdActiveThreadLightDumpRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PCmdActiveThreadLightDumpRes.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PCmdActiveThreadLightDumpRes message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PCmdActiveThreadLightDumpRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PCmdActiveThreadLightDumpRes} PCmdActiveThreadLightDumpRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PCmdActiveThreadLightDumpRes.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PCmdActiveThreadLightDumpRes();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.commonResponse = $root.v1.PCmdResponse.decode(reader, reader.uint32());
                    break;
                case 2:
                    if (!(message.threadDump && message.threadDump.length))
                        message.threadDump = [];
                    message.threadDump.push($root.v1.PActiveThreadLightDump.decode(reader, reader.uint32()));
                    break;
                case 3:
                    message.type = reader.string();
                    break;
                case 4:
                    message.subType = reader.string();
                    break;
                case 5:
                    message.version = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PCmdActiveThreadLightDumpRes message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PCmdActiveThreadLightDumpRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PCmdActiveThreadLightDumpRes} PCmdActiveThreadLightDumpRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PCmdActiveThreadLightDumpRes.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PCmdActiveThreadLightDumpRes message.
         * @function verify
         * @memberof v1.PCmdActiveThreadLightDumpRes
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PCmdActiveThreadLightDumpRes.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.commonResponse != null && message.hasOwnProperty("commonResponse")) {
                var error = $root.v1.PCmdResponse.verify(message.commonResponse);
                if (error)
                    return "commonResponse." + error;
            }
            if (message.threadDump != null && message.hasOwnProperty("threadDump")) {
                if (!Array.isArray(message.threadDump))
                    return "threadDump: array expected";
                for (var i = 0; i < message.threadDump.length; ++i) {
                    var error = $root.v1.PActiveThreadLightDump.verify(message.threadDump[i]);
                    if (error)
                        return "threadDump." + error;
                }
            }
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isString(message.type))
                    return "type: string expected";
            if (message.subType != null && message.hasOwnProperty("subType"))
                if (!$util.isString(message.subType))
                    return "subType: string expected";
            if (message.version != null && message.hasOwnProperty("version"))
                if (!$util.isString(message.version))
                    return "version: string expected";
            return null;
        };

        /**
         * Creates a PCmdActiveThreadLightDumpRes message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PCmdActiveThreadLightDumpRes
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PCmdActiveThreadLightDumpRes} PCmdActiveThreadLightDumpRes
         */
        PCmdActiveThreadLightDumpRes.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PCmdActiveThreadLightDumpRes)
                return object;
            var message = new $root.v1.PCmdActiveThreadLightDumpRes();
            if (object.commonResponse != null) {
                if (typeof object.commonResponse !== "object")
                    throw TypeError(".v1.PCmdActiveThreadLightDumpRes.commonResponse: object expected");
                message.commonResponse = $root.v1.PCmdResponse.fromObject(object.commonResponse);
            }
            if (object.threadDump) {
                if (!Array.isArray(object.threadDump))
                    throw TypeError(".v1.PCmdActiveThreadLightDumpRes.threadDump: array expected");
                message.threadDump = [];
                for (var i = 0; i < object.threadDump.length; ++i) {
                    if (typeof object.threadDump[i] !== "object")
                        throw TypeError(".v1.PCmdActiveThreadLightDumpRes.threadDump: object expected");
                    message.threadDump[i] = $root.v1.PActiveThreadLightDump.fromObject(object.threadDump[i]);
                }
            }
            if (object.type != null)
                message.type = String(object.type);
            if (object.subType != null)
                message.subType = String(object.subType);
            if (object.version != null)
                message.version = String(object.version);
            return message;
        };

        /**
         * Creates a plain object from a PCmdActiveThreadLightDumpRes message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PCmdActiveThreadLightDumpRes
         * @static
         * @param {v1.PCmdActiveThreadLightDumpRes} message PCmdActiveThreadLightDumpRes
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PCmdActiveThreadLightDumpRes.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.threadDump = [];
            if (options.defaults) {
                object.commonResponse = null;
                object.type = "";
                object.subType = "";
                object.version = "";
            }
            if (message.commonResponse != null && message.hasOwnProperty("commonResponse"))
                object.commonResponse = $root.v1.PCmdResponse.toObject(message.commonResponse, options);
            if (message.threadDump && message.threadDump.length) {
                object.threadDump = [];
                for (var j = 0; j < message.threadDump.length; ++j)
                    object.threadDump[j] = $root.v1.PActiveThreadLightDump.toObject(message.threadDump[j], options);
            }
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            if (message.subType != null && message.hasOwnProperty("subType"))
                object.subType = message.subType;
            if (message.version != null && message.hasOwnProperty("version"))
                object.version = message.version;
            return object;
        };

        /**
         * Converts this PCmdActiveThreadLightDumpRes to JSON.
         * @function toJSON
         * @memberof v1.PCmdActiveThreadLightDumpRes
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PCmdActiveThreadLightDumpRes.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PCmdActiveThreadLightDumpRes;
    })();

    v1.PCmdActiveThreadCount = (function() {

        /**
         * Properties of a PCmdActiveThreadCount.
         * @memberof v1
         * @interface IPCmdActiveThreadCount
         */

        /**
         * Constructs a new PCmdActiveThreadCount.
         * @memberof v1
         * @classdesc Represents a PCmdActiveThreadCount.
         * @implements IPCmdActiveThreadCount
         * @constructor
         * @param {v1.IPCmdActiveThreadCount=} [properties] Properties to set
         */
        function PCmdActiveThreadCount(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new PCmdActiveThreadCount instance using the specified properties.
         * @function create
         * @memberof v1.PCmdActiveThreadCount
         * @static
         * @param {v1.IPCmdActiveThreadCount=} [properties] Properties to set
         * @returns {v1.PCmdActiveThreadCount} PCmdActiveThreadCount instance
         */
        PCmdActiveThreadCount.create = function create(properties) {
            return new PCmdActiveThreadCount(properties);
        };

        /**
         * Encodes the specified PCmdActiveThreadCount message. Does not implicitly {@link v1.PCmdActiveThreadCount.verify|verify} messages.
         * @function encode
         * @memberof v1.PCmdActiveThreadCount
         * @static
         * @param {v1.IPCmdActiveThreadCount} message PCmdActiveThreadCount message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PCmdActiveThreadCount.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified PCmdActiveThreadCount message, length delimited. Does not implicitly {@link v1.PCmdActiveThreadCount.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PCmdActiveThreadCount
         * @static
         * @param {v1.IPCmdActiveThreadCount} message PCmdActiveThreadCount message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PCmdActiveThreadCount.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PCmdActiveThreadCount message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PCmdActiveThreadCount
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PCmdActiveThreadCount} PCmdActiveThreadCount
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PCmdActiveThreadCount.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PCmdActiveThreadCount();
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
         * Decodes a PCmdActiveThreadCount message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PCmdActiveThreadCount
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PCmdActiveThreadCount} PCmdActiveThreadCount
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PCmdActiveThreadCount.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PCmdActiveThreadCount message.
         * @function verify
         * @memberof v1.PCmdActiveThreadCount
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PCmdActiveThreadCount.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a PCmdActiveThreadCount message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PCmdActiveThreadCount
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PCmdActiveThreadCount} PCmdActiveThreadCount
         */
        PCmdActiveThreadCount.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PCmdActiveThreadCount)
                return object;
            return new $root.v1.PCmdActiveThreadCount();
        };

        /**
         * Creates a plain object from a PCmdActiveThreadCount message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PCmdActiveThreadCount
         * @static
         * @param {v1.PCmdActiveThreadCount} message PCmdActiveThreadCount
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PCmdActiveThreadCount.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this PCmdActiveThreadCount to JSON.
         * @function toJSON
         * @memberof v1.PCmdActiveThreadCount
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PCmdActiveThreadCount.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PCmdActiveThreadCount;
    })();

    v1.PCmdActiveThreadCountRes = (function() {

        /**
         * Properties of a PCmdActiveThreadCountRes.
         * @memberof v1
         * @interface IPCmdActiveThreadCountRes
         * @property {v1.IPCmdStreamResponse|null} [commonStreamResponse] PCmdActiveThreadCountRes commonStreamResponse
         * @property {number|null} [histogramSchemaType] PCmdActiveThreadCountRes histogramSchemaType
         * @property {Array.<number>|null} [activeThreadCount] PCmdActiveThreadCountRes activeThreadCount
         * @property {number|Long|null} [timeStamp] PCmdActiveThreadCountRes timeStamp
         */

        /**
         * Constructs a new PCmdActiveThreadCountRes.
         * @memberof v1
         * @classdesc Represents a PCmdActiveThreadCountRes.
         * @implements IPCmdActiveThreadCountRes
         * @constructor
         * @param {v1.IPCmdActiveThreadCountRes=} [properties] Properties to set
         */
        function PCmdActiveThreadCountRes(properties) {
            this.activeThreadCount = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PCmdActiveThreadCountRes commonStreamResponse.
         * @member {v1.IPCmdStreamResponse|null|undefined} commonStreamResponse
         * @memberof v1.PCmdActiveThreadCountRes
         * @instance
         */
        PCmdActiveThreadCountRes.prototype.commonStreamResponse = null;

        /**
         * PCmdActiveThreadCountRes histogramSchemaType.
         * @member {number} histogramSchemaType
         * @memberof v1.PCmdActiveThreadCountRes
         * @instance
         */
        PCmdActiveThreadCountRes.prototype.histogramSchemaType = 0;

        /**
         * PCmdActiveThreadCountRes activeThreadCount.
         * @member {Array.<number>} activeThreadCount
         * @memberof v1.PCmdActiveThreadCountRes
         * @instance
         */
        PCmdActiveThreadCountRes.prototype.activeThreadCount = $util.emptyArray;

        /**
         * PCmdActiveThreadCountRes timeStamp.
         * @member {number|Long} timeStamp
         * @memberof v1.PCmdActiveThreadCountRes
         * @instance
         */
        PCmdActiveThreadCountRes.prototype.timeStamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new PCmdActiveThreadCountRes instance using the specified properties.
         * @function create
         * @memberof v1.PCmdActiveThreadCountRes
         * @static
         * @param {v1.IPCmdActiveThreadCountRes=} [properties] Properties to set
         * @returns {v1.PCmdActiveThreadCountRes} PCmdActiveThreadCountRes instance
         */
        PCmdActiveThreadCountRes.create = function create(properties) {
            return new PCmdActiveThreadCountRes(properties);
        };

        /**
         * Encodes the specified PCmdActiveThreadCountRes message. Does not implicitly {@link v1.PCmdActiveThreadCountRes.verify|verify} messages.
         * @function encode
         * @memberof v1.PCmdActiveThreadCountRes
         * @static
         * @param {v1.IPCmdActiveThreadCountRes} message PCmdActiveThreadCountRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PCmdActiveThreadCountRes.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.commonStreamResponse != null && message.hasOwnProperty("commonStreamResponse"))
                $root.v1.PCmdStreamResponse.encode(message.commonStreamResponse, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.histogramSchemaType != null && message.hasOwnProperty("histogramSchemaType"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.histogramSchemaType);
            if (message.activeThreadCount != null && message.activeThreadCount.length) {
                writer.uint32(/* id 3, wireType 2 =*/26).fork();
                for (var i = 0; i < message.activeThreadCount.length; ++i)
                    writer.int32(message.activeThreadCount[i]);
                writer.ldelim();
            }
            if (message.timeStamp != null && message.hasOwnProperty("timeStamp"))
                writer.uint32(/* id 4, wireType 0 =*/32).int64(message.timeStamp);
            return writer;
        };

        /**
         * Encodes the specified PCmdActiveThreadCountRes message, length delimited. Does not implicitly {@link v1.PCmdActiveThreadCountRes.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PCmdActiveThreadCountRes
         * @static
         * @param {v1.IPCmdActiveThreadCountRes} message PCmdActiveThreadCountRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PCmdActiveThreadCountRes.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PCmdActiveThreadCountRes message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PCmdActiveThreadCountRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PCmdActiveThreadCountRes} PCmdActiveThreadCountRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PCmdActiveThreadCountRes.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PCmdActiveThreadCountRes();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.commonStreamResponse = $root.v1.PCmdStreamResponse.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.histogramSchemaType = reader.int32();
                    break;
                case 3:
                    if (!(message.activeThreadCount && message.activeThreadCount.length))
                        message.activeThreadCount = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.activeThreadCount.push(reader.int32());
                    } else
                        message.activeThreadCount.push(reader.int32());
                    break;
                case 4:
                    message.timeStamp = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PCmdActiveThreadCountRes message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PCmdActiveThreadCountRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PCmdActiveThreadCountRes} PCmdActiveThreadCountRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PCmdActiveThreadCountRes.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PCmdActiveThreadCountRes message.
         * @function verify
         * @memberof v1.PCmdActiveThreadCountRes
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PCmdActiveThreadCountRes.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.commonStreamResponse != null && message.hasOwnProperty("commonStreamResponse")) {
                var error = $root.v1.PCmdStreamResponse.verify(message.commonStreamResponse);
                if (error)
                    return "commonStreamResponse." + error;
            }
            if (message.histogramSchemaType != null && message.hasOwnProperty("histogramSchemaType"))
                if (!$util.isInteger(message.histogramSchemaType))
                    return "histogramSchemaType: integer expected";
            if (message.activeThreadCount != null && message.hasOwnProperty("activeThreadCount")) {
                if (!Array.isArray(message.activeThreadCount))
                    return "activeThreadCount: array expected";
                for (var i = 0; i < message.activeThreadCount.length; ++i)
                    if (!$util.isInteger(message.activeThreadCount[i]))
                        return "activeThreadCount: integer[] expected";
            }
            if (message.timeStamp != null && message.hasOwnProperty("timeStamp"))
                if (!$util.isInteger(message.timeStamp) && !(message.timeStamp && $util.isInteger(message.timeStamp.low) && $util.isInteger(message.timeStamp.high)))
                    return "timeStamp: integer|Long expected";
            return null;
        };

        /**
         * Creates a PCmdActiveThreadCountRes message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PCmdActiveThreadCountRes
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PCmdActiveThreadCountRes} PCmdActiveThreadCountRes
         */
        PCmdActiveThreadCountRes.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PCmdActiveThreadCountRes)
                return object;
            var message = new $root.v1.PCmdActiveThreadCountRes();
            if (object.commonStreamResponse != null) {
                if (typeof object.commonStreamResponse !== "object")
                    throw TypeError(".v1.PCmdActiveThreadCountRes.commonStreamResponse: object expected");
                message.commonStreamResponse = $root.v1.PCmdStreamResponse.fromObject(object.commonStreamResponse);
            }
            if (object.histogramSchemaType != null)
                message.histogramSchemaType = object.histogramSchemaType | 0;
            if (object.activeThreadCount) {
                if (!Array.isArray(object.activeThreadCount))
                    throw TypeError(".v1.PCmdActiveThreadCountRes.activeThreadCount: array expected");
                message.activeThreadCount = [];
                for (var i = 0; i < object.activeThreadCount.length; ++i)
                    message.activeThreadCount[i] = object.activeThreadCount[i] | 0;
            }
            if (object.timeStamp != null)
                if ($util.Long)
                    (message.timeStamp = $util.Long.fromValue(object.timeStamp)).unsigned = false;
                else if (typeof object.timeStamp === "string")
                    message.timeStamp = parseInt(object.timeStamp, 10);
                else if (typeof object.timeStamp === "number")
                    message.timeStamp = object.timeStamp;
                else if (typeof object.timeStamp === "object")
                    message.timeStamp = new $util.LongBits(object.timeStamp.low >>> 0, object.timeStamp.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a PCmdActiveThreadCountRes message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PCmdActiveThreadCountRes
         * @static
         * @param {v1.PCmdActiveThreadCountRes} message PCmdActiveThreadCountRes
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PCmdActiveThreadCountRes.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.activeThreadCount = [];
            if (options.defaults) {
                object.commonStreamResponse = null;
                object.histogramSchemaType = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timeStamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timeStamp = options.longs === String ? "0" : 0;
            }
            if (message.commonStreamResponse != null && message.hasOwnProperty("commonStreamResponse"))
                object.commonStreamResponse = $root.v1.PCmdStreamResponse.toObject(message.commonStreamResponse, options);
            if (message.histogramSchemaType != null && message.hasOwnProperty("histogramSchemaType"))
                object.histogramSchemaType = message.histogramSchemaType;
            if (message.activeThreadCount && message.activeThreadCount.length) {
                object.activeThreadCount = [];
                for (var j = 0; j < message.activeThreadCount.length; ++j)
                    object.activeThreadCount[j] = message.activeThreadCount[j];
            }
            if (message.timeStamp != null && message.hasOwnProperty("timeStamp"))
                if (typeof message.timeStamp === "number")
                    object.timeStamp = options.longs === String ? String(message.timeStamp) : message.timeStamp;
                else
                    object.timeStamp = options.longs === String ? $util.Long.prototype.toString.call(message.timeStamp) : options.longs === Number ? new $util.LongBits(message.timeStamp.low >>> 0, message.timeStamp.high >>> 0).toNumber() : message.timeStamp;
            return object;
        };

        /**
         * Converts this PCmdActiveThreadCountRes to JSON.
         * @function toJSON
         * @memberof v1.PCmdActiveThreadCountRes
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PCmdActiveThreadCountRes.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PCmdActiveThreadCountRes;
    })();

    /**
     * PThreadState enum.
     * @name v1.PThreadState
     * @enum {string}
     * @property {number} THREAD_STATE_NEW=0 THREAD_STATE_NEW value
     * @property {number} THREAD_STATE_RUNNABLE=1 THREAD_STATE_RUNNABLE value
     * @property {number} THREAD_STATE_BLOCKED=2 THREAD_STATE_BLOCKED value
     * @property {number} THREAD_STATE_WAITING=3 THREAD_STATE_WAITING value
     * @property {number} THREAD_STATE_TIMED_WAITING=4 THREAD_STATE_TIMED_WAITING value
     * @property {number} THREAD_STATE_TERMINATED=5 THREAD_STATE_TERMINATED value
     * @property {number} THREAD_STATE_UNKNOWN=6 THREAD_STATE_UNKNOWN value
     */
    v1.PThreadState = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "THREAD_STATE_NEW"] = 0;
        values[valuesById[1] = "THREAD_STATE_RUNNABLE"] = 1;
        values[valuesById[2] = "THREAD_STATE_BLOCKED"] = 2;
        values[valuesById[3] = "THREAD_STATE_WAITING"] = 3;
        values[valuesById[4] = "THREAD_STATE_TIMED_WAITING"] = 4;
        values[valuesById[5] = "THREAD_STATE_TERMINATED"] = 5;
        values[valuesById[6] = "THREAD_STATE_UNKNOWN"] = 6;
        return values;
    })();

    v1.PMonitorInfo = (function() {

        /**
         * Properties of a PMonitorInfo.
         * @memberof v1
         * @interface IPMonitorInfo
         * @property {number|null} [stackDepth] PMonitorInfo stackDepth
         * @property {string|null} [stackFrame] PMonitorInfo stackFrame
         */

        /**
         * Constructs a new PMonitorInfo.
         * @memberof v1
         * @classdesc Represents a PMonitorInfo.
         * @implements IPMonitorInfo
         * @constructor
         * @param {v1.IPMonitorInfo=} [properties] Properties to set
         */
        function PMonitorInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PMonitorInfo stackDepth.
         * @member {number} stackDepth
         * @memberof v1.PMonitorInfo
         * @instance
         */
        PMonitorInfo.prototype.stackDepth = 0;

        /**
         * PMonitorInfo stackFrame.
         * @member {string} stackFrame
         * @memberof v1.PMonitorInfo
         * @instance
         */
        PMonitorInfo.prototype.stackFrame = "";

        /**
         * Creates a new PMonitorInfo instance using the specified properties.
         * @function create
         * @memberof v1.PMonitorInfo
         * @static
         * @param {v1.IPMonitorInfo=} [properties] Properties to set
         * @returns {v1.PMonitorInfo} PMonitorInfo instance
         */
        PMonitorInfo.create = function create(properties) {
            return new PMonitorInfo(properties);
        };

        /**
         * Encodes the specified PMonitorInfo message. Does not implicitly {@link v1.PMonitorInfo.verify|verify} messages.
         * @function encode
         * @memberof v1.PMonitorInfo
         * @static
         * @param {v1.IPMonitorInfo} message PMonitorInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PMonitorInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.stackDepth != null && message.hasOwnProperty("stackDepth"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.stackDepth);
            if (message.stackFrame != null && message.hasOwnProperty("stackFrame"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.stackFrame);
            return writer;
        };

        /**
         * Encodes the specified PMonitorInfo message, length delimited. Does not implicitly {@link v1.PMonitorInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PMonitorInfo
         * @static
         * @param {v1.IPMonitorInfo} message PMonitorInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PMonitorInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PMonitorInfo message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PMonitorInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PMonitorInfo} PMonitorInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PMonitorInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PMonitorInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.stackDepth = reader.int32();
                    break;
                case 2:
                    message.stackFrame = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PMonitorInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PMonitorInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PMonitorInfo} PMonitorInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PMonitorInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PMonitorInfo message.
         * @function verify
         * @memberof v1.PMonitorInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PMonitorInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.stackDepth != null && message.hasOwnProperty("stackDepth"))
                if (!$util.isInteger(message.stackDepth))
                    return "stackDepth: integer expected";
            if (message.stackFrame != null && message.hasOwnProperty("stackFrame"))
                if (!$util.isString(message.stackFrame))
                    return "stackFrame: string expected";
            return null;
        };

        /**
         * Creates a PMonitorInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PMonitorInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PMonitorInfo} PMonitorInfo
         */
        PMonitorInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PMonitorInfo)
                return object;
            var message = new $root.v1.PMonitorInfo();
            if (object.stackDepth != null)
                message.stackDepth = object.stackDepth | 0;
            if (object.stackFrame != null)
                message.stackFrame = String(object.stackFrame);
            return message;
        };

        /**
         * Creates a plain object from a PMonitorInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PMonitorInfo
         * @static
         * @param {v1.PMonitorInfo} message PMonitorInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PMonitorInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.stackDepth = 0;
                object.stackFrame = "";
            }
            if (message.stackDepth != null && message.hasOwnProperty("stackDepth"))
                object.stackDepth = message.stackDepth;
            if (message.stackFrame != null && message.hasOwnProperty("stackFrame"))
                object.stackFrame = message.stackFrame;
            return object;
        };

        /**
         * Converts this PMonitorInfo to JSON.
         * @function toJSON
         * @memberof v1.PMonitorInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PMonitorInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PMonitorInfo;
    })();

    v1.PThreadDump = (function() {

        /**
         * Properties of a PThreadDump.
         * @memberof v1
         * @interface IPThreadDump
         * @property {string|null} [threadName] PThreadDump threadName
         * @property {number|Long|null} [threadId] PThreadDump threadId
         * @property {number|Long|null} [blockedTime] PThreadDump blockedTime
         * @property {number|Long|null} [blockedCount] PThreadDump blockedCount
         * @property {number|Long|null} [waitedTime] PThreadDump waitedTime
         * @property {number|Long|null} [waitedCount] PThreadDump waitedCount
         * @property {string|null} [lockName] PThreadDump lockName
         * @property {number|Long|null} [lockOwnerId] PThreadDump lockOwnerId
         * @property {string|null} [lockOwnerName] PThreadDump lockOwnerName
         * @property {boolean|null} [inNative] PThreadDump inNative
         * @property {boolean|null} [suspended] PThreadDump suspended
         * @property {v1.PThreadState|null} [threadState] PThreadDump threadState
         * @property {Array.<string>|null} [stackTrace] PThreadDump stackTrace
         * @property {Array.<v1.IPMonitorInfo>|null} [lockedMonitor] PThreadDump lockedMonitor
         * @property {Array.<string>|null} [lockedSynchronizer] PThreadDump lockedSynchronizer
         */

        /**
         * Constructs a new PThreadDump.
         * @memberof v1
         * @classdesc Represents a PThreadDump.
         * @implements IPThreadDump
         * @constructor
         * @param {v1.IPThreadDump=} [properties] Properties to set
         */
        function PThreadDump(properties) {
            this.stackTrace = [];
            this.lockedMonitor = [];
            this.lockedSynchronizer = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PThreadDump threadName.
         * @member {string} threadName
         * @memberof v1.PThreadDump
         * @instance
         */
        PThreadDump.prototype.threadName = "";

        /**
         * PThreadDump threadId.
         * @member {number|Long} threadId
         * @memberof v1.PThreadDump
         * @instance
         */
        PThreadDump.prototype.threadId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PThreadDump blockedTime.
         * @member {number|Long} blockedTime
         * @memberof v1.PThreadDump
         * @instance
         */
        PThreadDump.prototype.blockedTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PThreadDump blockedCount.
         * @member {number|Long} blockedCount
         * @memberof v1.PThreadDump
         * @instance
         */
        PThreadDump.prototype.blockedCount = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PThreadDump waitedTime.
         * @member {number|Long} waitedTime
         * @memberof v1.PThreadDump
         * @instance
         */
        PThreadDump.prototype.waitedTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PThreadDump waitedCount.
         * @member {number|Long} waitedCount
         * @memberof v1.PThreadDump
         * @instance
         */
        PThreadDump.prototype.waitedCount = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PThreadDump lockName.
         * @member {string} lockName
         * @memberof v1.PThreadDump
         * @instance
         */
        PThreadDump.prototype.lockName = "";

        /**
         * PThreadDump lockOwnerId.
         * @member {number|Long} lockOwnerId
         * @memberof v1.PThreadDump
         * @instance
         */
        PThreadDump.prototype.lockOwnerId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PThreadDump lockOwnerName.
         * @member {string} lockOwnerName
         * @memberof v1.PThreadDump
         * @instance
         */
        PThreadDump.prototype.lockOwnerName = "";

        /**
         * PThreadDump inNative.
         * @member {boolean} inNative
         * @memberof v1.PThreadDump
         * @instance
         */
        PThreadDump.prototype.inNative = false;

        /**
         * PThreadDump suspended.
         * @member {boolean} suspended
         * @memberof v1.PThreadDump
         * @instance
         */
        PThreadDump.prototype.suspended = false;

        /**
         * PThreadDump threadState.
         * @member {v1.PThreadState} threadState
         * @memberof v1.PThreadDump
         * @instance
         */
        PThreadDump.prototype.threadState = 0;

        /**
         * PThreadDump stackTrace.
         * @member {Array.<string>} stackTrace
         * @memberof v1.PThreadDump
         * @instance
         */
        PThreadDump.prototype.stackTrace = $util.emptyArray;

        /**
         * PThreadDump lockedMonitor.
         * @member {Array.<v1.IPMonitorInfo>} lockedMonitor
         * @memberof v1.PThreadDump
         * @instance
         */
        PThreadDump.prototype.lockedMonitor = $util.emptyArray;

        /**
         * PThreadDump lockedSynchronizer.
         * @member {Array.<string>} lockedSynchronizer
         * @memberof v1.PThreadDump
         * @instance
         */
        PThreadDump.prototype.lockedSynchronizer = $util.emptyArray;

        /**
         * Creates a new PThreadDump instance using the specified properties.
         * @function create
         * @memberof v1.PThreadDump
         * @static
         * @param {v1.IPThreadDump=} [properties] Properties to set
         * @returns {v1.PThreadDump} PThreadDump instance
         */
        PThreadDump.create = function create(properties) {
            return new PThreadDump(properties);
        };

        /**
         * Encodes the specified PThreadDump message. Does not implicitly {@link v1.PThreadDump.verify|verify} messages.
         * @function encode
         * @memberof v1.PThreadDump
         * @static
         * @param {v1.IPThreadDump} message PThreadDump message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PThreadDump.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.threadName != null && message.hasOwnProperty("threadName"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.threadName);
            if (message.threadId != null && message.hasOwnProperty("threadId"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.threadId);
            if (message.blockedTime != null && message.hasOwnProperty("blockedTime"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.blockedTime);
            if (message.blockedCount != null && message.hasOwnProperty("blockedCount"))
                writer.uint32(/* id 4, wireType 0 =*/32).int64(message.blockedCount);
            if (message.waitedTime != null && message.hasOwnProperty("waitedTime"))
                writer.uint32(/* id 5, wireType 0 =*/40).int64(message.waitedTime);
            if (message.waitedCount != null && message.hasOwnProperty("waitedCount"))
                writer.uint32(/* id 6, wireType 0 =*/48).int64(message.waitedCount);
            if (message.lockName != null && message.hasOwnProperty("lockName"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.lockName);
            if (message.lockOwnerId != null && message.hasOwnProperty("lockOwnerId"))
                writer.uint32(/* id 8, wireType 0 =*/64).int64(message.lockOwnerId);
            if (message.lockOwnerName != null && message.hasOwnProperty("lockOwnerName"))
                writer.uint32(/* id 9, wireType 2 =*/74).string(message.lockOwnerName);
            if (message.inNative != null && message.hasOwnProperty("inNative"))
                writer.uint32(/* id 10, wireType 0 =*/80).bool(message.inNative);
            if (message.suspended != null && message.hasOwnProperty("suspended"))
                writer.uint32(/* id 11, wireType 0 =*/88).bool(message.suspended);
            if (message.threadState != null && message.hasOwnProperty("threadState"))
                writer.uint32(/* id 12, wireType 0 =*/96).int32(message.threadState);
            if (message.stackTrace != null && message.stackTrace.length)
                for (var i = 0; i < message.stackTrace.length; ++i)
                    writer.uint32(/* id 13, wireType 2 =*/106).string(message.stackTrace[i]);
            if (message.lockedMonitor != null && message.lockedMonitor.length)
                for (var i = 0; i < message.lockedMonitor.length; ++i)
                    $root.v1.PMonitorInfo.encode(message.lockedMonitor[i], writer.uint32(/* id 14, wireType 2 =*/114).fork()).ldelim();
            if (message.lockedSynchronizer != null && message.lockedSynchronizer.length)
                for (var i = 0; i < message.lockedSynchronizer.length; ++i)
                    writer.uint32(/* id 15, wireType 2 =*/122).string(message.lockedSynchronizer[i]);
            return writer;
        };

        /**
         * Encodes the specified PThreadDump message, length delimited. Does not implicitly {@link v1.PThreadDump.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PThreadDump
         * @static
         * @param {v1.IPThreadDump} message PThreadDump message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PThreadDump.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PThreadDump message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PThreadDump
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PThreadDump} PThreadDump
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PThreadDump.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PThreadDump();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.threadName = reader.string();
                    break;
                case 2:
                    message.threadId = reader.int64();
                    break;
                case 3:
                    message.blockedTime = reader.int64();
                    break;
                case 4:
                    message.blockedCount = reader.int64();
                    break;
                case 5:
                    message.waitedTime = reader.int64();
                    break;
                case 6:
                    message.waitedCount = reader.int64();
                    break;
                case 7:
                    message.lockName = reader.string();
                    break;
                case 8:
                    message.lockOwnerId = reader.int64();
                    break;
                case 9:
                    message.lockOwnerName = reader.string();
                    break;
                case 10:
                    message.inNative = reader.bool();
                    break;
                case 11:
                    message.suspended = reader.bool();
                    break;
                case 12:
                    message.threadState = reader.int32();
                    break;
                case 13:
                    if (!(message.stackTrace && message.stackTrace.length))
                        message.stackTrace = [];
                    message.stackTrace.push(reader.string());
                    break;
                case 14:
                    if (!(message.lockedMonitor && message.lockedMonitor.length))
                        message.lockedMonitor = [];
                    message.lockedMonitor.push($root.v1.PMonitorInfo.decode(reader, reader.uint32()));
                    break;
                case 15:
                    if (!(message.lockedSynchronizer && message.lockedSynchronizer.length))
                        message.lockedSynchronizer = [];
                    message.lockedSynchronizer.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PThreadDump message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PThreadDump
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PThreadDump} PThreadDump
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PThreadDump.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PThreadDump message.
         * @function verify
         * @memberof v1.PThreadDump
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PThreadDump.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.threadName != null && message.hasOwnProperty("threadName"))
                if (!$util.isString(message.threadName))
                    return "threadName: string expected";
            if (message.threadId != null && message.hasOwnProperty("threadId"))
                if (!$util.isInteger(message.threadId) && !(message.threadId && $util.isInteger(message.threadId.low) && $util.isInteger(message.threadId.high)))
                    return "threadId: integer|Long expected";
            if (message.blockedTime != null && message.hasOwnProperty("blockedTime"))
                if (!$util.isInteger(message.blockedTime) && !(message.blockedTime && $util.isInteger(message.blockedTime.low) && $util.isInteger(message.blockedTime.high)))
                    return "blockedTime: integer|Long expected";
            if (message.blockedCount != null && message.hasOwnProperty("blockedCount"))
                if (!$util.isInteger(message.blockedCount) && !(message.blockedCount && $util.isInteger(message.blockedCount.low) && $util.isInteger(message.blockedCount.high)))
                    return "blockedCount: integer|Long expected";
            if (message.waitedTime != null && message.hasOwnProperty("waitedTime"))
                if (!$util.isInteger(message.waitedTime) && !(message.waitedTime && $util.isInteger(message.waitedTime.low) && $util.isInteger(message.waitedTime.high)))
                    return "waitedTime: integer|Long expected";
            if (message.waitedCount != null && message.hasOwnProperty("waitedCount"))
                if (!$util.isInteger(message.waitedCount) && !(message.waitedCount && $util.isInteger(message.waitedCount.low) && $util.isInteger(message.waitedCount.high)))
                    return "waitedCount: integer|Long expected";
            if (message.lockName != null && message.hasOwnProperty("lockName"))
                if (!$util.isString(message.lockName))
                    return "lockName: string expected";
            if (message.lockOwnerId != null && message.hasOwnProperty("lockOwnerId"))
                if (!$util.isInteger(message.lockOwnerId) && !(message.lockOwnerId && $util.isInteger(message.lockOwnerId.low) && $util.isInteger(message.lockOwnerId.high)))
                    return "lockOwnerId: integer|Long expected";
            if (message.lockOwnerName != null && message.hasOwnProperty("lockOwnerName"))
                if (!$util.isString(message.lockOwnerName))
                    return "lockOwnerName: string expected";
            if (message.inNative != null && message.hasOwnProperty("inNative"))
                if (typeof message.inNative !== "boolean")
                    return "inNative: boolean expected";
            if (message.suspended != null && message.hasOwnProperty("suspended"))
                if (typeof message.suspended !== "boolean")
                    return "suspended: boolean expected";
            if (message.threadState != null && message.hasOwnProperty("threadState"))
                switch (message.threadState) {
                default:
                    return "threadState: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                    break;
                }
            if (message.stackTrace != null && message.hasOwnProperty("stackTrace")) {
                if (!Array.isArray(message.stackTrace))
                    return "stackTrace: array expected";
                for (var i = 0; i < message.stackTrace.length; ++i)
                    if (!$util.isString(message.stackTrace[i]))
                        return "stackTrace: string[] expected";
            }
            if (message.lockedMonitor != null && message.hasOwnProperty("lockedMonitor")) {
                if (!Array.isArray(message.lockedMonitor))
                    return "lockedMonitor: array expected";
                for (var i = 0; i < message.lockedMonitor.length; ++i) {
                    var error = $root.v1.PMonitorInfo.verify(message.lockedMonitor[i]);
                    if (error)
                        return "lockedMonitor." + error;
                }
            }
            if (message.lockedSynchronizer != null && message.hasOwnProperty("lockedSynchronizer")) {
                if (!Array.isArray(message.lockedSynchronizer))
                    return "lockedSynchronizer: array expected";
                for (var i = 0; i < message.lockedSynchronizer.length; ++i)
                    if (!$util.isString(message.lockedSynchronizer[i]))
                        return "lockedSynchronizer: string[] expected";
            }
            return null;
        };

        /**
         * Creates a PThreadDump message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PThreadDump
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PThreadDump} PThreadDump
         */
        PThreadDump.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PThreadDump)
                return object;
            var message = new $root.v1.PThreadDump();
            if (object.threadName != null)
                message.threadName = String(object.threadName);
            if (object.threadId != null)
                if ($util.Long)
                    (message.threadId = $util.Long.fromValue(object.threadId)).unsigned = false;
                else if (typeof object.threadId === "string")
                    message.threadId = parseInt(object.threadId, 10);
                else if (typeof object.threadId === "number")
                    message.threadId = object.threadId;
                else if (typeof object.threadId === "object")
                    message.threadId = new $util.LongBits(object.threadId.low >>> 0, object.threadId.high >>> 0).toNumber();
            if (object.blockedTime != null)
                if ($util.Long)
                    (message.blockedTime = $util.Long.fromValue(object.blockedTime)).unsigned = false;
                else if (typeof object.blockedTime === "string")
                    message.blockedTime = parseInt(object.blockedTime, 10);
                else if (typeof object.blockedTime === "number")
                    message.blockedTime = object.blockedTime;
                else if (typeof object.blockedTime === "object")
                    message.blockedTime = new $util.LongBits(object.blockedTime.low >>> 0, object.blockedTime.high >>> 0).toNumber();
            if (object.blockedCount != null)
                if ($util.Long)
                    (message.blockedCount = $util.Long.fromValue(object.blockedCount)).unsigned = false;
                else if (typeof object.blockedCount === "string")
                    message.blockedCount = parseInt(object.blockedCount, 10);
                else if (typeof object.blockedCount === "number")
                    message.blockedCount = object.blockedCount;
                else if (typeof object.blockedCount === "object")
                    message.blockedCount = new $util.LongBits(object.blockedCount.low >>> 0, object.blockedCount.high >>> 0).toNumber();
            if (object.waitedTime != null)
                if ($util.Long)
                    (message.waitedTime = $util.Long.fromValue(object.waitedTime)).unsigned = false;
                else if (typeof object.waitedTime === "string")
                    message.waitedTime = parseInt(object.waitedTime, 10);
                else if (typeof object.waitedTime === "number")
                    message.waitedTime = object.waitedTime;
                else if (typeof object.waitedTime === "object")
                    message.waitedTime = new $util.LongBits(object.waitedTime.low >>> 0, object.waitedTime.high >>> 0).toNumber();
            if (object.waitedCount != null)
                if ($util.Long)
                    (message.waitedCount = $util.Long.fromValue(object.waitedCount)).unsigned = false;
                else if (typeof object.waitedCount === "string")
                    message.waitedCount = parseInt(object.waitedCount, 10);
                else if (typeof object.waitedCount === "number")
                    message.waitedCount = object.waitedCount;
                else if (typeof object.waitedCount === "object")
                    message.waitedCount = new $util.LongBits(object.waitedCount.low >>> 0, object.waitedCount.high >>> 0).toNumber();
            if (object.lockName != null)
                message.lockName = String(object.lockName);
            if (object.lockOwnerId != null)
                if ($util.Long)
                    (message.lockOwnerId = $util.Long.fromValue(object.lockOwnerId)).unsigned = false;
                else if (typeof object.lockOwnerId === "string")
                    message.lockOwnerId = parseInt(object.lockOwnerId, 10);
                else if (typeof object.lockOwnerId === "number")
                    message.lockOwnerId = object.lockOwnerId;
                else if (typeof object.lockOwnerId === "object")
                    message.lockOwnerId = new $util.LongBits(object.lockOwnerId.low >>> 0, object.lockOwnerId.high >>> 0).toNumber();
            if (object.lockOwnerName != null)
                message.lockOwnerName = String(object.lockOwnerName);
            if (object.inNative != null)
                message.inNative = Boolean(object.inNative);
            if (object.suspended != null)
                message.suspended = Boolean(object.suspended);
            switch (object.threadState) {
            case "THREAD_STATE_NEW":
            case 0:
                message.threadState = 0;
                break;
            case "THREAD_STATE_RUNNABLE":
            case 1:
                message.threadState = 1;
                break;
            case "THREAD_STATE_BLOCKED":
            case 2:
                message.threadState = 2;
                break;
            case "THREAD_STATE_WAITING":
            case 3:
                message.threadState = 3;
                break;
            case "THREAD_STATE_TIMED_WAITING":
            case 4:
                message.threadState = 4;
                break;
            case "THREAD_STATE_TERMINATED":
            case 5:
                message.threadState = 5;
                break;
            case "THREAD_STATE_UNKNOWN":
            case 6:
                message.threadState = 6;
                break;
            }
            if (object.stackTrace) {
                if (!Array.isArray(object.stackTrace))
                    throw TypeError(".v1.PThreadDump.stackTrace: array expected");
                message.stackTrace = [];
                for (var i = 0; i < object.stackTrace.length; ++i)
                    message.stackTrace[i] = String(object.stackTrace[i]);
            }
            if (object.lockedMonitor) {
                if (!Array.isArray(object.lockedMonitor))
                    throw TypeError(".v1.PThreadDump.lockedMonitor: array expected");
                message.lockedMonitor = [];
                for (var i = 0; i < object.lockedMonitor.length; ++i) {
                    if (typeof object.lockedMonitor[i] !== "object")
                        throw TypeError(".v1.PThreadDump.lockedMonitor: object expected");
                    message.lockedMonitor[i] = $root.v1.PMonitorInfo.fromObject(object.lockedMonitor[i]);
                }
            }
            if (object.lockedSynchronizer) {
                if (!Array.isArray(object.lockedSynchronizer))
                    throw TypeError(".v1.PThreadDump.lockedSynchronizer: array expected");
                message.lockedSynchronizer = [];
                for (var i = 0; i < object.lockedSynchronizer.length; ++i)
                    message.lockedSynchronizer[i] = String(object.lockedSynchronizer[i]);
            }
            return message;
        };

        /**
         * Creates a plain object from a PThreadDump message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PThreadDump
         * @static
         * @param {v1.PThreadDump} message PThreadDump
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PThreadDump.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.stackTrace = [];
                object.lockedMonitor = [];
                object.lockedSynchronizer = [];
            }
            if (options.defaults) {
                object.threadName = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.threadId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.threadId = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.blockedTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.blockedTime = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.blockedCount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.blockedCount = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.waitedTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.waitedTime = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.waitedCount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.waitedCount = options.longs === String ? "0" : 0;
                object.lockName = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.lockOwnerId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.lockOwnerId = options.longs === String ? "0" : 0;
                object.lockOwnerName = "";
                object.inNative = false;
                object.suspended = false;
                object.threadState = options.enums === String ? "THREAD_STATE_NEW" : 0;
            }
            if (message.threadName != null && message.hasOwnProperty("threadName"))
                object.threadName = message.threadName;
            if (message.threadId != null && message.hasOwnProperty("threadId"))
                if (typeof message.threadId === "number")
                    object.threadId = options.longs === String ? String(message.threadId) : message.threadId;
                else
                    object.threadId = options.longs === String ? $util.Long.prototype.toString.call(message.threadId) : options.longs === Number ? new $util.LongBits(message.threadId.low >>> 0, message.threadId.high >>> 0).toNumber() : message.threadId;
            if (message.blockedTime != null && message.hasOwnProperty("blockedTime"))
                if (typeof message.blockedTime === "number")
                    object.blockedTime = options.longs === String ? String(message.blockedTime) : message.blockedTime;
                else
                    object.blockedTime = options.longs === String ? $util.Long.prototype.toString.call(message.blockedTime) : options.longs === Number ? new $util.LongBits(message.blockedTime.low >>> 0, message.blockedTime.high >>> 0).toNumber() : message.blockedTime;
            if (message.blockedCount != null && message.hasOwnProperty("blockedCount"))
                if (typeof message.blockedCount === "number")
                    object.blockedCount = options.longs === String ? String(message.blockedCount) : message.blockedCount;
                else
                    object.blockedCount = options.longs === String ? $util.Long.prototype.toString.call(message.blockedCount) : options.longs === Number ? new $util.LongBits(message.blockedCount.low >>> 0, message.blockedCount.high >>> 0).toNumber() : message.blockedCount;
            if (message.waitedTime != null && message.hasOwnProperty("waitedTime"))
                if (typeof message.waitedTime === "number")
                    object.waitedTime = options.longs === String ? String(message.waitedTime) : message.waitedTime;
                else
                    object.waitedTime = options.longs === String ? $util.Long.prototype.toString.call(message.waitedTime) : options.longs === Number ? new $util.LongBits(message.waitedTime.low >>> 0, message.waitedTime.high >>> 0).toNumber() : message.waitedTime;
            if (message.waitedCount != null && message.hasOwnProperty("waitedCount"))
                if (typeof message.waitedCount === "number")
                    object.waitedCount = options.longs === String ? String(message.waitedCount) : message.waitedCount;
                else
                    object.waitedCount = options.longs === String ? $util.Long.prototype.toString.call(message.waitedCount) : options.longs === Number ? new $util.LongBits(message.waitedCount.low >>> 0, message.waitedCount.high >>> 0).toNumber() : message.waitedCount;
            if (message.lockName != null && message.hasOwnProperty("lockName"))
                object.lockName = message.lockName;
            if (message.lockOwnerId != null && message.hasOwnProperty("lockOwnerId"))
                if (typeof message.lockOwnerId === "number")
                    object.lockOwnerId = options.longs === String ? String(message.lockOwnerId) : message.lockOwnerId;
                else
                    object.lockOwnerId = options.longs === String ? $util.Long.prototype.toString.call(message.lockOwnerId) : options.longs === Number ? new $util.LongBits(message.lockOwnerId.low >>> 0, message.lockOwnerId.high >>> 0).toNumber() : message.lockOwnerId;
            if (message.lockOwnerName != null && message.hasOwnProperty("lockOwnerName"))
                object.lockOwnerName = message.lockOwnerName;
            if (message.inNative != null && message.hasOwnProperty("inNative"))
                object.inNative = message.inNative;
            if (message.suspended != null && message.hasOwnProperty("suspended"))
                object.suspended = message.suspended;
            if (message.threadState != null && message.hasOwnProperty("threadState"))
                object.threadState = options.enums === String ? $root.v1.PThreadState[message.threadState] : message.threadState;
            if (message.stackTrace && message.stackTrace.length) {
                object.stackTrace = [];
                for (var j = 0; j < message.stackTrace.length; ++j)
                    object.stackTrace[j] = message.stackTrace[j];
            }
            if (message.lockedMonitor && message.lockedMonitor.length) {
                object.lockedMonitor = [];
                for (var j = 0; j < message.lockedMonitor.length; ++j)
                    object.lockedMonitor[j] = $root.v1.PMonitorInfo.toObject(message.lockedMonitor[j], options);
            }
            if (message.lockedSynchronizer && message.lockedSynchronizer.length) {
                object.lockedSynchronizer = [];
                for (var j = 0; j < message.lockedSynchronizer.length; ++j)
                    object.lockedSynchronizer[j] = message.lockedSynchronizer[j];
            }
            return object;
        };

        /**
         * Converts this PThreadDump to JSON.
         * @function toJSON
         * @memberof v1.PThreadDump
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PThreadDump.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PThreadDump;
    })();

    v1.PThreadLightDump = (function() {

        /**
         * Properties of a PThreadLightDump.
         * @memberof v1
         * @interface IPThreadLightDump
         * @property {string|null} [threadName] PThreadLightDump threadName
         * @property {number|Long|null} [threadId] PThreadLightDump threadId
         * @property {v1.PThreadState|null} [threadState] PThreadLightDump threadState
         */

        /**
         * Constructs a new PThreadLightDump.
         * @memberof v1
         * @classdesc Represents a PThreadLightDump.
         * @implements IPThreadLightDump
         * @constructor
         * @param {v1.IPThreadLightDump=} [properties] Properties to set
         */
        function PThreadLightDump(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PThreadLightDump threadName.
         * @member {string} threadName
         * @memberof v1.PThreadLightDump
         * @instance
         */
        PThreadLightDump.prototype.threadName = "";

        /**
         * PThreadLightDump threadId.
         * @member {number|Long} threadId
         * @memberof v1.PThreadLightDump
         * @instance
         */
        PThreadLightDump.prototype.threadId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PThreadLightDump threadState.
         * @member {v1.PThreadState} threadState
         * @memberof v1.PThreadLightDump
         * @instance
         */
        PThreadLightDump.prototype.threadState = 0;

        /**
         * Creates a new PThreadLightDump instance using the specified properties.
         * @function create
         * @memberof v1.PThreadLightDump
         * @static
         * @param {v1.IPThreadLightDump=} [properties] Properties to set
         * @returns {v1.PThreadLightDump} PThreadLightDump instance
         */
        PThreadLightDump.create = function create(properties) {
            return new PThreadLightDump(properties);
        };

        /**
         * Encodes the specified PThreadLightDump message. Does not implicitly {@link v1.PThreadLightDump.verify|verify} messages.
         * @function encode
         * @memberof v1.PThreadLightDump
         * @static
         * @param {v1.IPThreadLightDump} message PThreadLightDump message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PThreadLightDump.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.threadName != null && message.hasOwnProperty("threadName"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.threadName);
            if (message.threadId != null && message.hasOwnProperty("threadId"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.threadId);
            if (message.threadState != null && message.hasOwnProperty("threadState"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.threadState);
            return writer;
        };

        /**
         * Encodes the specified PThreadLightDump message, length delimited. Does not implicitly {@link v1.PThreadLightDump.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PThreadLightDump
         * @static
         * @param {v1.IPThreadLightDump} message PThreadLightDump message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PThreadLightDump.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PThreadLightDump message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PThreadLightDump
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PThreadLightDump} PThreadLightDump
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PThreadLightDump.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PThreadLightDump();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.threadName = reader.string();
                    break;
                case 2:
                    message.threadId = reader.int64();
                    break;
                case 3:
                    message.threadState = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PThreadLightDump message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PThreadLightDump
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PThreadLightDump} PThreadLightDump
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PThreadLightDump.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PThreadLightDump message.
         * @function verify
         * @memberof v1.PThreadLightDump
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PThreadLightDump.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.threadName != null && message.hasOwnProperty("threadName"))
                if (!$util.isString(message.threadName))
                    return "threadName: string expected";
            if (message.threadId != null && message.hasOwnProperty("threadId"))
                if (!$util.isInteger(message.threadId) && !(message.threadId && $util.isInteger(message.threadId.low) && $util.isInteger(message.threadId.high)))
                    return "threadId: integer|Long expected";
            if (message.threadState != null && message.hasOwnProperty("threadState"))
                switch (message.threadState) {
                default:
                    return "threadState: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                    break;
                }
            return null;
        };

        /**
         * Creates a PThreadLightDump message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PThreadLightDump
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PThreadLightDump} PThreadLightDump
         */
        PThreadLightDump.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PThreadLightDump)
                return object;
            var message = new $root.v1.PThreadLightDump();
            if (object.threadName != null)
                message.threadName = String(object.threadName);
            if (object.threadId != null)
                if ($util.Long)
                    (message.threadId = $util.Long.fromValue(object.threadId)).unsigned = false;
                else if (typeof object.threadId === "string")
                    message.threadId = parseInt(object.threadId, 10);
                else if (typeof object.threadId === "number")
                    message.threadId = object.threadId;
                else if (typeof object.threadId === "object")
                    message.threadId = new $util.LongBits(object.threadId.low >>> 0, object.threadId.high >>> 0).toNumber();
            switch (object.threadState) {
            case "THREAD_STATE_NEW":
            case 0:
                message.threadState = 0;
                break;
            case "THREAD_STATE_RUNNABLE":
            case 1:
                message.threadState = 1;
                break;
            case "THREAD_STATE_BLOCKED":
            case 2:
                message.threadState = 2;
                break;
            case "THREAD_STATE_WAITING":
            case 3:
                message.threadState = 3;
                break;
            case "THREAD_STATE_TIMED_WAITING":
            case 4:
                message.threadState = 4;
                break;
            case "THREAD_STATE_TERMINATED":
            case 5:
                message.threadState = 5;
                break;
            case "THREAD_STATE_UNKNOWN":
            case 6:
                message.threadState = 6;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a PThreadLightDump message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PThreadLightDump
         * @static
         * @param {v1.PThreadLightDump} message PThreadLightDump
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PThreadLightDump.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.threadName = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.threadId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.threadId = options.longs === String ? "0" : 0;
                object.threadState = options.enums === String ? "THREAD_STATE_NEW" : 0;
            }
            if (message.threadName != null && message.hasOwnProperty("threadName"))
                object.threadName = message.threadName;
            if (message.threadId != null && message.hasOwnProperty("threadId"))
                if (typeof message.threadId === "number")
                    object.threadId = options.longs === String ? String(message.threadId) : message.threadId;
                else
                    object.threadId = options.longs === String ? $util.Long.prototype.toString.call(message.threadId) : options.longs === Number ? new $util.LongBits(message.threadId.low >>> 0, message.threadId.high >>> 0).toNumber() : message.threadId;
            if (message.threadState != null && message.hasOwnProperty("threadState"))
                object.threadState = options.enums === String ? $root.v1.PThreadState[message.threadState] : message.threadState;
            return object;
        };

        /**
         * Converts this PThreadLightDump to JSON.
         * @function toJSON
         * @memberof v1.PThreadLightDump
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PThreadLightDump.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PThreadLightDump;
    })();

    /**
     * PThreadDumpType enum.
     * @name v1.PThreadDumpType
     * @enum {string}
     * @property {number} TARGET=0 TARGET value
     * @property {number} PENDING=1 PENDING value
     */
    v1.PThreadDumpType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "TARGET"] = 0;
        values[valuesById[1] = "PENDING"] = 1;
        return values;
    })();

    v1.PActiveThreadDump = (function() {

        /**
         * Properties of a PActiveThreadDump.
         * @memberof v1
         * @interface IPActiveThreadDump
         * @property {number|Long|null} [startTime] PActiveThreadDump startTime
         * @property {number|Long|null} [localTraceId] PActiveThreadDump localTraceId
         * @property {v1.IPThreadDump|null} [threadDump] PActiveThreadDump threadDump
         * @property {boolean|null} [sampled] PActiveThreadDump sampled
         * @property {string|null} [transactionId] PActiveThreadDump transactionId
         * @property {string|null} [entryPoint] PActiveThreadDump entryPoint
         */

        /**
         * Constructs a new PActiveThreadDump.
         * @memberof v1
         * @classdesc Represents a PActiveThreadDump.
         * @implements IPActiveThreadDump
         * @constructor
         * @param {v1.IPActiveThreadDump=} [properties] Properties to set
         */
        function PActiveThreadDump(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PActiveThreadDump startTime.
         * @member {number|Long} startTime
         * @memberof v1.PActiveThreadDump
         * @instance
         */
        PActiveThreadDump.prototype.startTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PActiveThreadDump localTraceId.
         * @member {number|Long} localTraceId
         * @memberof v1.PActiveThreadDump
         * @instance
         */
        PActiveThreadDump.prototype.localTraceId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PActiveThreadDump threadDump.
         * @member {v1.IPThreadDump|null|undefined} threadDump
         * @memberof v1.PActiveThreadDump
         * @instance
         */
        PActiveThreadDump.prototype.threadDump = null;

        /**
         * PActiveThreadDump sampled.
         * @member {boolean} sampled
         * @memberof v1.PActiveThreadDump
         * @instance
         */
        PActiveThreadDump.prototype.sampled = false;

        /**
         * PActiveThreadDump transactionId.
         * @member {string} transactionId
         * @memberof v1.PActiveThreadDump
         * @instance
         */
        PActiveThreadDump.prototype.transactionId = "";

        /**
         * PActiveThreadDump entryPoint.
         * @member {string} entryPoint
         * @memberof v1.PActiveThreadDump
         * @instance
         */
        PActiveThreadDump.prototype.entryPoint = "";

        /**
         * Creates a new PActiveThreadDump instance using the specified properties.
         * @function create
         * @memberof v1.PActiveThreadDump
         * @static
         * @param {v1.IPActiveThreadDump=} [properties] Properties to set
         * @returns {v1.PActiveThreadDump} PActiveThreadDump instance
         */
        PActiveThreadDump.create = function create(properties) {
            return new PActiveThreadDump(properties);
        };

        /**
         * Encodes the specified PActiveThreadDump message. Does not implicitly {@link v1.PActiveThreadDump.verify|verify} messages.
         * @function encode
         * @memberof v1.PActiveThreadDump
         * @static
         * @param {v1.IPActiveThreadDump} message PActiveThreadDump message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PActiveThreadDump.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.startTime != null && message.hasOwnProperty("startTime"))
                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.startTime);
            if (message.localTraceId != null && message.hasOwnProperty("localTraceId"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.localTraceId);
            if (message.threadDump != null && message.hasOwnProperty("threadDump"))
                $root.v1.PThreadDump.encode(message.threadDump, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.sampled != null && message.hasOwnProperty("sampled"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.sampled);
            if (message.transactionId != null && message.hasOwnProperty("transactionId"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.transactionId);
            if (message.entryPoint != null && message.hasOwnProperty("entryPoint"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.entryPoint);
            return writer;
        };

        /**
         * Encodes the specified PActiveThreadDump message, length delimited. Does not implicitly {@link v1.PActiveThreadDump.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PActiveThreadDump
         * @static
         * @param {v1.IPActiveThreadDump} message PActiveThreadDump message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PActiveThreadDump.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PActiveThreadDump message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PActiveThreadDump
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PActiveThreadDump} PActiveThreadDump
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PActiveThreadDump.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PActiveThreadDump();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.startTime = reader.int64();
                    break;
                case 2:
                    message.localTraceId = reader.int64();
                    break;
                case 3:
                    message.threadDump = $root.v1.PThreadDump.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.sampled = reader.bool();
                    break;
                case 5:
                    message.transactionId = reader.string();
                    break;
                case 6:
                    message.entryPoint = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PActiveThreadDump message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PActiveThreadDump
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PActiveThreadDump} PActiveThreadDump
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PActiveThreadDump.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PActiveThreadDump message.
         * @function verify
         * @memberof v1.PActiveThreadDump
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PActiveThreadDump.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.startTime != null && message.hasOwnProperty("startTime"))
                if (!$util.isInteger(message.startTime) && !(message.startTime && $util.isInteger(message.startTime.low) && $util.isInteger(message.startTime.high)))
                    return "startTime: integer|Long expected";
            if (message.localTraceId != null && message.hasOwnProperty("localTraceId"))
                if (!$util.isInteger(message.localTraceId) && !(message.localTraceId && $util.isInteger(message.localTraceId.low) && $util.isInteger(message.localTraceId.high)))
                    return "localTraceId: integer|Long expected";
            if (message.threadDump != null && message.hasOwnProperty("threadDump")) {
                var error = $root.v1.PThreadDump.verify(message.threadDump);
                if (error)
                    return "threadDump." + error;
            }
            if (message.sampled != null && message.hasOwnProperty("sampled"))
                if (typeof message.sampled !== "boolean")
                    return "sampled: boolean expected";
            if (message.transactionId != null && message.hasOwnProperty("transactionId"))
                if (!$util.isString(message.transactionId))
                    return "transactionId: string expected";
            if (message.entryPoint != null && message.hasOwnProperty("entryPoint"))
                if (!$util.isString(message.entryPoint))
                    return "entryPoint: string expected";
            return null;
        };

        /**
         * Creates a PActiveThreadDump message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PActiveThreadDump
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PActiveThreadDump} PActiveThreadDump
         */
        PActiveThreadDump.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PActiveThreadDump)
                return object;
            var message = new $root.v1.PActiveThreadDump();
            if (object.startTime != null)
                if ($util.Long)
                    (message.startTime = $util.Long.fromValue(object.startTime)).unsigned = false;
                else if (typeof object.startTime === "string")
                    message.startTime = parseInt(object.startTime, 10);
                else if (typeof object.startTime === "number")
                    message.startTime = object.startTime;
                else if (typeof object.startTime === "object")
                    message.startTime = new $util.LongBits(object.startTime.low >>> 0, object.startTime.high >>> 0).toNumber();
            if (object.localTraceId != null)
                if ($util.Long)
                    (message.localTraceId = $util.Long.fromValue(object.localTraceId)).unsigned = false;
                else if (typeof object.localTraceId === "string")
                    message.localTraceId = parseInt(object.localTraceId, 10);
                else if (typeof object.localTraceId === "number")
                    message.localTraceId = object.localTraceId;
                else if (typeof object.localTraceId === "object")
                    message.localTraceId = new $util.LongBits(object.localTraceId.low >>> 0, object.localTraceId.high >>> 0).toNumber();
            if (object.threadDump != null) {
                if (typeof object.threadDump !== "object")
                    throw TypeError(".v1.PActiveThreadDump.threadDump: object expected");
                message.threadDump = $root.v1.PThreadDump.fromObject(object.threadDump);
            }
            if (object.sampled != null)
                message.sampled = Boolean(object.sampled);
            if (object.transactionId != null)
                message.transactionId = String(object.transactionId);
            if (object.entryPoint != null)
                message.entryPoint = String(object.entryPoint);
            return message;
        };

        /**
         * Creates a plain object from a PActiveThreadDump message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PActiveThreadDump
         * @static
         * @param {v1.PActiveThreadDump} message PActiveThreadDump
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PActiveThreadDump.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.startTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.startTime = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.localTraceId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.localTraceId = options.longs === String ? "0" : 0;
                object.threadDump = null;
                object.sampled = false;
                object.transactionId = "";
                object.entryPoint = "";
            }
            if (message.startTime != null && message.hasOwnProperty("startTime"))
                if (typeof message.startTime === "number")
                    object.startTime = options.longs === String ? String(message.startTime) : message.startTime;
                else
                    object.startTime = options.longs === String ? $util.Long.prototype.toString.call(message.startTime) : options.longs === Number ? new $util.LongBits(message.startTime.low >>> 0, message.startTime.high >>> 0).toNumber() : message.startTime;
            if (message.localTraceId != null && message.hasOwnProperty("localTraceId"))
                if (typeof message.localTraceId === "number")
                    object.localTraceId = options.longs === String ? String(message.localTraceId) : message.localTraceId;
                else
                    object.localTraceId = options.longs === String ? $util.Long.prototype.toString.call(message.localTraceId) : options.longs === Number ? new $util.LongBits(message.localTraceId.low >>> 0, message.localTraceId.high >>> 0).toNumber() : message.localTraceId;
            if (message.threadDump != null && message.hasOwnProperty("threadDump"))
                object.threadDump = $root.v1.PThreadDump.toObject(message.threadDump, options);
            if (message.sampled != null && message.hasOwnProperty("sampled"))
                object.sampled = message.sampled;
            if (message.transactionId != null && message.hasOwnProperty("transactionId"))
                object.transactionId = message.transactionId;
            if (message.entryPoint != null && message.hasOwnProperty("entryPoint"))
                object.entryPoint = message.entryPoint;
            return object;
        };

        /**
         * Converts this PActiveThreadDump to JSON.
         * @function toJSON
         * @memberof v1.PActiveThreadDump
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PActiveThreadDump.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PActiveThreadDump;
    })();

    v1.PActiveThreadLightDump = (function() {

        /**
         * Properties of a PActiveThreadLightDump.
         * @memberof v1
         * @interface IPActiveThreadLightDump
         * @property {number|Long|null} [startTime] PActiveThreadLightDump startTime
         * @property {number|Long|null} [localTraceId] PActiveThreadLightDump localTraceId
         * @property {v1.IPThreadLightDump|null} [threadDump] PActiveThreadLightDump threadDump
         * @property {boolean|null} [sampled] PActiveThreadLightDump sampled
         * @property {string|null} [transactionId] PActiveThreadLightDump transactionId
         * @property {string|null} [entryPoint] PActiveThreadLightDump entryPoint
         */

        /**
         * Constructs a new PActiveThreadLightDump.
         * @memberof v1
         * @classdesc Represents a PActiveThreadLightDump.
         * @implements IPActiveThreadLightDump
         * @constructor
         * @param {v1.IPActiveThreadLightDump=} [properties] Properties to set
         */
        function PActiveThreadLightDump(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PActiveThreadLightDump startTime.
         * @member {number|Long} startTime
         * @memberof v1.PActiveThreadLightDump
         * @instance
         */
        PActiveThreadLightDump.prototype.startTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PActiveThreadLightDump localTraceId.
         * @member {number|Long} localTraceId
         * @memberof v1.PActiveThreadLightDump
         * @instance
         */
        PActiveThreadLightDump.prototype.localTraceId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PActiveThreadLightDump threadDump.
         * @member {v1.IPThreadLightDump|null|undefined} threadDump
         * @memberof v1.PActiveThreadLightDump
         * @instance
         */
        PActiveThreadLightDump.prototype.threadDump = null;

        /**
         * PActiveThreadLightDump sampled.
         * @member {boolean} sampled
         * @memberof v1.PActiveThreadLightDump
         * @instance
         */
        PActiveThreadLightDump.prototype.sampled = false;

        /**
         * PActiveThreadLightDump transactionId.
         * @member {string} transactionId
         * @memberof v1.PActiveThreadLightDump
         * @instance
         */
        PActiveThreadLightDump.prototype.transactionId = "";

        /**
         * PActiveThreadLightDump entryPoint.
         * @member {string} entryPoint
         * @memberof v1.PActiveThreadLightDump
         * @instance
         */
        PActiveThreadLightDump.prototype.entryPoint = "";

        /**
         * Creates a new PActiveThreadLightDump instance using the specified properties.
         * @function create
         * @memberof v1.PActiveThreadLightDump
         * @static
         * @param {v1.IPActiveThreadLightDump=} [properties] Properties to set
         * @returns {v1.PActiveThreadLightDump} PActiveThreadLightDump instance
         */
        PActiveThreadLightDump.create = function create(properties) {
            return new PActiveThreadLightDump(properties);
        };

        /**
         * Encodes the specified PActiveThreadLightDump message. Does not implicitly {@link v1.PActiveThreadLightDump.verify|verify} messages.
         * @function encode
         * @memberof v1.PActiveThreadLightDump
         * @static
         * @param {v1.IPActiveThreadLightDump} message PActiveThreadLightDump message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PActiveThreadLightDump.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.startTime != null && message.hasOwnProperty("startTime"))
                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.startTime);
            if (message.localTraceId != null && message.hasOwnProperty("localTraceId"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.localTraceId);
            if (message.threadDump != null && message.hasOwnProperty("threadDump"))
                $root.v1.PThreadLightDump.encode(message.threadDump, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.sampled != null && message.hasOwnProperty("sampled"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.sampled);
            if (message.transactionId != null && message.hasOwnProperty("transactionId"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.transactionId);
            if (message.entryPoint != null && message.hasOwnProperty("entryPoint"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.entryPoint);
            return writer;
        };

        /**
         * Encodes the specified PActiveThreadLightDump message, length delimited. Does not implicitly {@link v1.PActiveThreadLightDump.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PActiveThreadLightDump
         * @static
         * @param {v1.IPActiveThreadLightDump} message PActiveThreadLightDump message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PActiveThreadLightDump.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PActiveThreadLightDump message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PActiveThreadLightDump
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PActiveThreadLightDump} PActiveThreadLightDump
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PActiveThreadLightDump.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PActiveThreadLightDump();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.startTime = reader.int64();
                    break;
                case 2:
                    message.localTraceId = reader.int64();
                    break;
                case 3:
                    message.threadDump = $root.v1.PThreadLightDump.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.sampled = reader.bool();
                    break;
                case 5:
                    message.transactionId = reader.string();
                    break;
                case 6:
                    message.entryPoint = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PActiveThreadLightDump message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PActiveThreadLightDump
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PActiveThreadLightDump} PActiveThreadLightDump
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PActiveThreadLightDump.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PActiveThreadLightDump message.
         * @function verify
         * @memberof v1.PActiveThreadLightDump
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PActiveThreadLightDump.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.startTime != null && message.hasOwnProperty("startTime"))
                if (!$util.isInteger(message.startTime) && !(message.startTime && $util.isInteger(message.startTime.low) && $util.isInteger(message.startTime.high)))
                    return "startTime: integer|Long expected";
            if (message.localTraceId != null && message.hasOwnProperty("localTraceId"))
                if (!$util.isInteger(message.localTraceId) && !(message.localTraceId && $util.isInteger(message.localTraceId.low) && $util.isInteger(message.localTraceId.high)))
                    return "localTraceId: integer|Long expected";
            if (message.threadDump != null && message.hasOwnProperty("threadDump")) {
                var error = $root.v1.PThreadLightDump.verify(message.threadDump);
                if (error)
                    return "threadDump." + error;
            }
            if (message.sampled != null && message.hasOwnProperty("sampled"))
                if (typeof message.sampled !== "boolean")
                    return "sampled: boolean expected";
            if (message.transactionId != null && message.hasOwnProperty("transactionId"))
                if (!$util.isString(message.transactionId))
                    return "transactionId: string expected";
            if (message.entryPoint != null && message.hasOwnProperty("entryPoint"))
                if (!$util.isString(message.entryPoint))
                    return "entryPoint: string expected";
            return null;
        };

        /**
         * Creates a PActiveThreadLightDump message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PActiveThreadLightDump
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PActiveThreadLightDump} PActiveThreadLightDump
         */
        PActiveThreadLightDump.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PActiveThreadLightDump)
                return object;
            var message = new $root.v1.PActiveThreadLightDump();
            if (object.startTime != null)
                if ($util.Long)
                    (message.startTime = $util.Long.fromValue(object.startTime)).unsigned = false;
                else if (typeof object.startTime === "string")
                    message.startTime = parseInt(object.startTime, 10);
                else if (typeof object.startTime === "number")
                    message.startTime = object.startTime;
                else if (typeof object.startTime === "object")
                    message.startTime = new $util.LongBits(object.startTime.low >>> 0, object.startTime.high >>> 0).toNumber();
            if (object.localTraceId != null)
                if ($util.Long)
                    (message.localTraceId = $util.Long.fromValue(object.localTraceId)).unsigned = false;
                else if (typeof object.localTraceId === "string")
                    message.localTraceId = parseInt(object.localTraceId, 10);
                else if (typeof object.localTraceId === "number")
                    message.localTraceId = object.localTraceId;
                else if (typeof object.localTraceId === "object")
                    message.localTraceId = new $util.LongBits(object.localTraceId.low >>> 0, object.localTraceId.high >>> 0).toNumber();
            if (object.threadDump != null) {
                if (typeof object.threadDump !== "object")
                    throw TypeError(".v1.PActiveThreadLightDump.threadDump: object expected");
                message.threadDump = $root.v1.PThreadLightDump.fromObject(object.threadDump);
            }
            if (object.sampled != null)
                message.sampled = Boolean(object.sampled);
            if (object.transactionId != null)
                message.transactionId = String(object.transactionId);
            if (object.entryPoint != null)
                message.entryPoint = String(object.entryPoint);
            return message;
        };

        /**
         * Creates a plain object from a PActiveThreadLightDump message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PActiveThreadLightDump
         * @static
         * @param {v1.PActiveThreadLightDump} message PActiveThreadLightDump
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PActiveThreadLightDump.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.startTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.startTime = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.localTraceId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.localTraceId = options.longs === String ? "0" : 0;
                object.threadDump = null;
                object.sampled = false;
                object.transactionId = "";
                object.entryPoint = "";
            }
            if (message.startTime != null && message.hasOwnProperty("startTime"))
                if (typeof message.startTime === "number")
                    object.startTime = options.longs === String ? String(message.startTime) : message.startTime;
                else
                    object.startTime = options.longs === String ? $util.Long.prototype.toString.call(message.startTime) : options.longs === Number ? new $util.LongBits(message.startTime.low >>> 0, message.startTime.high >>> 0).toNumber() : message.startTime;
            if (message.localTraceId != null && message.hasOwnProperty("localTraceId"))
                if (typeof message.localTraceId === "number")
                    object.localTraceId = options.longs === String ? String(message.localTraceId) : message.localTraceId;
                else
                    object.localTraceId = options.longs === String ? $util.Long.prototype.toString.call(message.localTraceId) : options.longs === Number ? new $util.LongBits(message.localTraceId.low >>> 0, message.localTraceId.high >>> 0).toNumber() : message.localTraceId;
            if (message.threadDump != null && message.hasOwnProperty("threadDump"))
                object.threadDump = $root.v1.PThreadLightDump.toObject(message.threadDump, options);
            if (message.sampled != null && message.hasOwnProperty("sampled"))
                object.sampled = message.sampled;
            if (message.transactionId != null && message.hasOwnProperty("transactionId"))
                object.transactionId = message.transactionId;
            if (message.entryPoint != null && message.hasOwnProperty("entryPoint"))
                object.entryPoint = message.entryPoint;
            return object;
        };

        /**
         * Converts this PActiveThreadLightDump to JSON.
         * @function toJSON
         * @memberof v1.PActiveThreadLightDump
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PActiveThreadLightDump.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PActiveThreadLightDump;
    })();

    return v1;
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

        return protobuf;
    })();

    return google;
})();

module.exports = $root;
