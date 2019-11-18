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

    v1.PPing = (function() {

        /**
         * Properties of a PPing.
         * @memberof v1
         * @interface IPPing
         */

        /**
         * Constructs a new PPing.
         * @memberof v1
         * @classdesc Represents a PPing.
         * @implements IPPing
         * @constructor
         * @param {v1.IPPing=} [properties] Properties to set
         */
        function PPing(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new PPing instance using the specified properties.
         * @function create
         * @memberof v1.PPing
         * @static
         * @param {v1.IPPing=} [properties] Properties to set
         * @returns {v1.PPing} PPing instance
         */
        PPing.create = function create(properties) {
            return new PPing(properties);
        };

        /**
         * Encodes the specified PPing message. Does not implicitly {@link v1.PPing.verify|verify} messages.
         * @function encode
         * @memberof v1.PPing
         * @static
         * @param {v1.IPPing} message PPing message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PPing.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified PPing message, length delimited. Does not implicitly {@link v1.PPing.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PPing
         * @static
         * @param {v1.IPPing} message PPing message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PPing.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PPing message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PPing
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PPing} PPing
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PPing.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PPing();
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
         * Decodes a PPing message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PPing
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PPing} PPing
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PPing.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PPing message.
         * @function verify
         * @memberof v1.PPing
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PPing.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a PPing message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PPing
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PPing} PPing
         */
        PPing.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PPing)
                return object;
            return new $root.v1.PPing();
        };

        /**
         * Creates a plain object from a PPing message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PPing
         * @static
         * @param {v1.PPing} message PPing
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PPing.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this PPing to JSON.
         * @function toJSON
         * @memberof v1.PPing
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PPing.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PPing;
    })();

    v1.PStatMessage = (function() {

        /**
         * Properties of a PStatMessage.
         * @memberof v1
         * @interface IPStatMessage
         * @property {v1.IPAgentStat|null} [agentStat] PStatMessage agentStat
         * @property {v1.IPAgentStatBatch|null} [agentStatBatch] PStatMessage agentStatBatch
         */

        /**
         * Constructs a new PStatMessage.
         * @memberof v1
         * @classdesc Represents a PStatMessage.
         * @implements IPStatMessage
         * @constructor
         * @param {v1.IPStatMessage=} [properties] Properties to set
         */
        function PStatMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PStatMessage agentStat.
         * @member {v1.IPAgentStat|null|undefined} agentStat
         * @memberof v1.PStatMessage
         * @instance
         */
        PStatMessage.prototype.agentStat = null;

        /**
         * PStatMessage agentStatBatch.
         * @member {v1.IPAgentStatBatch|null|undefined} agentStatBatch
         * @memberof v1.PStatMessage
         * @instance
         */
        PStatMessage.prototype.agentStatBatch = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * PStatMessage field.
         * @member {"agentStat"|"agentStatBatch"|undefined} field
         * @memberof v1.PStatMessage
         * @instance
         */
        Object.defineProperty(PStatMessage.prototype, "field", {
            get: $util.oneOfGetter($oneOfFields = ["agentStat", "agentStatBatch"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new PStatMessage instance using the specified properties.
         * @function create
         * @memberof v1.PStatMessage
         * @static
         * @param {v1.IPStatMessage=} [properties] Properties to set
         * @returns {v1.PStatMessage} PStatMessage instance
         */
        PStatMessage.create = function create(properties) {
            return new PStatMessage(properties);
        };

        /**
         * Encodes the specified PStatMessage message. Does not implicitly {@link v1.PStatMessage.verify|verify} messages.
         * @function encode
         * @memberof v1.PStatMessage
         * @static
         * @param {v1.IPStatMessage} message PStatMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PStatMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.agentStat != null && message.hasOwnProperty("agentStat"))
                $root.v1.PAgentStat.encode(message.agentStat, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.agentStatBatch != null && message.hasOwnProperty("agentStatBatch"))
                $root.v1.PAgentStatBatch.encode(message.agentStatBatch, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified PStatMessage message, length delimited. Does not implicitly {@link v1.PStatMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PStatMessage
         * @static
         * @param {v1.IPStatMessage} message PStatMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PStatMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PStatMessage message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PStatMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PStatMessage} PStatMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PStatMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PStatMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.agentStat = $root.v1.PAgentStat.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.agentStatBatch = $root.v1.PAgentStatBatch.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PStatMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PStatMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PStatMessage} PStatMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PStatMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PStatMessage message.
         * @function verify
         * @memberof v1.PStatMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PStatMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.agentStat != null && message.hasOwnProperty("agentStat")) {
                properties.field = 1;
                {
                    var error = $root.v1.PAgentStat.verify(message.agentStat);
                    if (error)
                        return "agentStat." + error;
                }
            }
            if (message.agentStatBatch != null && message.hasOwnProperty("agentStatBatch")) {
                if (properties.field === 1)
                    return "field: multiple values";
                properties.field = 1;
                {
                    var error = $root.v1.PAgentStatBatch.verify(message.agentStatBatch);
                    if (error)
                        return "agentStatBatch." + error;
                }
            }
            return null;
        };

        /**
         * Creates a PStatMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PStatMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PStatMessage} PStatMessage
         */
        PStatMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PStatMessage)
                return object;
            var message = new $root.v1.PStatMessage();
            if (object.agentStat != null) {
                if (typeof object.agentStat !== "object")
                    throw TypeError(".v1.PStatMessage.agentStat: object expected");
                message.agentStat = $root.v1.PAgentStat.fromObject(object.agentStat);
            }
            if (object.agentStatBatch != null) {
                if (typeof object.agentStatBatch !== "object")
                    throw TypeError(".v1.PStatMessage.agentStatBatch: object expected");
                message.agentStatBatch = $root.v1.PAgentStatBatch.fromObject(object.agentStatBatch);
            }
            return message;
        };

        /**
         * Creates a plain object from a PStatMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PStatMessage
         * @static
         * @param {v1.PStatMessage} message PStatMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PStatMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (message.agentStat != null && message.hasOwnProperty("agentStat")) {
                object.agentStat = $root.v1.PAgentStat.toObject(message.agentStat, options);
                if (options.oneofs)
                    object.field = "agentStat";
            }
            if (message.agentStatBatch != null && message.hasOwnProperty("agentStatBatch")) {
                object.agentStatBatch = $root.v1.PAgentStatBatch.toObject(message.agentStatBatch, options);
                if (options.oneofs)
                    object.field = "agentStatBatch";
            }
            return object;
        };

        /**
         * Converts this PStatMessage to JSON.
         * @function toJSON
         * @memberof v1.PStatMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PStatMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PStatMessage;
    })();

    v1.PAgentInfo = (function() {

        /**
         * Properties of a PAgentInfo.
         * @memberof v1
         * @interface IPAgentInfo
         * @property {string|null} [hostname] PAgentInfo hostname
         * @property {string|null} [ip] PAgentInfo ip
         * @property {string|null} [ports] PAgentInfo ports
         * @property {number|null} [serviceType] PAgentInfo serviceType
         * @property {number|null} [pid] PAgentInfo pid
         * @property {string|null} [agentVersion] PAgentInfo agentVersion
         * @property {string|null} [vmVersion] PAgentInfo vmVersion
         * @property {number|Long|null} [endTimestamp] PAgentInfo endTimestamp
         * @property {number|null} [endStatus] PAgentInfo endStatus
         * @property {v1.IPServerMetaData|null} [serverMetaData] PAgentInfo serverMetaData
         * @property {v1.IPJvmInfo|null} [jvmInfo] PAgentInfo jvmInfo
         * @property {boolean|null} [container] PAgentInfo container
         */

        /**
         * Constructs a new PAgentInfo.
         * @memberof v1
         * @classdesc Represents a PAgentInfo.
         * @implements IPAgentInfo
         * @constructor
         * @param {v1.IPAgentInfo=} [properties] Properties to set
         */
        function PAgentInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PAgentInfo hostname.
         * @member {string} hostname
         * @memberof v1.PAgentInfo
         * @instance
         */
        PAgentInfo.prototype.hostname = "";

        /**
         * PAgentInfo ip.
         * @member {string} ip
         * @memberof v1.PAgentInfo
         * @instance
         */
        PAgentInfo.prototype.ip = "";

        /**
         * PAgentInfo ports.
         * @member {string} ports
         * @memberof v1.PAgentInfo
         * @instance
         */
        PAgentInfo.prototype.ports = "";

        /**
         * PAgentInfo serviceType.
         * @member {number} serviceType
         * @memberof v1.PAgentInfo
         * @instance
         */
        PAgentInfo.prototype.serviceType = 0;

        /**
         * PAgentInfo pid.
         * @member {number} pid
         * @memberof v1.PAgentInfo
         * @instance
         */
        PAgentInfo.prototype.pid = 0;

        /**
         * PAgentInfo agentVersion.
         * @member {string} agentVersion
         * @memberof v1.PAgentInfo
         * @instance
         */
        PAgentInfo.prototype.agentVersion = "";

        /**
         * PAgentInfo vmVersion.
         * @member {string} vmVersion
         * @memberof v1.PAgentInfo
         * @instance
         */
        PAgentInfo.prototype.vmVersion = "";

        /**
         * PAgentInfo endTimestamp.
         * @member {number|Long} endTimestamp
         * @memberof v1.PAgentInfo
         * @instance
         */
        PAgentInfo.prototype.endTimestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PAgentInfo endStatus.
         * @member {number} endStatus
         * @memberof v1.PAgentInfo
         * @instance
         */
        PAgentInfo.prototype.endStatus = 0;

        /**
         * PAgentInfo serverMetaData.
         * @member {v1.IPServerMetaData|null|undefined} serverMetaData
         * @memberof v1.PAgentInfo
         * @instance
         */
        PAgentInfo.prototype.serverMetaData = null;

        /**
         * PAgentInfo jvmInfo.
         * @member {v1.IPJvmInfo|null|undefined} jvmInfo
         * @memberof v1.PAgentInfo
         * @instance
         */
        PAgentInfo.prototype.jvmInfo = null;

        /**
         * PAgentInfo container.
         * @member {boolean} container
         * @memberof v1.PAgentInfo
         * @instance
         */
        PAgentInfo.prototype.container = false;

        /**
         * Creates a new PAgentInfo instance using the specified properties.
         * @function create
         * @memberof v1.PAgentInfo
         * @static
         * @param {v1.IPAgentInfo=} [properties] Properties to set
         * @returns {v1.PAgentInfo} PAgentInfo instance
         */
        PAgentInfo.create = function create(properties) {
            return new PAgentInfo(properties);
        };

        /**
         * Encodes the specified PAgentInfo message. Does not implicitly {@link v1.PAgentInfo.verify|verify} messages.
         * @function encode
         * @memberof v1.PAgentInfo
         * @static
         * @param {v1.IPAgentInfo} message PAgentInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PAgentInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.hostname != null && message.hasOwnProperty("hostname"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.hostname);
            if (message.ip != null && message.hasOwnProperty("ip"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.ip);
            if (message.ports != null && message.hasOwnProperty("ports"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.ports);
            if (message.serviceType != null && message.hasOwnProperty("serviceType"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.serviceType);
            if (message.pid != null && message.hasOwnProperty("pid"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.pid);
            if (message.agentVersion != null && message.hasOwnProperty("agentVersion"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.agentVersion);
            if (message.vmVersion != null && message.hasOwnProperty("vmVersion"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.vmVersion);
            if (message.endTimestamp != null && message.hasOwnProperty("endTimestamp"))
                writer.uint32(/* id 8, wireType 0 =*/64).int64(message.endTimestamp);
            if (message.endStatus != null && message.hasOwnProperty("endStatus"))
                writer.uint32(/* id 9, wireType 0 =*/72).int32(message.endStatus);
            if (message.serverMetaData != null && message.hasOwnProperty("serverMetaData"))
                $root.v1.PServerMetaData.encode(message.serverMetaData, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
            if (message.jvmInfo != null && message.hasOwnProperty("jvmInfo"))
                $root.v1.PJvmInfo.encode(message.jvmInfo, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
            if (message.container != null && message.hasOwnProperty("container"))
                writer.uint32(/* id 12, wireType 0 =*/96).bool(message.container);
            return writer;
        };

        /**
         * Encodes the specified PAgentInfo message, length delimited. Does not implicitly {@link v1.PAgentInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PAgentInfo
         * @static
         * @param {v1.IPAgentInfo} message PAgentInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PAgentInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PAgentInfo message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PAgentInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PAgentInfo} PAgentInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PAgentInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PAgentInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.hostname = reader.string();
                    break;
                case 2:
                    message.ip = reader.string();
                    break;
                case 3:
                    message.ports = reader.string();
                    break;
                case 4:
                    message.serviceType = reader.int32();
                    break;
                case 5:
                    message.pid = reader.int32();
                    break;
                case 6:
                    message.agentVersion = reader.string();
                    break;
                case 7:
                    message.vmVersion = reader.string();
                    break;
                case 8:
                    message.endTimestamp = reader.int64();
                    break;
                case 9:
                    message.endStatus = reader.int32();
                    break;
                case 10:
                    message.serverMetaData = $root.v1.PServerMetaData.decode(reader, reader.uint32());
                    break;
                case 11:
                    message.jvmInfo = $root.v1.PJvmInfo.decode(reader, reader.uint32());
                    break;
                case 12:
                    message.container = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PAgentInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PAgentInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PAgentInfo} PAgentInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PAgentInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PAgentInfo message.
         * @function verify
         * @memberof v1.PAgentInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PAgentInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.hostname != null && message.hasOwnProperty("hostname"))
                if (!$util.isString(message.hostname))
                    return "hostname: string expected";
            if (message.ip != null && message.hasOwnProperty("ip"))
                if (!$util.isString(message.ip))
                    return "ip: string expected";
            if (message.ports != null && message.hasOwnProperty("ports"))
                if (!$util.isString(message.ports))
                    return "ports: string expected";
            if (message.serviceType != null && message.hasOwnProperty("serviceType"))
                if (!$util.isInteger(message.serviceType))
                    return "serviceType: integer expected";
            if (message.pid != null && message.hasOwnProperty("pid"))
                if (!$util.isInteger(message.pid))
                    return "pid: integer expected";
            if (message.agentVersion != null && message.hasOwnProperty("agentVersion"))
                if (!$util.isString(message.agentVersion))
                    return "agentVersion: string expected";
            if (message.vmVersion != null && message.hasOwnProperty("vmVersion"))
                if (!$util.isString(message.vmVersion))
                    return "vmVersion: string expected";
            if (message.endTimestamp != null && message.hasOwnProperty("endTimestamp"))
                if (!$util.isInteger(message.endTimestamp) && !(message.endTimestamp && $util.isInteger(message.endTimestamp.low) && $util.isInteger(message.endTimestamp.high)))
                    return "endTimestamp: integer|Long expected";
            if (message.endStatus != null && message.hasOwnProperty("endStatus"))
                if (!$util.isInteger(message.endStatus))
                    return "endStatus: integer expected";
            if (message.serverMetaData != null && message.hasOwnProperty("serverMetaData")) {
                var error = $root.v1.PServerMetaData.verify(message.serverMetaData);
                if (error)
                    return "serverMetaData." + error;
            }
            if (message.jvmInfo != null && message.hasOwnProperty("jvmInfo")) {
                var error = $root.v1.PJvmInfo.verify(message.jvmInfo);
                if (error)
                    return "jvmInfo." + error;
            }
            if (message.container != null && message.hasOwnProperty("container"))
                if (typeof message.container !== "boolean")
                    return "container: boolean expected";
            return null;
        };

        /**
         * Creates a PAgentInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PAgentInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PAgentInfo} PAgentInfo
         */
        PAgentInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PAgentInfo)
                return object;
            var message = new $root.v1.PAgentInfo();
            if (object.hostname != null)
                message.hostname = String(object.hostname);
            if (object.ip != null)
                message.ip = String(object.ip);
            if (object.ports != null)
                message.ports = String(object.ports);
            if (object.serviceType != null)
                message.serviceType = object.serviceType | 0;
            if (object.pid != null)
                message.pid = object.pid | 0;
            if (object.agentVersion != null)
                message.agentVersion = String(object.agentVersion);
            if (object.vmVersion != null)
                message.vmVersion = String(object.vmVersion);
            if (object.endTimestamp != null)
                if ($util.Long)
                    (message.endTimestamp = $util.Long.fromValue(object.endTimestamp)).unsigned = false;
                else if (typeof object.endTimestamp === "string")
                    message.endTimestamp = parseInt(object.endTimestamp, 10);
                else if (typeof object.endTimestamp === "number")
                    message.endTimestamp = object.endTimestamp;
                else if (typeof object.endTimestamp === "object")
                    message.endTimestamp = new $util.LongBits(object.endTimestamp.low >>> 0, object.endTimestamp.high >>> 0).toNumber();
            if (object.endStatus != null)
                message.endStatus = object.endStatus | 0;
            if (object.serverMetaData != null) {
                if (typeof object.serverMetaData !== "object")
                    throw TypeError(".v1.PAgentInfo.serverMetaData: object expected");
                message.serverMetaData = $root.v1.PServerMetaData.fromObject(object.serverMetaData);
            }
            if (object.jvmInfo != null) {
                if (typeof object.jvmInfo !== "object")
                    throw TypeError(".v1.PAgentInfo.jvmInfo: object expected");
                message.jvmInfo = $root.v1.PJvmInfo.fromObject(object.jvmInfo);
            }
            if (object.container != null)
                message.container = Boolean(object.container);
            return message;
        };

        /**
         * Creates a plain object from a PAgentInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PAgentInfo
         * @static
         * @param {v1.PAgentInfo} message PAgentInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PAgentInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.hostname = "";
                object.ip = "";
                object.ports = "";
                object.serviceType = 0;
                object.pid = 0;
                object.agentVersion = "";
                object.vmVersion = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.endTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.endTimestamp = options.longs === String ? "0" : 0;
                object.endStatus = 0;
                object.serverMetaData = null;
                object.jvmInfo = null;
                object.container = false;
            }
            if (message.hostname != null && message.hasOwnProperty("hostname"))
                object.hostname = message.hostname;
            if (message.ip != null && message.hasOwnProperty("ip"))
                object.ip = message.ip;
            if (message.ports != null && message.hasOwnProperty("ports"))
                object.ports = message.ports;
            if (message.serviceType != null && message.hasOwnProperty("serviceType"))
                object.serviceType = message.serviceType;
            if (message.pid != null && message.hasOwnProperty("pid"))
                object.pid = message.pid;
            if (message.agentVersion != null && message.hasOwnProperty("agentVersion"))
                object.agentVersion = message.agentVersion;
            if (message.vmVersion != null && message.hasOwnProperty("vmVersion"))
                object.vmVersion = message.vmVersion;
            if (message.endTimestamp != null && message.hasOwnProperty("endTimestamp"))
                if (typeof message.endTimestamp === "number")
                    object.endTimestamp = options.longs === String ? String(message.endTimestamp) : message.endTimestamp;
                else
                    object.endTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.endTimestamp) : options.longs === Number ? new $util.LongBits(message.endTimestamp.low >>> 0, message.endTimestamp.high >>> 0).toNumber() : message.endTimestamp;
            if (message.endStatus != null && message.hasOwnProperty("endStatus"))
                object.endStatus = message.endStatus;
            if (message.serverMetaData != null && message.hasOwnProperty("serverMetaData"))
                object.serverMetaData = $root.v1.PServerMetaData.toObject(message.serverMetaData, options);
            if (message.jvmInfo != null && message.hasOwnProperty("jvmInfo"))
                object.jvmInfo = $root.v1.PJvmInfo.toObject(message.jvmInfo, options);
            if (message.container != null && message.hasOwnProperty("container"))
                object.container = message.container;
            return object;
        };

        /**
         * Converts this PAgentInfo to JSON.
         * @function toJSON
         * @memberof v1.PAgentInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PAgentInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PAgentInfo;
    })();

    v1.PServerMetaData = (function() {

        /**
         * Properties of a PServerMetaData.
         * @memberof v1
         * @interface IPServerMetaData
         * @property {string|null} [serverInfo] PServerMetaData serverInfo
         * @property {Array.<string>|null} [vmArg] PServerMetaData vmArg
         * @property {Array.<v1.IPServiceInfo>|null} [serviceInfo] PServerMetaData serviceInfo
         */

        /**
         * Constructs a new PServerMetaData.
         * @memberof v1
         * @classdesc Represents a PServerMetaData.
         * @implements IPServerMetaData
         * @constructor
         * @param {v1.IPServerMetaData=} [properties] Properties to set
         */
        function PServerMetaData(properties) {
            this.vmArg = [];
            this.serviceInfo = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PServerMetaData serverInfo.
         * @member {string} serverInfo
         * @memberof v1.PServerMetaData
         * @instance
         */
        PServerMetaData.prototype.serverInfo = "";

        /**
         * PServerMetaData vmArg.
         * @member {Array.<string>} vmArg
         * @memberof v1.PServerMetaData
         * @instance
         */
        PServerMetaData.prototype.vmArg = $util.emptyArray;

        /**
         * PServerMetaData serviceInfo.
         * @member {Array.<v1.IPServiceInfo>} serviceInfo
         * @memberof v1.PServerMetaData
         * @instance
         */
        PServerMetaData.prototype.serviceInfo = $util.emptyArray;

        /**
         * Creates a new PServerMetaData instance using the specified properties.
         * @function create
         * @memberof v1.PServerMetaData
         * @static
         * @param {v1.IPServerMetaData=} [properties] Properties to set
         * @returns {v1.PServerMetaData} PServerMetaData instance
         */
        PServerMetaData.create = function create(properties) {
            return new PServerMetaData(properties);
        };

        /**
         * Encodes the specified PServerMetaData message. Does not implicitly {@link v1.PServerMetaData.verify|verify} messages.
         * @function encode
         * @memberof v1.PServerMetaData
         * @static
         * @param {v1.IPServerMetaData} message PServerMetaData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PServerMetaData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.serverInfo != null && message.hasOwnProperty("serverInfo"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.serverInfo);
            if (message.vmArg != null && message.vmArg.length)
                for (var i = 0; i < message.vmArg.length; ++i)
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.vmArg[i]);
            if (message.serviceInfo != null && message.serviceInfo.length)
                for (var i = 0; i < message.serviceInfo.length; ++i)
                    $root.v1.PServiceInfo.encode(message.serviceInfo[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified PServerMetaData message, length delimited. Does not implicitly {@link v1.PServerMetaData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PServerMetaData
         * @static
         * @param {v1.IPServerMetaData} message PServerMetaData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PServerMetaData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PServerMetaData message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PServerMetaData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PServerMetaData} PServerMetaData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PServerMetaData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PServerMetaData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.serverInfo = reader.string();
                    break;
                case 2:
                    if (!(message.vmArg && message.vmArg.length))
                        message.vmArg = [];
                    message.vmArg.push(reader.string());
                    break;
                case 3:
                    if (!(message.serviceInfo && message.serviceInfo.length))
                        message.serviceInfo = [];
                    message.serviceInfo.push($root.v1.PServiceInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PServerMetaData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PServerMetaData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PServerMetaData} PServerMetaData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PServerMetaData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PServerMetaData message.
         * @function verify
         * @memberof v1.PServerMetaData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PServerMetaData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.serverInfo != null && message.hasOwnProperty("serverInfo"))
                if (!$util.isString(message.serverInfo))
                    return "serverInfo: string expected";
            if (message.vmArg != null && message.hasOwnProperty("vmArg")) {
                if (!Array.isArray(message.vmArg))
                    return "vmArg: array expected";
                for (var i = 0; i < message.vmArg.length; ++i)
                    if (!$util.isString(message.vmArg[i]))
                        return "vmArg: string[] expected";
            }
            if (message.serviceInfo != null && message.hasOwnProperty("serviceInfo")) {
                if (!Array.isArray(message.serviceInfo))
                    return "serviceInfo: array expected";
                for (var i = 0; i < message.serviceInfo.length; ++i) {
                    var error = $root.v1.PServiceInfo.verify(message.serviceInfo[i]);
                    if (error)
                        return "serviceInfo." + error;
                }
            }
            return null;
        };

        /**
         * Creates a PServerMetaData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PServerMetaData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PServerMetaData} PServerMetaData
         */
        PServerMetaData.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PServerMetaData)
                return object;
            var message = new $root.v1.PServerMetaData();
            if (object.serverInfo != null)
                message.serverInfo = String(object.serverInfo);
            if (object.vmArg) {
                if (!Array.isArray(object.vmArg))
                    throw TypeError(".v1.PServerMetaData.vmArg: array expected");
                message.vmArg = [];
                for (var i = 0; i < object.vmArg.length; ++i)
                    message.vmArg[i] = String(object.vmArg[i]);
            }
            if (object.serviceInfo) {
                if (!Array.isArray(object.serviceInfo))
                    throw TypeError(".v1.PServerMetaData.serviceInfo: array expected");
                message.serviceInfo = [];
                for (var i = 0; i < object.serviceInfo.length; ++i) {
                    if (typeof object.serviceInfo[i] !== "object")
                        throw TypeError(".v1.PServerMetaData.serviceInfo: object expected");
                    message.serviceInfo[i] = $root.v1.PServiceInfo.fromObject(object.serviceInfo[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a PServerMetaData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PServerMetaData
         * @static
         * @param {v1.PServerMetaData} message PServerMetaData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PServerMetaData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.vmArg = [];
                object.serviceInfo = [];
            }
            if (options.defaults)
                object.serverInfo = "";
            if (message.serverInfo != null && message.hasOwnProperty("serverInfo"))
                object.serverInfo = message.serverInfo;
            if (message.vmArg && message.vmArg.length) {
                object.vmArg = [];
                for (var j = 0; j < message.vmArg.length; ++j)
                    object.vmArg[j] = message.vmArg[j];
            }
            if (message.serviceInfo && message.serviceInfo.length) {
                object.serviceInfo = [];
                for (var j = 0; j < message.serviceInfo.length; ++j)
                    object.serviceInfo[j] = $root.v1.PServiceInfo.toObject(message.serviceInfo[j], options);
            }
            return object;
        };

        /**
         * Converts this PServerMetaData to JSON.
         * @function toJSON
         * @memberof v1.PServerMetaData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PServerMetaData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PServerMetaData;
    })();

    v1.PServiceInfo = (function() {

        /**
         * Properties of a PServiceInfo.
         * @memberof v1
         * @interface IPServiceInfo
         * @property {string|null} [serviceName] PServiceInfo serviceName
         * @property {Array.<string>|null} [serviceLib] PServiceInfo serviceLib
         */

        /**
         * Constructs a new PServiceInfo.
         * @memberof v1
         * @classdesc Represents a PServiceInfo.
         * @implements IPServiceInfo
         * @constructor
         * @param {v1.IPServiceInfo=} [properties] Properties to set
         */
        function PServiceInfo(properties) {
            this.serviceLib = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PServiceInfo serviceName.
         * @member {string} serviceName
         * @memberof v1.PServiceInfo
         * @instance
         */
        PServiceInfo.prototype.serviceName = "";

        /**
         * PServiceInfo serviceLib.
         * @member {Array.<string>} serviceLib
         * @memberof v1.PServiceInfo
         * @instance
         */
        PServiceInfo.prototype.serviceLib = $util.emptyArray;

        /**
         * Creates a new PServiceInfo instance using the specified properties.
         * @function create
         * @memberof v1.PServiceInfo
         * @static
         * @param {v1.IPServiceInfo=} [properties] Properties to set
         * @returns {v1.PServiceInfo} PServiceInfo instance
         */
        PServiceInfo.create = function create(properties) {
            return new PServiceInfo(properties);
        };

        /**
         * Encodes the specified PServiceInfo message. Does not implicitly {@link v1.PServiceInfo.verify|verify} messages.
         * @function encode
         * @memberof v1.PServiceInfo
         * @static
         * @param {v1.IPServiceInfo} message PServiceInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PServiceInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.serviceName != null && message.hasOwnProperty("serviceName"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.serviceName);
            if (message.serviceLib != null && message.serviceLib.length)
                for (var i = 0; i < message.serviceLib.length; ++i)
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.serviceLib[i]);
            return writer;
        };

        /**
         * Encodes the specified PServiceInfo message, length delimited. Does not implicitly {@link v1.PServiceInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PServiceInfo
         * @static
         * @param {v1.IPServiceInfo} message PServiceInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PServiceInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PServiceInfo message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PServiceInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PServiceInfo} PServiceInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PServiceInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PServiceInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.serviceName = reader.string();
                    break;
                case 2:
                    if (!(message.serviceLib && message.serviceLib.length))
                        message.serviceLib = [];
                    message.serviceLib.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PServiceInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PServiceInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PServiceInfo} PServiceInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PServiceInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PServiceInfo message.
         * @function verify
         * @memberof v1.PServiceInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PServiceInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.serviceName != null && message.hasOwnProperty("serviceName"))
                if (!$util.isString(message.serviceName))
                    return "serviceName: string expected";
            if (message.serviceLib != null && message.hasOwnProperty("serviceLib")) {
                if (!Array.isArray(message.serviceLib))
                    return "serviceLib: array expected";
                for (var i = 0; i < message.serviceLib.length; ++i)
                    if (!$util.isString(message.serviceLib[i]))
                        return "serviceLib: string[] expected";
            }
            return null;
        };

        /**
         * Creates a PServiceInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PServiceInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PServiceInfo} PServiceInfo
         */
        PServiceInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PServiceInfo)
                return object;
            var message = new $root.v1.PServiceInfo();
            if (object.serviceName != null)
                message.serviceName = String(object.serviceName);
            if (object.serviceLib) {
                if (!Array.isArray(object.serviceLib))
                    throw TypeError(".v1.PServiceInfo.serviceLib: array expected");
                message.serviceLib = [];
                for (var i = 0; i < object.serviceLib.length; ++i)
                    message.serviceLib[i] = String(object.serviceLib[i]);
            }
            return message;
        };

        /**
         * Creates a plain object from a PServiceInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PServiceInfo
         * @static
         * @param {v1.PServiceInfo} message PServiceInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PServiceInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.serviceLib = [];
            if (options.defaults)
                object.serviceName = "";
            if (message.serviceName != null && message.hasOwnProperty("serviceName"))
                object.serviceName = message.serviceName;
            if (message.serviceLib && message.serviceLib.length) {
                object.serviceLib = [];
                for (var j = 0; j < message.serviceLib.length; ++j)
                    object.serviceLib[j] = message.serviceLib[j];
            }
            return object;
        };

        /**
         * Converts this PServiceInfo to JSON.
         * @function toJSON
         * @memberof v1.PServiceInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PServiceInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PServiceInfo;
    })();

    v1.PJvmInfo = (function() {

        /**
         * Properties of a PJvmInfo.
         * @memberof v1
         * @interface IPJvmInfo
         * @property {number|null} [version] PJvmInfo version
         * @property {string|null} [vmVersion] PJvmInfo vmVersion
         * @property {v1.PJvmGcType|null} [gcType] PJvmInfo gcType
         */

        /**
         * Constructs a new PJvmInfo.
         * @memberof v1
         * @classdesc Represents a PJvmInfo.
         * @implements IPJvmInfo
         * @constructor
         * @param {v1.IPJvmInfo=} [properties] Properties to set
         */
        function PJvmInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PJvmInfo version.
         * @member {number} version
         * @memberof v1.PJvmInfo
         * @instance
         */
        PJvmInfo.prototype.version = 0;

        /**
         * PJvmInfo vmVersion.
         * @member {string} vmVersion
         * @memberof v1.PJvmInfo
         * @instance
         */
        PJvmInfo.prototype.vmVersion = "";

        /**
         * PJvmInfo gcType.
         * @member {v1.PJvmGcType} gcType
         * @memberof v1.PJvmInfo
         * @instance
         */
        PJvmInfo.prototype.gcType = 0;

        /**
         * Creates a new PJvmInfo instance using the specified properties.
         * @function create
         * @memberof v1.PJvmInfo
         * @static
         * @param {v1.IPJvmInfo=} [properties] Properties to set
         * @returns {v1.PJvmInfo} PJvmInfo instance
         */
        PJvmInfo.create = function create(properties) {
            return new PJvmInfo(properties);
        };

        /**
         * Encodes the specified PJvmInfo message. Does not implicitly {@link v1.PJvmInfo.verify|verify} messages.
         * @function encode
         * @memberof v1.PJvmInfo
         * @static
         * @param {v1.IPJvmInfo} message PJvmInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PJvmInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.version != null && message.hasOwnProperty("version"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.version);
            if (message.vmVersion != null && message.hasOwnProperty("vmVersion"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.vmVersion);
            if (message.gcType != null && message.hasOwnProperty("gcType"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.gcType);
            return writer;
        };

        /**
         * Encodes the specified PJvmInfo message, length delimited. Does not implicitly {@link v1.PJvmInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PJvmInfo
         * @static
         * @param {v1.IPJvmInfo} message PJvmInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PJvmInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PJvmInfo message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PJvmInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PJvmInfo} PJvmInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PJvmInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PJvmInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.version = reader.int32();
                    break;
                case 2:
                    message.vmVersion = reader.string();
                    break;
                case 3:
                    message.gcType = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PJvmInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PJvmInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PJvmInfo} PJvmInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PJvmInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PJvmInfo message.
         * @function verify
         * @memberof v1.PJvmInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PJvmInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.version != null && message.hasOwnProperty("version"))
                if (!$util.isInteger(message.version))
                    return "version: integer expected";
            if (message.vmVersion != null && message.hasOwnProperty("vmVersion"))
                if (!$util.isString(message.vmVersion))
                    return "vmVersion: string expected";
            if (message.gcType != null && message.hasOwnProperty("gcType"))
                switch (message.gcType) {
                default:
                    return "gcType: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                    break;
                }
            return null;
        };

        /**
         * Creates a PJvmInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PJvmInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PJvmInfo} PJvmInfo
         */
        PJvmInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PJvmInfo)
                return object;
            var message = new $root.v1.PJvmInfo();
            if (object.version != null)
                message.version = object.version | 0;
            if (object.vmVersion != null)
                message.vmVersion = String(object.vmVersion);
            switch (object.gcType) {
            case "JVM_GC_TYPE_UNKNOWN":
            case 0:
                message.gcType = 0;
                break;
            case "JVM_GC_TYPE_SERIAL":
            case 1:
                message.gcType = 1;
                break;
            case "JVM_GC_TYPE_PARALLEL":
            case 2:
                message.gcType = 2;
                break;
            case "JVM_GC_TYPE_CMS":
            case 3:
                message.gcType = 3;
                break;
            case "JVM_GC_TYPE_G1":
            case 4:
                message.gcType = 4;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a PJvmInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PJvmInfo
         * @static
         * @param {v1.PJvmInfo} message PJvmInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PJvmInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.version = 0;
                object.vmVersion = "";
                object.gcType = options.enums === String ? "JVM_GC_TYPE_UNKNOWN" : 0;
            }
            if (message.version != null && message.hasOwnProperty("version"))
                object.version = message.version;
            if (message.vmVersion != null && message.hasOwnProperty("vmVersion"))
                object.vmVersion = message.vmVersion;
            if (message.gcType != null && message.hasOwnProperty("gcType"))
                object.gcType = options.enums === String ? $root.v1.PJvmGcType[message.gcType] : message.gcType;
            return object;
        };

        /**
         * Converts this PJvmInfo to JSON.
         * @function toJSON
         * @memberof v1.PJvmInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PJvmInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PJvmInfo;
    })();

    /**
     * PJvmGcType enum.
     * @name v1.PJvmGcType
     * @enum {string}
     * @property {number} JVM_GC_TYPE_UNKNOWN=0 JVM_GC_TYPE_UNKNOWN value
     * @property {number} JVM_GC_TYPE_SERIAL=1 JVM_GC_TYPE_SERIAL value
     * @property {number} JVM_GC_TYPE_PARALLEL=2 JVM_GC_TYPE_PARALLEL value
     * @property {number} JVM_GC_TYPE_CMS=3 JVM_GC_TYPE_CMS value
     * @property {number} JVM_GC_TYPE_G1=4 JVM_GC_TYPE_G1 value
     */
    v1.PJvmGcType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "JVM_GC_TYPE_UNKNOWN"] = 0;
        values[valuesById[1] = "JVM_GC_TYPE_SERIAL"] = 1;
        values[valuesById[2] = "JVM_GC_TYPE_PARALLEL"] = 2;
        values[valuesById[3] = "JVM_GC_TYPE_CMS"] = 3;
        values[valuesById[4] = "JVM_GC_TYPE_G1"] = 4;
        return values;
    })();

    v1.PAgentStat = (function() {

        /**
         * Properties of a PAgentStat.
         * @memberof v1
         * @interface IPAgentStat
         * @property {number|Long|null} [timestamp] PAgentStat timestamp
         * @property {number|Long|null} [collectInterval] PAgentStat collectInterval
         * @property {v1.IPJvmGc|null} [gc] PAgentStat gc
         * @property {v1.IPCpuLoad|null} [cpuLoad] PAgentStat cpuLoad
         * @property {v1.IPTransaction|null} [transaction] PAgentStat transaction
         * @property {v1.IPActiveTrace|null} [activeTrace] PAgentStat activeTrace
         * @property {v1.IPDataSourceList|null} [dataSourceList] PAgentStat dataSourceList
         * @property {v1.IPResponseTime|null} [responseTime] PAgentStat responseTime
         * @property {v1.IPDeadlock|null} [deadlock] PAgentStat deadlock
         * @property {v1.IPFileDescriptor|null} [fileDescriptor] PAgentStat fileDescriptor
         * @property {v1.IPDirectBuffer|null} [directBuffer] PAgentStat directBuffer
         * @property {string|null} [metadata] PAgentStat metadata
         */

        /**
         * Constructs a new PAgentStat.
         * @memberof v1
         * @classdesc Represents a PAgentStat.
         * @implements IPAgentStat
         * @constructor
         * @param {v1.IPAgentStat=} [properties] Properties to set
         */
        function PAgentStat(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PAgentStat timestamp.
         * @member {number|Long} timestamp
         * @memberof v1.PAgentStat
         * @instance
         */
        PAgentStat.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PAgentStat collectInterval.
         * @member {number|Long} collectInterval
         * @memberof v1.PAgentStat
         * @instance
         */
        PAgentStat.prototype.collectInterval = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PAgentStat gc.
         * @member {v1.IPJvmGc|null|undefined} gc
         * @memberof v1.PAgentStat
         * @instance
         */
        PAgentStat.prototype.gc = null;

        /**
         * PAgentStat cpuLoad.
         * @member {v1.IPCpuLoad|null|undefined} cpuLoad
         * @memberof v1.PAgentStat
         * @instance
         */
        PAgentStat.prototype.cpuLoad = null;

        /**
         * PAgentStat transaction.
         * @member {v1.IPTransaction|null|undefined} transaction
         * @memberof v1.PAgentStat
         * @instance
         */
        PAgentStat.prototype.transaction = null;

        /**
         * PAgentStat activeTrace.
         * @member {v1.IPActiveTrace|null|undefined} activeTrace
         * @memberof v1.PAgentStat
         * @instance
         */
        PAgentStat.prototype.activeTrace = null;

        /**
         * PAgentStat dataSourceList.
         * @member {v1.IPDataSourceList|null|undefined} dataSourceList
         * @memberof v1.PAgentStat
         * @instance
         */
        PAgentStat.prototype.dataSourceList = null;

        /**
         * PAgentStat responseTime.
         * @member {v1.IPResponseTime|null|undefined} responseTime
         * @memberof v1.PAgentStat
         * @instance
         */
        PAgentStat.prototype.responseTime = null;

        /**
         * PAgentStat deadlock.
         * @member {v1.IPDeadlock|null|undefined} deadlock
         * @memberof v1.PAgentStat
         * @instance
         */
        PAgentStat.prototype.deadlock = null;

        /**
         * PAgentStat fileDescriptor.
         * @member {v1.IPFileDescriptor|null|undefined} fileDescriptor
         * @memberof v1.PAgentStat
         * @instance
         */
        PAgentStat.prototype.fileDescriptor = null;

        /**
         * PAgentStat directBuffer.
         * @member {v1.IPDirectBuffer|null|undefined} directBuffer
         * @memberof v1.PAgentStat
         * @instance
         */
        PAgentStat.prototype.directBuffer = null;

        /**
         * PAgentStat metadata.
         * @member {string} metadata
         * @memberof v1.PAgentStat
         * @instance
         */
        PAgentStat.prototype.metadata = "";

        /**
         * Creates a new PAgentStat instance using the specified properties.
         * @function create
         * @memberof v1.PAgentStat
         * @static
         * @param {v1.IPAgentStat=} [properties] Properties to set
         * @returns {v1.PAgentStat} PAgentStat instance
         */
        PAgentStat.create = function create(properties) {
            return new PAgentStat(properties);
        };

        /**
         * Encodes the specified PAgentStat message. Does not implicitly {@link v1.PAgentStat.verify|verify} messages.
         * @function encode
         * @memberof v1.PAgentStat
         * @static
         * @param {v1.IPAgentStat} message PAgentStat message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PAgentStat.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.timestamp);
            if (message.collectInterval != null && message.hasOwnProperty("collectInterval"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.collectInterval);
            if (message.gc != null && message.hasOwnProperty("gc"))
                $root.v1.PJvmGc.encode(message.gc, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.cpuLoad != null && message.hasOwnProperty("cpuLoad"))
                $root.v1.PCpuLoad.encode(message.cpuLoad, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.transaction != null && message.hasOwnProperty("transaction"))
                $root.v1.PTransaction.encode(message.transaction, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.activeTrace != null && message.hasOwnProperty("activeTrace"))
                $root.v1.PActiveTrace.encode(message.activeTrace, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.dataSourceList != null && message.hasOwnProperty("dataSourceList"))
                $root.v1.PDataSourceList.encode(message.dataSourceList, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.responseTime != null && message.hasOwnProperty("responseTime"))
                $root.v1.PResponseTime.encode(message.responseTime, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.deadlock != null && message.hasOwnProperty("deadlock"))
                $root.v1.PDeadlock.encode(message.deadlock, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
            if (message.fileDescriptor != null && message.hasOwnProperty("fileDescriptor"))
                $root.v1.PFileDescriptor.encode(message.fileDescriptor, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
            if (message.directBuffer != null && message.hasOwnProperty("directBuffer"))
                $root.v1.PDirectBuffer.encode(message.directBuffer, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
            if (message.metadata != null && message.hasOwnProperty("metadata"))
                writer.uint32(/* id 12, wireType 2 =*/98).string(message.metadata);
            return writer;
        };

        /**
         * Encodes the specified PAgentStat message, length delimited. Does not implicitly {@link v1.PAgentStat.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PAgentStat
         * @static
         * @param {v1.IPAgentStat} message PAgentStat message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PAgentStat.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PAgentStat message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PAgentStat
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PAgentStat} PAgentStat
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PAgentStat.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PAgentStat();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.timestamp = reader.int64();
                    break;
                case 2:
                    message.collectInterval = reader.int64();
                    break;
                case 3:
                    message.gc = $root.v1.PJvmGc.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.cpuLoad = $root.v1.PCpuLoad.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.transaction = $root.v1.PTransaction.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.activeTrace = $root.v1.PActiveTrace.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.dataSourceList = $root.v1.PDataSourceList.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.responseTime = $root.v1.PResponseTime.decode(reader, reader.uint32());
                    break;
                case 9:
                    message.deadlock = $root.v1.PDeadlock.decode(reader, reader.uint32());
                    break;
                case 10:
                    message.fileDescriptor = $root.v1.PFileDescriptor.decode(reader, reader.uint32());
                    break;
                case 11:
                    message.directBuffer = $root.v1.PDirectBuffer.decode(reader, reader.uint32());
                    break;
                case 12:
                    message.metadata = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PAgentStat message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PAgentStat
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PAgentStat} PAgentStat
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PAgentStat.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PAgentStat message.
         * @function verify
         * @memberof v1.PAgentStat
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PAgentStat.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.collectInterval != null && message.hasOwnProperty("collectInterval"))
                if (!$util.isInteger(message.collectInterval) && !(message.collectInterval && $util.isInteger(message.collectInterval.low) && $util.isInteger(message.collectInterval.high)))
                    return "collectInterval: integer|Long expected";
            if (message.gc != null && message.hasOwnProperty("gc")) {
                var error = $root.v1.PJvmGc.verify(message.gc);
                if (error)
                    return "gc." + error;
            }
            if (message.cpuLoad != null && message.hasOwnProperty("cpuLoad")) {
                var error = $root.v1.PCpuLoad.verify(message.cpuLoad);
                if (error)
                    return "cpuLoad." + error;
            }
            if (message.transaction != null && message.hasOwnProperty("transaction")) {
                var error = $root.v1.PTransaction.verify(message.transaction);
                if (error)
                    return "transaction." + error;
            }
            if (message.activeTrace != null && message.hasOwnProperty("activeTrace")) {
                var error = $root.v1.PActiveTrace.verify(message.activeTrace);
                if (error)
                    return "activeTrace." + error;
            }
            if (message.dataSourceList != null && message.hasOwnProperty("dataSourceList")) {
                var error = $root.v1.PDataSourceList.verify(message.dataSourceList);
                if (error)
                    return "dataSourceList." + error;
            }
            if (message.responseTime != null && message.hasOwnProperty("responseTime")) {
                var error = $root.v1.PResponseTime.verify(message.responseTime);
                if (error)
                    return "responseTime." + error;
            }
            if (message.deadlock != null && message.hasOwnProperty("deadlock")) {
                var error = $root.v1.PDeadlock.verify(message.deadlock);
                if (error)
                    return "deadlock." + error;
            }
            if (message.fileDescriptor != null && message.hasOwnProperty("fileDescriptor")) {
                var error = $root.v1.PFileDescriptor.verify(message.fileDescriptor);
                if (error)
                    return "fileDescriptor." + error;
            }
            if (message.directBuffer != null && message.hasOwnProperty("directBuffer")) {
                var error = $root.v1.PDirectBuffer.verify(message.directBuffer);
                if (error)
                    return "directBuffer." + error;
            }
            if (message.metadata != null && message.hasOwnProperty("metadata"))
                if (!$util.isString(message.metadata))
                    return "metadata: string expected";
            return null;
        };

        /**
         * Creates a PAgentStat message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PAgentStat
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PAgentStat} PAgentStat
         */
        PAgentStat.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PAgentStat)
                return object;
            var message = new $root.v1.PAgentStat();
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            if (object.collectInterval != null)
                if ($util.Long)
                    (message.collectInterval = $util.Long.fromValue(object.collectInterval)).unsigned = false;
                else if (typeof object.collectInterval === "string")
                    message.collectInterval = parseInt(object.collectInterval, 10);
                else if (typeof object.collectInterval === "number")
                    message.collectInterval = object.collectInterval;
                else if (typeof object.collectInterval === "object")
                    message.collectInterval = new $util.LongBits(object.collectInterval.low >>> 0, object.collectInterval.high >>> 0).toNumber();
            if (object.gc != null) {
                if (typeof object.gc !== "object")
                    throw TypeError(".v1.PAgentStat.gc: object expected");
                message.gc = $root.v1.PJvmGc.fromObject(object.gc);
            }
            if (object.cpuLoad != null) {
                if (typeof object.cpuLoad !== "object")
                    throw TypeError(".v1.PAgentStat.cpuLoad: object expected");
                message.cpuLoad = $root.v1.PCpuLoad.fromObject(object.cpuLoad);
            }
            if (object.transaction != null) {
                if (typeof object.transaction !== "object")
                    throw TypeError(".v1.PAgentStat.transaction: object expected");
                message.transaction = $root.v1.PTransaction.fromObject(object.transaction);
            }
            if (object.activeTrace != null) {
                if (typeof object.activeTrace !== "object")
                    throw TypeError(".v1.PAgentStat.activeTrace: object expected");
                message.activeTrace = $root.v1.PActiveTrace.fromObject(object.activeTrace);
            }
            if (object.dataSourceList != null) {
                if (typeof object.dataSourceList !== "object")
                    throw TypeError(".v1.PAgentStat.dataSourceList: object expected");
                message.dataSourceList = $root.v1.PDataSourceList.fromObject(object.dataSourceList);
            }
            if (object.responseTime != null) {
                if (typeof object.responseTime !== "object")
                    throw TypeError(".v1.PAgentStat.responseTime: object expected");
                message.responseTime = $root.v1.PResponseTime.fromObject(object.responseTime);
            }
            if (object.deadlock != null) {
                if (typeof object.deadlock !== "object")
                    throw TypeError(".v1.PAgentStat.deadlock: object expected");
                message.deadlock = $root.v1.PDeadlock.fromObject(object.deadlock);
            }
            if (object.fileDescriptor != null) {
                if (typeof object.fileDescriptor !== "object")
                    throw TypeError(".v1.PAgentStat.fileDescriptor: object expected");
                message.fileDescriptor = $root.v1.PFileDescriptor.fromObject(object.fileDescriptor);
            }
            if (object.directBuffer != null) {
                if (typeof object.directBuffer !== "object")
                    throw TypeError(".v1.PAgentStat.directBuffer: object expected");
                message.directBuffer = $root.v1.PDirectBuffer.fromObject(object.directBuffer);
            }
            if (object.metadata != null)
                message.metadata = String(object.metadata);
            return message;
        };

        /**
         * Creates a plain object from a PAgentStat message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PAgentStat
         * @static
         * @param {v1.PAgentStat} message PAgentStat
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PAgentStat.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.collectInterval = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.collectInterval = options.longs === String ? "0" : 0;
                object.gc = null;
                object.cpuLoad = null;
                object.transaction = null;
                object.activeTrace = null;
                object.dataSourceList = null;
                object.responseTime = null;
                object.deadlock = null;
                object.fileDescriptor = null;
                object.directBuffer = null;
                object.metadata = "";
            }
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            if (message.collectInterval != null && message.hasOwnProperty("collectInterval"))
                if (typeof message.collectInterval === "number")
                    object.collectInterval = options.longs === String ? String(message.collectInterval) : message.collectInterval;
                else
                    object.collectInterval = options.longs === String ? $util.Long.prototype.toString.call(message.collectInterval) : options.longs === Number ? new $util.LongBits(message.collectInterval.low >>> 0, message.collectInterval.high >>> 0).toNumber() : message.collectInterval;
            if (message.gc != null && message.hasOwnProperty("gc"))
                object.gc = $root.v1.PJvmGc.toObject(message.gc, options);
            if (message.cpuLoad != null && message.hasOwnProperty("cpuLoad"))
                object.cpuLoad = $root.v1.PCpuLoad.toObject(message.cpuLoad, options);
            if (message.transaction != null && message.hasOwnProperty("transaction"))
                object.transaction = $root.v1.PTransaction.toObject(message.transaction, options);
            if (message.activeTrace != null && message.hasOwnProperty("activeTrace"))
                object.activeTrace = $root.v1.PActiveTrace.toObject(message.activeTrace, options);
            if (message.dataSourceList != null && message.hasOwnProperty("dataSourceList"))
                object.dataSourceList = $root.v1.PDataSourceList.toObject(message.dataSourceList, options);
            if (message.responseTime != null && message.hasOwnProperty("responseTime"))
                object.responseTime = $root.v1.PResponseTime.toObject(message.responseTime, options);
            if (message.deadlock != null && message.hasOwnProperty("deadlock"))
                object.deadlock = $root.v1.PDeadlock.toObject(message.deadlock, options);
            if (message.fileDescriptor != null && message.hasOwnProperty("fileDescriptor"))
                object.fileDescriptor = $root.v1.PFileDescriptor.toObject(message.fileDescriptor, options);
            if (message.directBuffer != null && message.hasOwnProperty("directBuffer"))
                object.directBuffer = $root.v1.PDirectBuffer.toObject(message.directBuffer, options);
            if (message.metadata != null && message.hasOwnProperty("metadata"))
                object.metadata = message.metadata;
            return object;
        };

        /**
         * Converts this PAgentStat to JSON.
         * @function toJSON
         * @memberof v1.PAgentStat
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PAgentStat.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PAgentStat;
    })();

    v1.PAgentStatBatch = (function() {

        /**
         * Properties of a PAgentStatBatch.
         * @memberof v1
         * @interface IPAgentStatBatch
         * @property {Array.<v1.IPAgentStat>|null} [agentStat] PAgentStatBatch agentStat
         */

        /**
         * Constructs a new PAgentStatBatch.
         * @memberof v1
         * @classdesc Represents a PAgentStatBatch.
         * @implements IPAgentStatBatch
         * @constructor
         * @param {v1.IPAgentStatBatch=} [properties] Properties to set
         */
        function PAgentStatBatch(properties) {
            this.agentStat = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PAgentStatBatch agentStat.
         * @member {Array.<v1.IPAgentStat>} agentStat
         * @memberof v1.PAgentStatBatch
         * @instance
         */
        PAgentStatBatch.prototype.agentStat = $util.emptyArray;

        /**
         * Creates a new PAgentStatBatch instance using the specified properties.
         * @function create
         * @memberof v1.PAgentStatBatch
         * @static
         * @param {v1.IPAgentStatBatch=} [properties] Properties to set
         * @returns {v1.PAgentStatBatch} PAgentStatBatch instance
         */
        PAgentStatBatch.create = function create(properties) {
            return new PAgentStatBatch(properties);
        };

        /**
         * Encodes the specified PAgentStatBatch message. Does not implicitly {@link v1.PAgentStatBatch.verify|verify} messages.
         * @function encode
         * @memberof v1.PAgentStatBatch
         * @static
         * @param {v1.IPAgentStatBatch} message PAgentStatBatch message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PAgentStatBatch.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.agentStat != null && message.agentStat.length)
                for (var i = 0; i < message.agentStat.length; ++i)
                    $root.v1.PAgentStat.encode(message.agentStat[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified PAgentStatBatch message, length delimited. Does not implicitly {@link v1.PAgentStatBatch.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PAgentStatBatch
         * @static
         * @param {v1.IPAgentStatBatch} message PAgentStatBatch message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PAgentStatBatch.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PAgentStatBatch message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PAgentStatBatch
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PAgentStatBatch} PAgentStatBatch
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PAgentStatBatch.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PAgentStatBatch();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.agentStat && message.agentStat.length))
                        message.agentStat = [];
                    message.agentStat.push($root.v1.PAgentStat.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PAgentStatBatch message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PAgentStatBatch
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PAgentStatBatch} PAgentStatBatch
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PAgentStatBatch.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PAgentStatBatch message.
         * @function verify
         * @memberof v1.PAgentStatBatch
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PAgentStatBatch.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.agentStat != null && message.hasOwnProperty("agentStat")) {
                if (!Array.isArray(message.agentStat))
                    return "agentStat: array expected";
                for (var i = 0; i < message.agentStat.length; ++i) {
                    var error = $root.v1.PAgentStat.verify(message.agentStat[i]);
                    if (error)
                        return "agentStat." + error;
                }
            }
            return null;
        };

        /**
         * Creates a PAgentStatBatch message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PAgentStatBatch
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PAgentStatBatch} PAgentStatBatch
         */
        PAgentStatBatch.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PAgentStatBatch)
                return object;
            var message = new $root.v1.PAgentStatBatch();
            if (object.agentStat) {
                if (!Array.isArray(object.agentStat))
                    throw TypeError(".v1.PAgentStatBatch.agentStat: array expected");
                message.agentStat = [];
                for (var i = 0; i < object.agentStat.length; ++i) {
                    if (typeof object.agentStat[i] !== "object")
                        throw TypeError(".v1.PAgentStatBatch.agentStat: object expected");
                    message.agentStat[i] = $root.v1.PAgentStat.fromObject(object.agentStat[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a PAgentStatBatch message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PAgentStatBatch
         * @static
         * @param {v1.PAgentStatBatch} message PAgentStatBatch
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PAgentStatBatch.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.agentStat = [];
            if (message.agentStat && message.agentStat.length) {
                object.agentStat = [];
                for (var j = 0; j < message.agentStat.length; ++j)
                    object.agentStat[j] = $root.v1.PAgentStat.toObject(message.agentStat[j], options);
            }
            return object;
        };

        /**
         * Converts this PAgentStatBatch to JSON.
         * @function toJSON
         * @memberof v1.PAgentStatBatch
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PAgentStatBatch.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PAgentStatBatch;
    })();

    v1.PDataSource = (function() {

        /**
         * Properties of a PDataSource.
         * @memberof v1
         * @interface IPDataSource
         * @property {number|null} [id] PDataSource id
         * @property {number|null} [serviceTypeCode] PDataSource serviceTypeCode
         * @property {string|null} [databaseName] PDataSource databaseName
         * @property {string|null} [url] PDataSource url
         * @property {number|null} [activeConnectionSize] PDataSource activeConnectionSize
         * @property {number|null} [maxConnectionSize] PDataSource maxConnectionSize
         */

        /**
         * Constructs a new PDataSource.
         * @memberof v1
         * @classdesc Represents a PDataSource.
         * @implements IPDataSource
         * @constructor
         * @param {v1.IPDataSource=} [properties] Properties to set
         */
        function PDataSource(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PDataSource id.
         * @member {number} id
         * @memberof v1.PDataSource
         * @instance
         */
        PDataSource.prototype.id = 0;

        /**
         * PDataSource serviceTypeCode.
         * @member {number} serviceTypeCode
         * @memberof v1.PDataSource
         * @instance
         */
        PDataSource.prototype.serviceTypeCode = 0;

        /**
         * PDataSource databaseName.
         * @member {string} databaseName
         * @memberof v1.PDataSource
         * @instance
         */
        PDataSource.prototype.databaseName = "";

        /**
         * PDataSource url.
         * @member {string} url
         * @memberof v1.PDataSource
         * @instance
         */
        PDataSource.prototype.url = "";

        /**
         * PDataSource activeConnectionSize.
         * @member {number} activeConnectionSize
         * @memberof v1.PDataSource
         * @instance
         */
        PDataSource.prototype.activeConnectionSize = 0;

        /**
         * PDataSource maxConnectionSize.
         * @member {number} maxConnectionSize
         * @memberof v1.PDataSource
         * @instance
         */
        PDataSource.prototype.maxConnectionSize = 0;

        /**
         * Creates a new PDataSource instance using the specified properties.
         * @function create
         * @memberof v1.PDataSource
         * @static
         * @param {v1.IPDataSource=} [properties] Properties to set
         * @returns {v1.PDataSource} PDataSource instance
         */
        PDataSource.create = function create(properties) {
            return new PDataSource(properties);
        };

        /**
         * Encodes the specified PDataSource message. Does not implicitly {@link v1.PDataSource.verify|verify} messages.
         * @function encode
         * @memberof v1.PDataSource
         * @static
         * @param {v1.IPDataSource} message PDataSource message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PDataSource.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && message.hasOwnProperty("id"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
            if (message.serviceTypeCode != null && message.hasOwnProperty("serviceTypeCode"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.serviceTypeCode);
            if (message.databaseName != null && message.hasOwnProperty("databaseName"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.databaseName);
            if (message.url != null && message.hasOwnProperty("url"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.url);
            if (message.activeConnectionSize != null && message.hasOwnProperty("activeConnectionSize"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.activeConnectionSize);
            if (message.maxConnectionSize != null && message.hasOwnProperty("maxConnectionSize"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.maxConnectionSize);
            return writer;
        };

        /**
         * Encodes the specified PDataSource message, length delimited. Does not implicitly {@link v1.PDataSource.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PDataSource
         * @static
         * @param {v1.IPDataSource} message PDataSource message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PDataSource.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PDataSource message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PDataSource
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PDataSource} PDataSource
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PDataSource.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PDataSource();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.id = reader.int32();
                    break;
                case 2:
                    message.serviceTypeCode = reader.int32();
                    break;
                case 3:
                    message.databaseName = reader.string();
                    break;
                case 4:
                    message.url = reader.string();
                    break;
                case 5:
                    message.activeConnectionSize = reader.int32();
                    break;
                case 6:
                    message.maxConnectionSize = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PDataSource message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PDataSource
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PDataSource} PDataSource
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PDataSource.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PDataSource message.
         * @function verify
         * @memberof v1.PDataSource
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PDataSource.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            if (message.serviceTypeCode != null && message.hasOwnProperty("serviceTypeCode"))
                if (!$util.isInteger(message.serviceTypeCode))
                    return "serviceTypeCode: integer expected";
            if (message.databaseName != null && message.hasOwnProperty("databaseName"))
                if (!$util.isString(message.databaseName))
                    return "databaseName: string expected";
            if (message.url != null && message.hasOwnProperty("url"))
                if (!$util.isString(message.url))
                    return "url: string expected";
            if (message.activeConnectionSize != null && message.hasOwnProperty("activeConnectionSize"))
                if (!$util.isInteger(message.activeConnectionSize))
                    return "activeConnectionSize: integer expected";
            if (message.maxConnectionSize != null && message.hasOwnProperty("maxConnectionSize"))
                if (!$util.isInteger(message.maxConnectionSize))
                    return "maxConnectionSize: integer expected";
            return null;
        };

        /**
         * Creates a PDataSource message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PDataSource
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PDataSource} PDataSource
         */
        PDataSource.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PDataSource)
                return object;
            var message = new $root.v1.PDataSource();
            if (object.id != null)
                message.id = object.id | 0;
            if (object.serviceTypeCode != null)
                message.serviceTypeCode = object.serviceTypeCode | 0;
            if (object.databaseName != null)
                message.databaseName = String(object.databaseName);
            if (object.url != null)
                message.url = String(object.url);
            if (object.activeConnectionSize != null)
                message.activeConnectionSize = object.activeConnectionSize | 0;
            if (object.maxConnectionSize != null)
                message.maxConnectionSize = object.maxConnectionSize | 0;
            return message;
        };

        /**
         * Creates a plain object from a PDataSource message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PDataSource
         * @static
         * @param {v1.PDataSource} message PDataSource
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PDataSource.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.id = 0;
                object.serviceTypeCode = 0;
                object.databaseName = "";
                object.url = "";
                object.activeConnectionSize = 0;
                object.maxConnectionSize = 0;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.serviceTypeCode != null && message.hasOwnProperty("serviceTypeCode"))
                object.serviceTypeCode = message.serviceTypeCode;
            if (message.databaseName != null && message.hasOwnProperty("databaseName"))
                object.databaseName = message.databaseName;
            if (message.url != null && message.hasOwnProperty("url"))
                object.url = message.url;
            if (message.activeConnectionSize != null && message.hasOwnProperty("activeConnectionSize"))
                object.activeConnectionSize = message.activeConnectionSize;
            if (message.maxConnectionSize != null && message.hasOwnProperty("maxConnectionSize"))
                object.maxConnectionSize = message.maxConnectionSize;
            return object;
        };

        /**
         * Converts this PDataSource to JSON.
         * @function toJSON
         * @memberof v1.PDataSource
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PDataSource.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PDataSource;
    })();

    v1.PDataSourceList = (function() {

        /**
         * Properties of a PDataSourceList.
         * @memberof v1
         * @interface IPDataSourceList
         * @property {Array.<v1.IPDataSource>|null} [dataSource] PDataSourceList dataSource
         */

        /**
         * Constructs a new PDataSourceList.
         * @memberof v1
         * @classdesc Represents a PDataSourceList.
         * @implements IPDataSourceList
         * @constructor
         * @param {v1.IPDataSourceList=} [properties] Properties to set
         */
        function PDataSourceList(properties) {
            this.dataSource = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PDataSourceList dataSource.
         * @member {Array.<v1.IPDataSource>} dataSource
         * @memberof v1.PDataSourceList
         * @instance
         */
        PDataSourceList.prototype.dataSource = $util.emptyArray;

        /**
         * Creates a new PDataSourceList instance using the specified properties.
         * @function create
         * @memberof v1.PDataSourceList
         * @static
         * @param {v1.IPDataSourceList=} [properties] Properties to set
         * @returns {v1.PDataSourceList} PDataSourceList instance
         */
        PDataSourceList.create = function create(properties) {
            return new PDataSourceList(properties);
        };

        /**
         * Encodes the specified PDataSourceList message. Does not implicitly {@link v1.PDataSourceList.verify|verify} messages.
         * @function encode
         * @memberof v1.PDataSourceList
         * @static
         * @param {v1.IPDataSourceList} message PDataSourceList message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PDataSourceList.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.dataSource != null && message.dataSource.length)
                for (var i = 0; i < message.dataSource.length; ++i)
                    $root.v1.PDataSource.encode(message.dataSource[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified PDataSourceList message, length delimited. Does not implicitly {@link v1.PDataSourceList.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PDataSourceList
         * @static
         * @param {v1.IPDataSourceList} message PDataSourceList message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PDataSourceList.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PDataSourceList message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PDataSourceList
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PDataSourceList} PDataSourceList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PDataSourceList.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PDataSourceList();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.dataSource && message.dataSource.length))
                        message.dataSource = [];
                    message.dataSource.push($root.v1.PDataSource.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PDataSourceList message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PDataSourceList
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PDataSourceList} PDataSourceList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PDataSourceList.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PDataSourceList message.
         * @function verify
         * @memberof v1.PDataSourceList
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PDataSourceList.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.dataSource != null && message.hasOwnProperty("dataSource")) {
                if (!Array.isArray(message.dataSource))
                    return "dataSource: array expected";
                for (var i = 0; i < message.dataSource.length; ++i) {
                    var error = $root.v1.PDataSource.verify(message.dataSource[i]);
                    if (error)
                        return "dataSource." + error;
                }
            }
            return null;
        };

        /**
         * Creates a PDataSourceList message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PDataSourceList
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PDataSourceList} PDataSourceList
         */
        PDataSourceList.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PDataSourceList)
                return object;
            var message = new $root.v1.PDataSourceList();
            if (object.dataSource) {
                if (!Array.isArray(object.dataSource))
                    throw TypeError(".v1.PDataSourceList.dataSource: array expected");
                message.dataSource = [];
                for (var i = 0; i < object.dataSource.length; ++i) {
                    if (typeof object.dataSource[i] !== "object")
                        throw TypeError(".v1.PDataSourceList.dataSource: object expected");
                    message.dataSource[i] = $root.v1.PDataSource.fromObject(object.dataSource[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a PDataSourceList message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PDataSourceList
         * @static
         * @param {v1.PDataSourceList} message PDataSourceList
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PDataSourceList.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.dataSource = [];
            if (message.dataSource && message.dataSource.length) {
                object.dataSource = [];
                for (var j = 0; j < message.dataSource.length; ++j)
                    object.dataSource[j] = $root.v1.PDataSource.toObject(message.dataSource[j], options);
            }
            return object;
        };

        /**
         * Converts this PDataSourceList to JSON.
         * @function toJSON
         * @memberof v1.PDataSourceList
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PDataSourceList.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PDataSourceList;
    })();

    v1.PFileDescriptor = (function() {

        /**
         * Properties of a PFileDescriptor.
         * @memberof v1
         * @interface IPFileDescriptor
         * @property {number|Long|null} [openFileDescriptorCount] PFileDescriptor openFileDescriptorCount
         */

        /**
         * Constructs a new PFileDescriptor.
         * @memberof v1
         * @classdesc Represents a PFileDescriptor.
         * @implements IPFileDescriptor
         * @constructor
         * @param {v1.IPFileDescriptor=} [properties] Properties to set
         */
        function PFileDescriptor(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PFileDescriptor openFileDescriptorCount.
         * @member {number|Long} openFileDescriptorCount
         * @memberof v1.PFileDescriptor
         * @instance
         */
        PFileDescriptor.prototype.openFileDescriptorCount = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new PFileDescriptor instance using the specified properties.
         * @function create
         * @memberof v1.PFileDescriptor
         * @static
         * @param {v1.IPFileDescriptor=} [properties] Properties to set
         * @returns {v1.PFileDescriptor} PFileDescriptor instance
         */
        PFileDescriptor.create = function create(properties) {
            return new PFileDescriptor(properties);
        };

        /**
         * Encodes the specified PFileDescriptor message. Does not implicitly {@link v1.PFileDescriptor.verify|verify} messages.
         * @function encode
         * @memberof v1.PFileDescriptor
         * @static
         * @param {v1.IPFileDescriptor} message PFileDescriptor message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PFileDescriptor.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.openFileDescriptorCount != null && message.hasOwnProperty("openFileDescriptorCount"))
                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.openFileDescriptorCount);
            return writer;
        };

        /**
         * Encodes the specified PFileDescriptor message, length delimited. Does not implicitly {@link v1.PFileDescriptor.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PFileDescriptor
         * @static
         * @param {v1.IPFileDescriptor} message PFileDescriptor message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PFileDescriptor.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PFileDescriptor message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PFileDescriptor
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PFileDescriptor} PFileDescriptor
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PFileDescriptor.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PFileDescriptor();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.openFileDescriptorCount = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PFileDescriptor message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PFileDescriptor
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PFileDescriptor} PFileDescriptor
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PFileDescriptor.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PFileDescriptor message.
         * @function verify
         * @memberof v1.PFileDescriptor
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PFileDescriptor.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.openFileDescriptorCount != null && message.hasOwnProperty("openFileDescriptorCount"))
                if (!$util.isInteger(message.openFileDescriptorCount) && !(message.openFileDescriptorCount && $util.isInteger(message.openFileDescriptorCount.low) && $util.isInteger(message.openFileDescriptorCount.high)))
                    return "openFileDescriptorCount: integer|Long expected";
            return null;
        };

        /**
         * Creates a PFileDescriptor message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PFileDescriptor
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PFileDescriptor} PFileDescriptor
         */
        PFileDescriptor.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PFileDescriptor)
                return object;
            var message = new $root.v1.PFileDescriptor();
            if (object.openFileDescriptorCount != null)
                if ($util.Long)
                    (message.openFileDescriptorCount = $util.Long.fromValue(object.openFileDescriptorCount)).unsigned = false;
                else if (typeof object.openFileDescriptorCount === "string")
                    message.openFileDescriptorCount = parseInt(object.openFileDescriptorCount, 10);
                else if (typeof object.openFileDescriptorCount === "number")
                    message.openFileDescriptorCount = object.openFileDescriptorCount;
                else if (typeof object.openFileDescriptorCount === "object")
                    message.openFileDescriptorCount = new $util.LongBits(object.openFileDescriptorCount.low >>> 0, object.openFileDescriptorCount.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a PFileDescriptor message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PFileDescriptor
         * @static
         * @param {v1.PFileDescriptor} message PFileDescriptor
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PFileDescriptor.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.openFileDescriptorCount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.openFileDescriptorCount = options.longs === String ? "0" : 0;
            if (message.openFileDescriptorCount != null && message.hasOwnProperty("openFileDescriptorCount"))
                if (typeof message.openFileDescriptorCount === "number")
                    object.openFileDescriptorCount = options.longs === String ? String(message.openFileDescriptorCount) : message.openFileDescriptorCount;
                else
                    object.openFileDescriptorCount = options.longs === String ? $util.Long.prototype.toString.call(message.openFileDescriptorCount) : options.longs === Number ? new $util.LongBits(message.openFileDescriptorCount.low >>> 0, message.openFileDescriptorCount.high >>> 0).toNumber() : message.openFileDescriptorCount;
            return object;
        };

        /**
         * Converts this PFileDescriptor to JSON.
         * @function toJSON
         * @memberof v1.PFileDescriptor
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PFileDescriptor.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PFileDescriptor;
    })();

    v1.PJvmGc = (function() {

        /**
         * Properties of a PJvmGc.
         * @memberof v1
         * @interface IPJvmGc
         * @property {v1.PJvmGcType|null} [type] PJvmGc type
         * @property {number|Long|null} [jvmMemoryHeapUsed] PJvmGc jvmMemoryHeapUsed
         * @property {number|Long|null} [jvmMemoryHeapMax] PJvmGc jvmMemoryHeapMax
         * @property {number|Long|null} [jvmMemoryNonHeapUsed] PJvmGc jvmMemoryNonHeapUsed
         * @property {number|Long|null} [jvmMemoryNonHeapMax] PJvmGc jvmMemoryNonHeapMax
         * @property {number|Long|null} [jvmGcOldCount] PJvmGc jvmGcOldCount
         * @property {number|Long|null} [jvmGcOldTime] PJvmGc jvmGcOldTime
         * @property {v1.IPJvmGcDetailed|null} [jvmGcDetailed] PJvmGc jvmGcDetailed
         */

        /**
         * Constructs a new PJvmGc.
         * @memberof v1
         * @classdesc Represents a PJvmGc.
         * @implements IPJvmGc
         * @constructor
         * @param {v1.IPJvmGc=} [properties] Properties to set
         */
        function PJvmGc(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PJvmGc type.
         * @member {v1.PJvmGcType} type
         * @memberof v1.PJvmGc
         * @instance
         */
        PJvmGc.prototype.type = 0;

        /**
         * PJvmGc jvmMemoryHeapUsed.
         * @member {number|Long} jvmMemoryHeapUsed
         * @memberof v1.PJvmGc
         * @instance
         */
        PJvmGc.prototype.jvmMemoryHeapUsed = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PJvmGc jvmMemoryHeapMax.
         * @member {number|Long} jvmMemoryHeapMax
         * @memberof v1.PJvmGc
         * @instance
         */
        PJvmGc.prototype.jvmMemoryHeapMax = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PJvmGc jvmMemoryNonHeapUsed.
         * @member {number|Long} jvmMemoryNonHeapUsed
         * @memberof v1.PJvmGc
         * @instance
         */
        PJvmGc.prototype.jvmMemoryNonHeapUsed = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PJvmGc jvmMemoryNonHeapMax.
         * @member {number|Long} jvmMemoryNonHeapMax
         * @memberof v1.PJvmGc
         * @instance
         */
        PJvmGc.prototype.jvmMemoryNonHeapMax = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PJvmGc jvmGcOldCount.
         * @member {number|Long} jvmGcOldCount
         * @memberof v1.PJvmGc
         * @instance
         */
        PJvmGc.prototype.jvmGcOldCount = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PJvmGc jvmGcOldTime.
         * @member {number|Long} jvmGcOldTime
         * @memberof v1.PJvmGc
         * @instance
         */
        PJvmGc.prototype.jvmGcOldTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PJvmGc jvmGcDetailed.
         * @member {v1.IPJvmGcDetailed|null|undefined} jvmGcDetailed
         * @memberof v1.PJvmGc
         * @instance
         */
        PJvmGc.prototype.jvmGcDetailed = null;

        /**
         * Creates a new PJvmGc instance using the specified properties.
         * @function create
         * @memberof v1.PJvmGc
         * @static
         * @param {v1.IPJvmGc=} [properties] Properties to set
         * @returns {v1.PJvmGc} PJvmGc instance
         */
        PJvmGc.create = function create(properties) {
            return new PJvmGc(properties);
        };

        /**
         * Encodes the specified PJvmGc message. Does not implicitly {@link v1.PJvmGc.verify|verify} messages.
         * @function encode
         * @memberof v1.PJvmGc
         * @static
         * @param {v1.IPJvmGc} message PJvmGc message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PJvmGc.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.type != null && message.hasOwnProperty("type"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
            if (message.jvmMemoryHeapUsed != null && message.hasOwnProperty("jvmMemoryHeapUsed"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.jvmMemoryHeapUsed);
            if (message.jvmMemoryHeapMax != null && message.hasOwnProperty("jvmMemoryHeapMax"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.jvmMemoryHeapMax);
            if (message.jvmMemoryNonHeapUsed != null && message.hasOwnProperty("jvmMemoryNonHeapUsed"))
                writer.uint32(/* id 4, wireType 0 =*/32).int64(message.jvmMemoryNonHeapUsed);
            if (message.jvmMemoryNonHeapMax != null && message.hasOwnProperty("jvmMemoryNonHeapMax"))
                writer.uint32(/* id 5, wireType 0 =*/40).int64(message.jvmMemoryNonHeapMax);
            if (message.jvmGcOldCount != null && message.hasOwnProperty("jvmGcOldCount"))
                writer.uint32(/* id 6, wireType 0 =*/48).int64(message.jvmGcOldCount);
            if (message.jvmGcOldTime != null && message.hasOwnProperty("jvmGcOldTime"))
                writer.uint32(/* id 7, wireType 0 =*/56).int64(message.jvmGcOldTime);
            if (message.jvmGcDetailed != null && message.hasOwnProperty("jvmGcDetailed"))
                $root.v1.PJvmGcDetailed.encode(message.jvmGcDetailed, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified PJvmGc message, length delimited. Does not implicitly {@link v1.PJvmGc.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PJvmGc
         * @static
         * @param {v1.IPJvmGc} message PJvmGc message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PJvmGc.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PJvmGc message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PJvmGc
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PJvmGc} PJvmGc
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PJvmGc.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PJvmGc();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.type = reader.int32();
                    break;
                case 2:
                    message.jvmMemoryHeapUsed = reader.int64();
                    break;
                case 3:
                    message.jvmMemoryHeapMax = reader.int64();
                    break;
                case 4:
                    message.jvmMemoryNonHeapUsed = reader.int64();
                    break;
                case 5:
                    message.jvmMemoryNonHeapMax = reader.int64();
                    break;
                case 6:
                    message.jvmGcOldCount = reader.int64();
                    break;
                case 7:
                    message.jvmGcOldTime = reader.int64();
                    break;
                case 8:
                    message.jvmGcDetailed = $root.v1.PJvmGcDetailed.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PJvmGc message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PJvmGc
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PJvmGc} PJvmGc
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PJvmGc.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PJvmGc message.
         * @function verify
         * @memberof v1.PJvmGc
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PJvmGc.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.type != null && message.hasOwnProperty("type"))
                switch (message.type) {
                default:
                    return "type: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                    break;
                }
            if (message.jvmMemoryHeapUsed != null && message.hasOwnProperty("jvmMemoryHeapUsed"))
                if (!$util.isInteger(message.jvmMemoryHeapUsed) && !(message.jvmMemoryHeapUsed && $util.isInteger(message.jvmMemoryHeapUsed.low) && $util.isInteger(message.jvmMemoryHeapUsed.high)))
                    return "jvmMemoryHeapUsed: integer|Long expected";
            if (message.jvmMemoryHeapMax != null && message.hasOwnProperty("jvmMemoryHeapMax"))
                if (!$util.isInteger(message.jvmMemoryHeapMax) && !(message.jvmMemoryHeapMax && $util.isInteger(message.jvmMemoryHeapMax.low) && $util.isInteger(message.jvmMemoryHeapMax.high)))
                    return "jvmMemoryHeapMax: integer|Long expected";
            if (message.jvmMemoryNonHeapUsed != null && message.hasOwnProperty("jvmMemoryNonHeapUsed"))
                if (!$util.isInteger(message.jvmMemoryNonHeapUsed) && !(message.jvmMemoryNonHeapUsed && $util.isInteger(message.jvmMemoryNonHeapUsed.low) && $util.isInteger(message.jvmMemoryNonHeapUsed.high)))
                    return "jvmMemoryNonHeapUsed: integer|Long expected";
            if (message.jvmMemoryNonHeapMax != null && message.hasOwnProperty("jvmMemoryNonHeapMax"))
                if (!$util.isInteger(message.jvmMemoryNonHeapMax) && !(message.jvmMemoryNonHeapMax && $util.isInteger(message.jvmMemoryNonHeapMax.low) && $util.isInteger(message.jvmMemoryNonHeapMax.high)))
                    return "jvmMemoryNonHeapMax: integer|Long expected";
            if (message.jvmGcOldCount != null && message.hasOwnProperty("jvmGcOldCount"))
                if (!$util.isInteger(message.jvmGcOldCount) && !(message.jvmGcOldCount && $util.isInteger(message.jvmGcOldCount.low) && $util.isInteger(message.jvmGcOldCount.high)))
                    return "jvmGcOldCount: integer|Long expected";
            if (message.jvmGcOldTime != null && message.hasOwnProperty("jvmGcOldTime"))
                if (!$util.isInteger(message.jvmGcOldTime) && !(message.jvmGcOldTime && $util.isInteger(message.jvmGcOldTime.low) && $util.isInteger(message.jvmGcOldTime.high)))
                    return "jvmGcOldTime: integer|Long expected";
            if (message.jvmGcDetailed != null && message.hasOwnProperty("jvmGcDetailed")) {
                var error = $root.v1.PJvmGcDetailed.verify(message.jvmGcDetailed);
                if (error)
                    return "jvmGcDetailed." + error;
            }
            return null;
        };

        /**
         * Creates a PJvmGc message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PJvmGc
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PJvmGc} PJvmGc
         */
        PJvmGc.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PJvmGc)
                return object;
            var message = new $root.v1.PJvmGc();
            switch (object.type) {
            case "JVM_GC_TYPE_UNKNOWN":
            case 0:
                message.type = 0;
                break;
            case "JVM_GC_TYPE_SERIAL":
            case 1:
                message.type = 1;
                break;
            case "JVM_GC_TYPE_PARALLEL":
            case 2:
                message.type = 2;
                break;
            case "JVM_GC_TYPE_CMS":
            case 3:
                message.type = 3;
                break;
            case "JVM_GC_TYPE_G1":
            case 4:
                message.type = 4;
                break;
            }
            if (object.jvmMemoryHeapUsed != null)
                if ($util.Long)
                    (message.jvmMemoryHeapUsed = $util.Long.fromValue(object.jvmMemoryHeapUsed)).unsigned = false;
                else if (typeof object.jvmMemoryHeapUsed === "string")
                    message.jvmMemoryHeapUsed = parseInt(object.jvmMemoryHeapUsed, 10);
                else if (typeof object.jvmMemoryHeapUsed === "number")
                    message.jvmMemoryHeapUsed = object.jvmMemoryHeapUsed;
                else if (typeof object.jvmMemoryHeapUsed === "object")
                    message.jvmMemoryHeapUsed = new $util.LongBits(object.jvmMemoryHeapUsed.low >>> 0, object.jvmMemoryHeapUsed.high >>> 0).toNumber();
            if (object.jvmMemoryHeapMax != null)
                if ($util.Long)
                    (message.jvmMemoryHeapMax = $util.Long.fromValue(object.jvmMemoryHeapMax)).unsigned = false;
                else if (typeof object.jvmMemoryHeapMax === "string")
                    message.jvmMemoryHeapMax = parseInt(object.jvmMemoryHeapMax, 10);
                else if (typeof object.jvmMemoryHeapMax === "number")
                    message.jvmMemoryHeapMax = object.jvmMemoryHeapMax;
                else if (typeof object.jvmMemoryHeapMax === "object")
                    message.jvmMemoryHeapMax = new $util.LongBits(object.jvmMemoryHeapMax.low >>> 0, object.jvmMemoryHeapMax.high >>> 0).toNumber();
            if (object.jvmMemoryNonHeapUsed != null)
                if ($util.Long)
                    (message.jvmMemoryNonHeapUsed = $util.Long.fromValue(object.jvmMemoryNonHeapUsed)).unsigned = false;
                else if (typeof object.jvmMemoryNonHeapUsed === "string")
                    message.jvmMemoryNonHeapUsed = parseInt(object.jvmMemoryNonHeapUsed, 10);
                else if (typeof object.jvmMemoryNonHeapUsed === "number")
                    message.jvmMemoryNonHeapUsed = object.jvmMemoryNonHeapUsed;
                else if (typeof object.jvmMemoryNonHeapUsed === "object")
                    message.jvmMemoryNonHeapUsed = new $util.LongBits(object.jvmMemoryNonHeapUsed.low >>> 0, object.jvmMemoryNonHeapUsed.high >>> 0).toNumber();
            if (object.jvmMemoryNonHeapMax != null)
                if ($util.Long)
                    (message.jvmMemoryNonHeapMax = $util.Long.fromValue(object.jvmMemoryNonHeapMax)).unsigned = false;
                else if (typeof object.jvmMemoryNonHeapMax === "string")
                    message.jvmMemoryNonHeapMax = parseInt(object.jvmMemoryNonHeapMax, 10);
                else if (typeof object.jvmMemoryNonHeapMax === "number")
                    message.jvmMemoryNonHeapMax = object.jvmMemoryNonHeapMax;
                else if (typeof object.jvmMemoryNonHeapMax === "object")
                    message.jvmMemoryNonHeapMax = new $util.LongBits(object.jvmMemoryNonHeapMax.low >>> 0, object.jvmMemoryNonHeapMax.high >>> 0).toNumber();
            if (object.jvmGcOldCount != null)
                if ($util.Long)
                    (message.jvmGcOldCount = $util.Long.fromValue(object.jvmGcOldCount)).unsigned = false;
                else if (typeof object.jvmGcOldCount === "string")
                    message.jvmGcOldCount = parseInt(object.jvmGcOldCount, 10);
                else if (typeof object.jvmGcOldCount === "number")
                    message.jvmGcOldCount = object.jvmGcOldCount;
                else if (typeof object.jvmGcOldCount === "object")
                    message.jvmGcOldCount = new $util.LongBits(object.jvmGcOldCount.low >>> 0, object.jvmGcOldCount.high >>> 0).toNumber();
            if (object.jvmGcOldTime != null)
                if ($util.Long)
                    (message.jvmGcOldTime = $util.Long.fromValue(object.jvmGcOldTime)).unsigned = false;
                else if (typeof object.jvmGcOldTime === "string")
                    message.jvmGcOldTime = parseInt(object.jvmGcOldTime, 10);
                else if (typeof object.jvmGcOldTime === "number")
                    message.jvmGcOldTime = object.jvmGcOldTime;
                else if (typeof object.jvmGcOldTime === "object")
                    message.jvmGcOldTime = new $util.LongBits(object.jvmGcOldTime.low >>> 0, object.jvmGcOldTime.high >>> 0).toNumber();
            if (object.jvmGcDetailed != null) {
                if (typeof object.jvmGcDetailed !== "object")
                    throw TypeError(".v1.PJvmGc.jvmGcDetailed: object expected");
                message.jvmGcDetailed = $root.v1.PJvmGcDetailed.fromObject(object.jvmGcDetailed);
            }
            return message;
        };

        /**
         * Creates a plain object from a PJvmGc message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PJvmGc
         * @static
         * @param {v1.PJvmGc} message PJvmGc
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PJvmGc.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.type = options.enums === String ? "JVM_GC_TYPE_UNKNOWN" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.jvmMemoryHeapUsed = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.jvmMemoryHeapUsed = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.jvmMemoryHeapMax = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.jvmMemoryHeapMax = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.jvmMemoryNonHeapUsed = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.jvmMemoryNonHeapUsed = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.jvmMemoryNonHeapMax = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.jvmMemoryNonHeapMax = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.jvmGcOldCount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.jvmGcOldCount = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.jvmGcOldTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.jvmGcOldTime = options.longs === String ? "0" : 0;
                object.jvmGcDetailed = null;
            }
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = options.enums === String ? $root.v1.PJvmGcType[message.type] : message.type;
            if (message.jvmMemoryHeapUsed != null && message.hasOwnProperty("jvmMemoryHeapUsed"))
                if (typeof message.jvmMemoryHeapUsed === "number")
                    object.jvmMemoryHeapUsed = options.longs === String ? String(message.jvmMemoryHeapUsed) : message.jvmMemoryHeapUsed;
                else
                    object.jvmMemoryHeapUsed = options.longs === String ? $util.Long.prototype.toString.call(message.jvmMemoryHeapUsed) : options.longs === Number ? new $util.LongBits(message.jvmMemoryHeapUsed.low >>> 0, message.jvmMemoryHeapUsed.high >>> 0).toNumber() : message.jvmMemoryHeapUsed;
            if (message.jvmMemoryHeapMax != null && message.hasOwnProperty("jvmMemoryHeapMax"))
                if (typeof message.jvmMemoryHeapMax === "number")
                    object.jvmMemoryHeapMax = options.longs === String ? String(message.jvmMemoryHeapMax) : message.jvmMemoryHeapMax;
                else
                    object.jvmMemoryHeapMax = options.longs === String ? $util.Long.prototype.toString.call(message.jvmMemoryHeapMax) : options.longs === Number ? new $util.LongBits(message.jvmMemoryHeapMax.low >>> 0, message.jvmMemoryHeapMax.high >>> 0).toNumber() : message.jvmMemoryHeapMax;
            if (message.jvmMemoryNonHeapUsed != null && message.hasOwnProperty("jvmMemoryNonHeapUsed"))
                if (typeof message.jvmMemoryNonHeapUsed === "number")
                    object.jvmMemoryNonHeapUsed = options.longs === String ? String(message.jvmMemoryNonHeapUsed) : message.jvmMemoryNonHeapUsed;
                else
                    object.jvmMemoryNonHeapUsed = options.longs === String ? $util.Long.prototype.toString.call(message.jvmMemoryNonHeapUsed) : options.longs === Number ? new $util.LongBits(message.jvmMemoryNonHeapUsed.low >>> 0, message.jvmMemoryNonHeapUsed.high >>> 0).toNumber() : message.jvmMemoryNonHeapUsed;
            if (message.jvmMemoryNonHeapMax != null && message.hasOwnProperty("jvmMemoryNonHeapMax"))
                if (typeof message.jvmMemoryNonHeapMax === "number")
                    object.jvmMemoryNonHeapMax = options.longs === String ? String(message.jvmMemoryNonHeapMax) : message.jvmMemoryNonHeapMax;
                else
                    object.jvmMemoryNonHeapMax = options.longs === String ? $util.Long.prototype.toString.call(message.jvmMemoryNonHeapMax) : options.longs === Number ? new $util.LongBits(message.jvmMemoryNonHeapMax.low >>> 0, message.jvmMemoryNonHeapMax.high >>> 0).toNumber() : message.jvmMemoryNonHeapMax;
            if (message.jvmGcOldCount != null && message.hasOwnProperty("jvmGcOldCount"))
                if (typeof message.jvmGcOldCount === "number")
                    object.jvmGcOldCount = options.longs === String ? String(message.jvmGcOldCount) : message.jvmGcOldCount;
                else
                    object.jvmGcOldCount = options.longs === String ? $util.Long.prototype.toString.call(message.jvmGcOldCount) : options.longs === Number ? new $util.LongBits(message.jvmGcOldCount.low >>> 0, message.jvmGcOldCount.high >>> 0).toNumber() : message.jvmGcOldCount;
            if (message.jvmGcOldTime != null && message.hasOwnProperty("jvmGcOldTime"))
                if (typeof message.jvmGcOldTime === "number")
                    object.jvmGcOldTime = options.longs === String ? String(message.jvmGcOldTime) : message.jvmGcOldTime;
                else
                    object.jvmGcOldTime = options.longs === String ? $util.Long.prototype.toString.call(message.jvmGcOldTime) : options.longs === Number ? new $util.LongBits(message.jvmGcOldTime.low >>> 0, message.jvmGcOldTime.high >>> 0).toNumber() : message.jvmGcOldTime;
            if (message.jvmGcDetailed != null && message.hasOwnProperty("jvmGcDetailed"))
                object.jvmGcDetailed = $root.v1.PJvmGcDetailed.toObject(message.jvmGcDetailed, options);
            return object;
        };

        /**
         * Converts this PJvmGc to JSON.
         * @function toJSON
         * @memberof v1.PJvmGc
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PJvmGc.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PJvmGc;
    })();

    v1.PJvmGcDetailed = (function() {

        /**
         * Properties of a PJvmGcDetailed.
         * @memberof v1
         * @interface IPJvmGcDetailed
         * @property {number|Long|null} [jvmGcNewCount] PJvmGcDetailed jvmGcNewCount
         * @property {number|Long|null} [jvmGcNewTime] PJvmGcDetailed jvmGcNewTime
         * @property {number|null} [jvmPoolCodeCacheUsed] PJvmGcDetailed jvmPoolCodeCacheUsed
         * @property {number|null} [jvmPoolNewGenUsed] PJvmGcDetailed jvmPoolNewGenUsed
         * @property {number|null} [jvmPoolOldGenUsed] PJvmGcDetailed jvmPoolOldGenUsed
         * @property {number|null} [jvmPoolSurvivorSpaceUsed] PJvmGcDetailed jvmPoolSurvivorSpaceUsed
         * @property {number|null} [jvmPoolPermGenUsed] PJvmGcDetailed jvmPoolPermGenUsed
         * @property {number|null} [jvmPoolMetaspaceUsed] PJvmGcDetailed jvmPoolMetaspaceUsed
         */

        /**
         * Constructs a new PJvmGcDetailed.
         * @memberof v1
         * @classdesc Represents a PJvmGcDetailed.
         * @implements IPJvmGcDetailed
         * @constructor
         * @param {v1.IPJvmGcDetailed=} [properties] Properties to set
         */
        function PJvmGcDetailed(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PJvmGcDetailed jvmGcNewCount.
         * @member {number|Long} jvmGcNewCount
         * @memberof v1.PJvmGcDetailed
         * @instance
         */
        PJvmGcDetailed.prototype.jvmGcNewCount = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PJvmGcDetailed jvmGcNewTime.
         * @member {number|Long} jvmGcNewTime
         * @memberof v1.PJvmGcDetailed
         * @instance
         */
        PJvmGcDetailed.prototype.jvmGcNewTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PJvmGcDetailed jvmPoolCodeCacheUsed.
         * @member {number} jvmPoolCodeCacheUsed
         * @memberof v1.PJvmGcDetailed
         * @instance
         */
        PJvmGcDetailed.prototype.jvmPoolCodeCacheUsed = 0;

        /**
         * PJvmGcDetailed jvmPoolNewGenUsed.
         * @member {number} jvmPoolNewGenUsed
         * @memberof v1.PJvmGcDetailed
         * @instance
         */
        PJvmGcDetailed.prototype.jvmPoolNewGenUsed = 0;

        /**
         * PJvmGcDetailed jvmPoolOldGenUsed.
         * @member {number} jvmPoolOldGenUsed
         * @memberof v1.PJvmGcDetailed
         * @instance
         */
        PJvmGcDetailed.prototype.jvmPoolOldGenUsed = 0;

        /**
         * PJvmGcDetailed jvmPoolSurvivorSpaceUsed.
         * @member {number} jvmPoolSurvivorSpaceUsed
         * @memberof v1.PJvmGcDetailed
         * @instance
         */
        PJvmGcDetailed.prototype.jvmPoolSurvivorSpaceUsed = 0;

        /**
         * PJvmGcDetailed jvmPoolPermGenUsed.
         * @member {number} jvmPoolPermGenUsed
         * @memberof v1.PJvmGcDetailed
         * @instance
         */
        PJvmGcDetailed.prototype.jvmPoolPermGenUsed = 0;

        /**
         * PJvmGcDetailed jvmPoolMetaspaceUsed.
         * @member {number} jvmPoolMetaspaceUsed
         * @memberof v1.PJvmGcDetailed
         * @instance
         */
        PJvmGcDetailed.prototype.jvmPoolMetaspaceUsed = 0;

        /**
         * Creates a new PJvmGcDetailed instance using the specified properties.
         * @function create
         * @memberof v1.PJvmGcDetailed
         * @static
         * @param {v1.IPJvmGcDetailed=} [properties] Properties to set
         * @returns {v1.PJvmGcDetailed} PJvmGcDetailed instance
         */
        PJvmGcDetailed.create = function create(properties) {
            return new PJvmGcDetailed(properties);
        };

        /**
         * Encodes the specified PJvmGcDetailed message. Does not implicitly {@link v1.PJvmGcDetailed.verify|verify} messages.
         * @function encode
         * @memberof v1.PJvmGcDetailed
         * @static
         * @param {v1.IPJvmGcDetailed} message PJvmGcDetailed message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PJvmGcDetailed.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.jvmGcNewCount != null && message.hasOwnProperty("jvmGcNewCount"))
                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.jvmGcNewCount);
            if (message.jvmGcNewTime != null && message.hasOwnProperty("jvmGcNewTime"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.jvmGcNewTime);
            if (message.jvmPoolCodeCacheUsed != null && message.hasOwnProperty("jvmPoolCodeCacheUsed"))
                writer.uint32(/* id 3, wireType 1 =*/25).double(message.jvmPoolCodeCacheUsed);
            if (message.jvmPoolNewGenUsed != null && message.hasOwnProperty("jvmPoolNewGenUsed"))
                writer.uint32(/* id 4, wireType 1 =*/33).double(message.jvmPoolNewGenUsed);
            if (message.jvmPoolOldGenUsed != null && message.hasOwnProperty("jvmPoolOldGenUsed"))
                writer.uint32(/* id 5, wireType 1 =*/41).double(message.jvmPoolOldGenUsed);
            if (message.jvmPoolSurvivorSpaceUsed != null && message.hasOwnProperty("jvmPoolSurvivorSpaceUsed"))
                writer.uint32(/* id 6, wireType 1 =*/49).double(message.jvmPoolSurvivorSpaceUsed);
            if (message.jvmPoolPermGenUsed != null && message.hasOwnProperty("jvmPoolPermGenUsed"))
                writer.uint32(/* id 7, wireType 1 =*/57).double(message.jvmPoolPermGenUsed);
            if (message.jvmPoolMetaspaceUsed != null && message.hasOwnProperty("jvmPoolMetaspaceUsed"))
                writer.uint32(/* id 8, wireType 1 =*/65).double(message.jvmPoolMetaspaceUsed);
            return writer;
        };

        /**
         * Encodes the specified PJvmGcDetailed message, length delimited. Does not implicitly {@link v1.PJvmGcDetailed.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PJvmGcDetailed
         * @static
         * @param {v1.IPJvmGcDetailed} message PJvmGcDetailed message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PJvmGcDetailed.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PJvmGcDetailed message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PJvmGcDetailed
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PJvmGcDetailed} PJvmGcDetailed
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PJvmGcDetailed.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PJvmGcDetailed();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.jvmGcNewCount = reader.int64();
                    break;
                case 2:
                    message.jvmGcNewTime = reader.int64();
                    break;
                case 3:
                    message.jvmPoolCodeCacheUsed = reader.double();
                    break;
                case 4:
                    message.jvmPoolNewGenUsed = reader.double();
                    break;
                case 5:
                    message.jvmPoolOldGenUsed = reader.double();
                    break;
                case 6:
                    message.jvmPoolSurvivorSpaceUsed = reader.double();
                    break;
                case 7:
                    message.jvmPoolPermGenUsed = reader.double();
                    break;
                case 8:
                    message.jvmPoolMetaspaceUsed = reader.double();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PJvmGcDetailed message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PJvmGcDetailed
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PJvmGcDetailed} PJvmGcDetailed
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PJvmGcDetailed.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PJvmGcDetailed message.
         * @function verify
         * @memberof v1.PJvmGcDetailed
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PJvmGcDetailed.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.jvmGcNewCount != null && message.hasOwnProperty("jvmGcNewCount"))
                if (!$util.isInteger(message.jvmGcNewCount) && !(message.jvmGcNewCount && $util.isInteger(message.jvmGcNewCount.low) && $util.isInteger(message.jvmGcNewCount.high)))
                    return "jvmGcNewCount: integer|Long expected";
            if (message.jvmGcNewTime != null && message.hasOwnProperty("jvmGcNewTime"))
                if (!$util.isInteger(message.jvmGcNewTime) && !(message.jvmGcNewTime && $util.isInteger(message.jvmGcNewTime.low) && $util.isInteger(message.jvmGcNewTime.high)))
                    return "jvmGcNewTime: integer|Long expected";
            if (message.jvmPoolCodeCacheUsed != null && message.hasOwnProperty("jvmPoolCodeCacheUsed"))
                if (typeof message.jvmPoolCodeCacheUsed !== "number")
                    return "jvmPoolCodeCacheUsed: number expected";
            if (message.jvmPoolNewGenUsed != null && message.hasOwnProperty("jvmPoolNewGenUsed"))
                if (typeof message.jvmPoolNewGenUsed !== "number")
                    return "jvmPoolNewGenUsed: number expected";
            if (message.jvmPoolOldGenUsed != null && message.hasOwnProperty("jvmPoolOldGenUsed"))
                if (typeof message.jvmPoolOldGenUsed !== "number")
                    return "jvmPoolOldGenUsed: number expected";
            if (message.jvmPoolSurvivorSpaceUsed != null && message.hasOwnProperty("jvmPoolSurvivorSpaceUsed"))
                if (typeof message.jvmPoolSurvivorSpaceUsed !== "number")
                    return "jvmPoolSurvivorSpaceUsed: number expected";
            if (message.jvmPoolPermGenUsed != null && message.hasOwnProperty("jvmPoolPermGenUsed"))
                if (typeof message.jvmPoolPermGenUsed !== "number")
                    return "jvmPoolPermGenUsed: number expected";
            if (message.jvmPoolMetaspaceUsed != null && message.hasOwnProperty("jvmPoolMetaspaceUsed"))
                if (typeof message.jvmPoolMetaspaceUsed !== "number")
                    return "jvmPoolMetaspaceUsed: number expected";
            return null;
        };

        /**
         * Creates a PJvmGcDetailed message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PJvmGcDetailed
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PJvmGcDetailed} PJvmGcDetailed
         */
        PJvmGcDetailed.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PJvmGcDetailed)
                return object;
            var message = new $root.v1.PJvmGcDetailed();
            if (object.jvmGcNewCount != null)
                if ($util.Long)
                    (message.jvmGcNewCount = $util.Long.fromValue(object.jvmGcNewCount)).unsigned = false;
                else if (typeof object.jvmGcNewCount === "string")
                    message.jvmGcNewCount = parseInt(object.jvmGcNewCount, 10);
                else if (typeof object.jvmGcNewCount === "number")
                    message.jvmGcNewCount = object.jvmGcNewCount;
                else if (typeof object.jvmGcNewCount === "object")
                    message.jvmGcNewCount = new $util.LongBits(object.jvmGcNewCount.low >>> 0, object.jvmGcNewCount.high >>> 0).toNumber();
            if (object.jvmGcNewTime != null)
                if ($util.Long)
                    (message.jvmGcNewTime = $util.Long.fromValue(object.jvmGcNewTime)).unsigned = false;
                else if (typeof object.jvmGcNewTime === "string")
                    message.jvmGcNewTime = parseInt(object.jvmGcNewTime, 10);
                else if (typeof object.jvmGcNewTime === "number")
                    message.jvmGcNewTime = object.jvmGcNewTime;
                else if (typeof object.jvmGcNewTime === "object")
                    message.jvmGcNewTime = new $util.LongBits(object.jvmGcNewTime.low >>> 0, object.jvmGcNewTime.high >>> 0).toNumber();
            if (object.jvmPoolCodeCacheUsed != null)
                message.jvmPoolCodeCacheUsed = Number(object.jvmPoolCodeCacheUsed);
            if (object.jvmPoolNewGenUsed != null)
                message.jvmPoolNewGenUsed = Number(object.jvmPoolNewGenUsed);
            if (object.jvmPoolOldGenUsed != null)
                message.jvmPoolOldGenUsed = Number(object.jvmPoolOldGenUsed);
            if (object.jvmPoolSurvivorSpaceUsed != null)
                message.jvmPoolSurvivorSpaceUsed = Number(object.jvmPoolSurvivorSpaceUsed);
            if (object.jvmPoolPermGenUsed != null)
                message.jvmPoolPermGenUsed = Number(object.jvmPoolPermGenUsed);
            if (object.jvmPoolMetaspaceUsed != null)
                message.jvmPoolMetaspaceUsed = Number(object.jvmPoolMetaspaceUsed);
            return message;
        };

        /**
         * Creates a plain object from a PJvmGcDetailed message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PJvmGcDetailed
         * @static
         * @param {v1.PJvmGcDetailed} message PJvmGcDetailed
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PJvmGcDetailed.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.jvmGcNewCount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.jvmGcNewCount = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.jvmGcNewTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.jvmGcNewTime = options.longs === String ? "0" : 0;
                object.jvmPoolCodeCacheUsed = 0;
                object.jvmPoolNewGenUsed = 0;
                object.jvmPoolOldGenUsed = 0;
                object.jvmPoolSurvivorSpaceUsed = 0;
                object.jvmPoolPermGenUsed = 0;
                object.jvmPoolMetaspaceUsed = 0;
            }
            if (message.jvmGcNewCount != null && message.hasOwnProperty("jvmGcNewCount"))
                if (typeof message.jvmGcNewCount === "number")
                    object.jvmGcNewCount = options.longs === String ? String(message.jvmGcNewCount) : message.jvmGcNewCount;
                else
                    object.jvmGcNewCount = options.longs === String ? $util.Long.prototype.toString.call(message.jvmGcNewCount) : options.longs === Number ? new $util.LongBits(message.jvmGcNewCount.low >>> 0, message.jvmGcNewCount.high >>> 0).toNumber() : message.jvmGcNewCount;
            if (message.jvmGcNewTime != null && message.hasOwnProperty("jvmGcNewTime"))
                if (typeof message.jvmGcNewTime === "number")
                    object.jvmGcNewTime = options.longs === String ? String(message.jvmGcNewTime) : message.jvmGcNewTime;
                else
                    object.jvmGcNewTime = options.longs === String ? $util.Long.prototype.toString.call(message.jvmGcNewTime) : options.longs === Number ? new $util.LongBits(message.jvmGcNewTime.low >>> 0, message.jvmGcNewTime.high >>> 0).toNumber() : message.jvmGcNewTime;
            if (message.jvmPoolCodeCacheUsed != null && message.hasOwnProperty("jvmPoolCodeCacheUsed"))
                object.jvmPoolCodeCacheUsed = options.json && !isFinite(message.jvmPoolCodeCacheUsed) ? String(message.jvmPoolCodeCacheUsed) : message.jvmPoolCodeCacheUsed;
            if (message.jvmPoolNewGenUsed != null && message.hasOwnProperty("jvmPoolNewGenUsed"))
                object.jvmPoolNewGenUsed = options.json && !isFinite(message.jvmPoolNewGenUsed) ? String(message.jvmPoolNewGenUsed) : message.jvmPoolNewGenUsed;
            if (message.jvmPoolOldGenUsed != null && message.hasOwnProperty("jvmPoolOldGenUsed"))
                object.jvmPoolOldGenUsed = options.json && !isFinite(message.jvmPoolOldGenUsed) ? String(message.jvmPoolOldGenUsed) : message.jvmPoolOldGenUsed;
            if (message.jvmPoolSurvivorSpaceUsed != null && message.hasOwnProperty("jvmPoolSurvivorSpaceUsed"))
                object.jvmPoolSurvivorSpaceUsed = options.json && !isFinite(message.jvmPoolSurvivorSpaceUsed) ? String(message.jvmPoolSurvivorSpaceUsed) : message.jvmPoolSurvivorSpaceUsed;
            if (message.jvmPoolPermGenUsed != null && message.hasOwnProperty("jvmPoolPermGenUsed"))
                object.jvmPoolPermGenUsed = options.json && !isFinite(message.jvmPoolPermGenUsed) ? String(message.jvmPoolPermGenUsed) : message.jvmPoolPermGenUsed;
            if (message.jvmPoolMetaspaceUsed != null && message.hasOwnProperty("jvmPoolMetaspaceUsed"))
                object.jvmPoolMetaspaceUsed = options.json && !isFinite(message.jvmPoolMetaspaceUsed) ? String(message.jvmPoolMetaspaceUsed) : message.jvmPoolMetaspaceUsed;
            return object;
        };

        /**
         * Converts this PJvmGcDetailed to JSON.
         * @function toJSON
         * @memberof v1.PJvmGcDetailed
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PJvmGcDetailed.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PJvmGcDetailed;
    })();

    v1.PCpuLoad = (function() {

        /**
         * Properties of a PCpuLoad.
         * @memberof v1
         * @interface IPCpuLoad
         * @property {number|null} [jvmCpuLoad] PCpuLoad jvmCpuLoad
         * @property {number|null} [systemCpuLoad] PCpuLoad systemCpuLoad
         */

        /**
         * Constructs a new PCpuLoad.
         * @memberof v1
         * @classdesc Represents a PCpuLoad.
         * @implements IPCpuLoad
         * @constructor
         * @param {v1.IPCpuLoad=} [properties] Properties to set
         */
        function PCpuLoad(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PCpuLoad jvmCpuLoad.
         * @member {number} jvmCpuLoad
         * @memberof v1.PCpuLoad
         * @instance
         */
        PCpuLoad.prototype.jvmCpuLoad = 0;

        /**
         * PCpuLoad systemCpuLoad.
         * @member {number} systemCpuLoad
         * @memberof v1.PCpuLoad
         * @instance
         */
        PCpuLoad.prototype.systemCpuLoad = 0;

        /**
         * Creates a new PCpuLoad instance using the specified properties.
         * @function create
         * @memberof v1.PCpuLoad
         * @static
         * @param {v1.IPCpuLoad=} [properties] Properties to set
         * @returns {v1.PCpuLoad} PCpuLoad instance
         */
        PCpuLoad.create = function create(properties) {
            return new PCpuLoad(properties);
        };

        /**
         * Encodes the specified PCpuLoad message. Does not implicitly {@link v1.PCpuLoad.verify|verify} messages.
         * @function encode
         * @memberof v1.PCpuLoad
         * @static
         * @param {v1.IPCpuLoad} message PCpuLoad message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PCpuLoad.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.jvmCpuLoad != null && message.hasOwnProperty("jvmCpuLoad"))
                writer.uint32(/* id 1, wireType 1 =*/9).double(message.jvmCpuLoad);
            if (message.systemCpuLoad != null && message.hasOwnProperty("systemCpuLoad"))
                writer.uint32(/* id 2, wireType 1 =*/17).double(message.systemCpuLoad);
            return writer;
        };

        /**
         * Encodes the specified PCpuLoad message, length delimited. Does not implicitly {@link v1.PCpuLoad.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PCpuLoad
         * @static
         * @param {v1.IPCpuLoad} message PCpuLoad message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PCpuLoad.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PCpuLoad message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PCpuLoad
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PCpuLoad} PCpuLoad
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PCpuLoad.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PCpuLoad();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.jvmCpuLoad = reader.double();
                    break;
                case 2:
                    message.systemCpuLoad = reader.double();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PCpuLoad message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PCpuLoad
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PCpuLoad} PCpuLoad
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PCpuLoad.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PCpuLoad message.
         * @function verify
         * @memberof v1.PCpuLoad
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PCpuLoad.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.jvmCpuLoad != null && message.hasOwnProperty("jvmCpuLoad"))
                if (typeof message.jvmCpuLoad !== "number")
                    return "jvmCpuLoad: number expected";
            if (message.systemCpuLoad != null && message.hasOwnProperty("systemCpuLoad"))
                if (typeof message.systemCpuLoad !== "number")
                    return "systemCpuLoad: number expected";
            return null;
        };

        /**
         * Creates a PCpuLoad message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PCpuLoad
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PCpuLoad} PCpuLoad
         */
        PCpuLoad.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PCpuLoad)
                return object;
            var message = new $root.v1.PCpuLoad();
            if (object.jvmCpuLoad != null)
                message.jvmCpuLoad = Number(object.jvmCpuLoad);
            if (object.systemCpuLoad != null)
                message.systemCpuLoad = Number(object.systemCpuLoad);
            return message;
        };

        /**
         * Creates a plain object from a PCpuLoad message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PCpuLoad
         * @static
         * @param {v1.PCpuLoad} message PCpuLoad
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PCpuLoad.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.jvmCpuLoad = 0;
                object.systemCpuLoad = 0;
            }
            if (message.jvmCpuLoad != null && message.hasOwnProperty("jvmCpuLoad"))
                object.jvmCpuLoad = options.json && !isFinite(message.jvmCpuLoad) ? String(message.jvmCpuLoad) : message.jvmCpuLoad;
            if (message.systemCpuLoad != null && message.hasOwnProperty("systemCpuLoad"))
                object.systemCpuLoad = options.json && !isFinite(message.systemCpuLoad) ? String(message.systemCpuLoad) : message.systemCpuLoad;
            return object;
        };

        /**
         * Converts this PCpuLoad to JSON.
         * @function toJSON
         * @memberof v1.PCpuLoad
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PCpuLoad.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PCpuLoad;
    })();

    v1.PTransaction = (function() {

        /**
         * Properties of a PTransaction.
         * @memberof v1
         * @interface IPTransaction
         * @property {number|Long|null} [sampledNewCount] PTransaction sampledNewCount
         * @property {number|Long|null} [sampledContinuationCount] PTransaction sampledContinuationCount
         * @property {number|Long|null} [unsampledNewCount] PTransaction unsampledNewCount
         * @property {number|Long|null} [unsampledContinuationCount] PTransaction unsampledContinuationCount
         * @property {number|Long|null} [skippedNewCount] PTransaction skippedNewCount
         * @property {number|Long|null} [skippedContinuationCount] PTransaction skippedContinuationCount
         */

        /**
         * Constructs a new PTransaction.
         * @memberof v1
         * @classdesc Represents a PTransaction.
         * @implements IPTransaction
         * @constructor
         * @param {v1.IPTransaction=} [properties] Properties to set
         */
        function PTransaction(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PTransaction sampledNewCount.
         * @member {number|Long} sampledNewCount
         * @memberof v1.PTransaction
         * @instance
         */
        PTransaction.prototype.sampledNewCount = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PTransaction sampledContinuationCount.
         * @member {number|Long} sampledContinuationCount
         * @memberof v1.PTransaction
         * @instance
         */
        PTransaction.prototype.sampledContinuationCount = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PTransaction unsampledNewCount.
         * @member {number|Long} unsampledNewCount
         * @memberof v1.PTransaction
         * @instance
         */
        PTransaction.prototype.unsampledNewCount = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PTransaction unsampledContinuationCount.
         * @member {number|Long} unsampledContinuationCount
         * @memberof v1.PTransaction
         * @instance
         */
        PTransaction.prototype.unsampledContinuationCount = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PTransaction skippedNewCount.
         * @member {number|Long} skippedNewCount
         * @memberof v1.PTransaction
         * @instance
         */
        PTransaction.prototype.skippedNewCount = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PTransaction skippedContinuationCount.
         * @member {number|Long} skippedContinuationCount
         * @memberof v1.PTransaction
         * @instance
         */
        PTransaction.prototype.skippedContinuationCount = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new PTransaction instance using the specified properties.
         * @function create
         * @memberof v1.PTransaction
         * @static
         * @param {v1.IPTransaction=} [properties] Properties to set
         * @returns {v1.PTransaction} PTransaction instance
         */
        PTransaction.create = function create(properties) {
            return new PTransaction(properties);
        };

        /**
         * Encodes the specified PTransaction message. Does not implicitly {@link v1.PTransaction.verify|verify} messages.
         * @function encode
         * @memberof v1.PTransaction
         * @static
         * @param {v1.IPTransaction} message PTransaction message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PTransaction.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.sampledNewCount != null && message.hasOwnProperty("sampledNewCount"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.sampledNewCount);
            if (message.sampledContinuationCount != null && message.hasOwnProperty("sampledContinuationCount"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.sampledContinuationCount);
            if (message.unsampledNewCount != null && message.hasOwnProperty("unsampledNewCount"))
                writer.uint32(/* id 4, wireType 0 =*/32).int64(message.unsampledNewCount);
            if (message.unsampledContinuationCount != null && message.hasOwnProperty("unsampledContinuationCount"))
                writer.uint32(/* id 5, wireType 0 =*/40).int64(message.unsampledContinuationCount);
            if (message.skippedNewCount != null && message.hasOwnProperty("skippedNewCount"))
                writer.uint32(/* id 6, wireType 0 =*/48).int64(message.skippedNewCount);
            if (message.skippedContinuationCount != null && message.hasOwnProperty("skippedContinuationCount"))
                writer.uint32(/* id 7, wireType 0 =*/56).int64(message.skippedContinuationCount);
            return writer;
        };

        /**
         * Encodes the specified PTransaction message, length delimited. Does not implicitly {@link v1.PTransaction.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PTransaction
         * @static
         * @param {v1.IPTransaction} message PTransaction message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PTransaction.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PTransaction message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PTransaction
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PTransaction} PTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PTransaction.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PTransaction();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 2:
                    message.sampledNewCount = reader.int64();
                    break;
                case 3:
                    message.sampledContinuationCount = reader.int64();
                    break;
                case 4:
                    message.unsampledNewCount = reader.int64();
                    break;
                case 5:
                    message.unsampledContinuationCount = reader.int64();
                    break;
                case 6:
                    message.skippedNewCount = reader.int64();
                    break;
                case 7:
                    message.skippedContinuationCount = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PTransaction message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PTransaction
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PTransaction} PTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PTransaction.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PTransaction message.
         * @function verify
         * @memberof v1.PTransaction
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PTransaction.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.sampledNewCount != null && message.hasOwnProperty("sampledNewCount"))
                if (!$util.isInteger(message.sampledNewCount) && !(message.sampledNewCount && $util.isInteger(message.sampledNewCount.low) && $util.isInteger(message.sampledNewCount.high)))
                    return "sampledNewCount: integer|Long expected";
            if (message.sampledContinuationCount != null && message.hasOwnProperty("sampledContinuationCount"))
                if (!$util.isInteger(message.sampledContinuationCount) && !(message.sampledContinuationCount && $util.isInteger(message.sampledContinuationCount.low) && $util.isInteger(message.sampledContinuationCount.high)))
                    return "sampledContinuationCount: integer|Long expected";
            if (message.unsampledNewCount != null && message.hasOwnProperty("unsampledNewCount"))
                if (!$util.isInteger(message.unsampledNewCount) && !(message.unsampledNewCount && $util.isInteger(message.unsampledNewCount.low) && $util.isInteger(message.unsampledNewCount.high)))
                    return "unsampledNewCount: integer|Long expected";
            if (message.unsampledContinuationCount != null && message.hasOwnProperty("unsampledContinuationCount"))
                if (!$util.isInteger(message.unsampledContinuationCount) && !(message.unsampledContinuationCount && $util.isInteger(message.unsampledContinuationCount.low) && $util.isInteger(message.unsampledContinuationCount.high)))
                    return "unsampledContinuationCount: integer|Long expected";
            if (message.skippedNewCount != null && message.hasOwnProperty("skippedNewCount"))
                if (!$util.isInteger(message.skippedNewCount) && !(message.skippedNewCount && $util.isInteger(message.skippedNewCount.low) && $util.isInteger(message.skippedNewCount.high)))
                    return "skippedNewCount: integer|Long expected";
            if (message.skippedContinuationCount != null && message.hasOwnProperty("skippedContinuationCount"))
                if (!$util.isInteger(message.skippedContinuationCount) && !(message.skippedContinuationCount && $util.isInteger(message.skippedContinuationCount.low) && $util.isInteger(message.skippedContinuationCount.high)))
                    return "skippedContinuationCount: integer|Long expected";
            return null;
        };

        /**
         * Creates a PTransaction message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PTransaction
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PTransaction} PTransaction
         */
        PTransaction.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PTransaction)
                return object;
            var message = new $root.v1.PTransaction();
            if (object.sampledNewCount != null)
                if ($util.Long)
                    (message.sampledNewCount = $util.Long.fromValue(object.sampledNewCount)).unsigned = false;
                else if (typeof object.sampledNewCount === "string")
                    message.sampledNewCount = parseInt(object.sampledNewCount, 10);
                else if (typeof object.sampledNewCount === "number")
                    message.sampledNewCount = object.sampledNewCount;
                else if (typeof object.sampledNewCount === "object")
                    message.sampledNewCount = new $util.LongBits(object.sampledNewCount.low >>> 0, object.sampledNewCount.high >>> 0).toNumber();
            if (object.sampledContinuationCount != null)
                if ($util.Long)
                    (message.sampledContinuationCount = $util.Long.fromValue(object.sampledContinuationCount)).unsigned = false;
                else if (typeof object.sampledContinuationCount === "string")
                    message.sampledContinuationCount = parseInt(object.sampledContinuationCount, 10);
                else if (typeof object.sampledContinuationCount === "number")
                    message.sampledContinuationCount = object.sampledContinuationCount;
                else if (typeof object.sampledContinuationCount === "object")
                    message.sampledContinuationCount = new $util.LongBits(object.sampledContinuationCount.low >>> 0, object.sampledContinuationCount.high >>> 0).toNumber();
            if (object.unsampledNewCount != null)
                if ($util.Long)
                    (message.unsampledNewCount = $util.Long.fromValue(object.unsampledNewCount)).unsigned = false;
                else if (typeof object.unsampledNewCount === "string")
                    message.unsampledNewCount = parseInt(object.unsampledNewCount, 10);
                else if (typeof object.unsampledNewCount === "number")
                    message.unsampledNewCount = object.unsampledNewCount;
                else if (typeof object.unsampledNewCount === "object")
                    message.unsampledNewCount = new $util.LongBits(object.unsampledNewCount.low >>> 0, object.unsampledNewCount.high >>> 0).toNumber();
            if (object.unsampledContinuationCount != null)
                if ($util.Long)
                    (message.unsampledContinuationCount = $util.Long.fromValue(object.unsampledContinuationCount)).unsigned = false;
                else if (typeof object.unsampledContinuationCount === "string")
                    message.unsampledContinuationCount = parseInt(object.unsampledContinuationCount, 10);
                else if (typeof object.unsampledContinuationCount === "number")
                    message.unsampledContinuationCount = object.unsampledContinuationCount;
                else if (typeof object.unsampledContinuationCount === "object")
                    message.unsampledContinuationCount = new $util.LongBits(object.unsampledContinuationCount.low >>> 0, object.unsampledContinuationCount.high >>> 0).toNumber();
            if (object.skippedNewCount != null)
                if ($util.Long)
                    (message.skippedNewCount = $util.Long.fromValue(object.skippedNewCount)).unsigned = false;
                else if (typeof object.skippedNewCount === "string")
                    message.skippedNewCount = parseInt(object.skippedNewCount, 10);
                else if (typeof object.skippedNewCount === "number")
                    message.skippedNewCount = object.skippedNewCount;
                else if (typeof object.skippedNewCount === "object")
                    message.skippedNewCount = new $util.LongBits(object.skippedNewCount.low >>> 0, object.skippedNewCount.high >>> 0).toNumber();
            if (object.skippedContinuationCount != null)
                if ($util.Long)
                    (message.skippedContinuationCount = $util.Long.fromValue(object.skippedContinuationCount)).unsigned = false;
                else if (typeof object.skippedContinuationCount === "string")
                    message.skippedContinuationCount = parseInt(object.skippedContinuationCount, 10);
                else if (typeof object.skippedContinuationCount === "number")
                    message.skippedContinuationCount = object.skippedContinuationCount;
                else if (typeof object.skippedContinuationCount === "object")
                    message.skippedContinuationCount = new $util.LongBits(object.skippedContinuationCount.low >>> 0, object.skippedContinuationCount.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a PTransaction message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PTransaction
         * @static
         * @param {v1.PTransaction} message PTransaction
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PTransaction.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.sampledNewCount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.sampledNewCount = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.sampledContinuationCount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.sampledContinuationCount = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.unsampledNewCount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.unsampledNewCount = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.unsampledContinuationCount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.unsampledContinuationCount = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.skippedNewCount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.skippedNewCount = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.skippedContinuationCount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.skippedContinuationCount = options.longs === String ? "0" : 0;
            }
            if (message.sampledNewCount != null && message.hasOwnProperty("sampledNewCount"))
                if (typeof message.sampledNewCount === "number")
                    object.sampledNewCount = options.longs === String ? String(message.sampledNewCount) : message.sampledNewCount;
                else
                    object.sampledNewCount = options.longs === String ? $util.Long.prototype.toString.call(message.sampledNewCount) : options.longs === Number ? new $util.LongBits(message.sampledNewCount.low >>> 0, message.sampledNewCount.high >>> 0).toNumber() : message.sampledNewCount;
            if (message.sampledContinuationCount != null && message.hasOwnProperty("sampledContinuationCount"))
                if (typeof message.sampledContinuationCount === "number")
                    object.sampledContinuationCount = options.longs === String ? String(message.sampledContinuationCount) : message.sampledContinuationCount;
                else
                    object.sampledContinuationCount = options.longs === String ? $util.Long.prototype.toString.call(message.sampledContinuationCount) : options.longs === Number ? new $util.LongBits(message.sampledContinuationCount.low >>> 0, message.sampledContinuationCount.high >>> 0).toNumber() : message.sampledContinuationCount;
            if (message.unsampledNewCount != null && message.hasOwnProperty("unsampledNewCount"))
                if (typeof message.unsampledNewCount === "number")
                    object.unsampledNewCount = options.longs === String ? String(message.unsampledNewCount) : message.unsampledNewCount;
                else
                    object.unsampledNewCount = options.longs === String ? $util.Long.prototype.toString.call(message.unsampledNewCount) : options.longs === Number ? new $util.LongBits(message.unsampledNewCount.low >>> 0, message.unsampledNewCount.high >>> 0).toNumber() : message.unsampledNewCount;
            if (message.unsampledContinuationCount != null && message.hasOwnProperty("unsampledContinuationCount"))
                if (typeof message.unsampledContinuationCount === "number")
                    object.unsampledContinuationCount = options.longs === String ? String(message.unsampledContinuationCount) : message.unsampledContinuationCount;
                else
                    object.unsampledContinuationCount = options.longs === String ? $util.Long.prototype.toString.call(message.unsampledContinuationCount) : options.longs === Number ? new $util.LongBits(message.unsampledContinuationCount.low >>> 0, message.unsampledContinuationCount.high >>> 0).toNumber() : message.unsampledContinuationCount;
            if (message.skippedNewCount != null && message.hasOwnProperty("skippedNewCount"))
                if (typeof message.skippedNewCount === "number")
                    object.skippedNewCount = options.longs === String ? String(message.skippedNewCount) : message.skippedNewCount;
                else
                    object.skippedNewCount = options.longs === String ? $util.Long.prototype.toString.call(message.skippedNewCount) : options.longs === Number ? new $util.LongBits(message.skippedNewCount.low >>> 0, message.skippedNewCount.high >>> 0).toNumber() : message.skippedNewCount;
            if (message.skippedContinuationCount != null && message.hasOwnProperty("skippedContinuationCount"))
                if (typeof message.skippedContinuationCount === "number")
                    object.skippedContinuationCount = options.longs === String ? String(message.skippedContinuationCount) : message.skippedContinuationCount;
                else
                    object.skippedContinuationCount = options.longs === String ? $util.Long.prototype.toString.call(message.skippedContinuationCount) : options.longs === Number ? new $util.LongBits(message.skippedContinuationCount.low >>> 0, message.skippedContinuationCount.high >>> 0).toNumber() : message.skippedContinuationCount;
            return object;
        };

        /**
         * Converts this PTransaction to JSON.
         * @function toJSON
         * @memberof v1.PTransaction
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PTransaction.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PTransaction;
    })();

    v1.PActiveTraceHistogram = (function() {

        /**
         * Properties of a PActiveTraceHistogram.
         * @memberof v1
         * @interface IPActiveTraceHistogram
         * @property {number|null} [version] PActiveTraceHistogram version
         * @property {number|null} [histogramSchemaType] PActiveTraceHistogram histogramSchemaType
         * @property {Array.<number>|null} [activeTraceCount] PActiveTraceHistogram activeTraceCount
         */

        /**
         * Constructs a new PActiveTraceHistogram.
         * @memberof v1
         * @classdesc Represents a PActiveTraceHistogram.
         * @implements IPActiveTraceHistogram
         * @constructor
         * @param {v1.IPActiveTraceHistogram=} [properties] Properties to set
         */
        function PActiveTraceHistogram(properties) {
            this.activeTraceCount = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PActiveTraceHistogram version.
         * @member {number} version
         * @memberof v1.PActiveTraceHistogram
         * @instance
         */
        PActiveTraceHistogram.prototype.version = 0;

        /**
         * PActiveTraceHistogram histogramSchemaType.
         * @member {number} histogramSchemaType
         * @memberof v1.PActiveTraceHistogram
         * @instance
         */
        PActiveTraceHistogram.prototype.histogramSchemaType = 0;

        /**
         * PActiveTraceHistogram activeTraceCount.
         * @member {Array.<number>} activeTraceCount
         * @memberof v1.PActiveTraceHistogram
         * @instance
         */
        PActiveTraceHistogram.prototype.activeTraceCount = $util.emptyArray;

        /**
         * Creates a new PActiveTraceHistogram instance using the specified properties.
         * @function create
         * @memberof v1.PActiveTraceHistogram
         * @static
         * @param {v1.IPActiveTraceHistogram=} [properties] Properties to set
         * @returns {v1.PActiveTraceHistogram} PActiveTraceHistogram instance
         */
        PActiveTraceHistogram.create = function create(properties) {
            return new PActiveTraceHistogram(properties);
        };

        /**
         * Encodes the specified PActiveTraceHistogram message. Does not implicitly {@link v1.PActiveTraceHistogram.verify|verify} messages.
         * @function encode
         * @memberof v1.PActiveTraceHistogram
         * @static
         * @param {v1.IPActiveTraceHistogram} message PActiveTraceHistogram message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PActiveTraceHistogram.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.version != null && message.hasOwnProperty("version"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.version);
            if (message.histogramSchemaType != null && message.hasOwnProperty("histogramSchemaType"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.histogramSchemaType);
            if (message.activeTraceCount != null && message.activeTraceCount.length) {
                writer.uint32(/* id 3, wireType 2 =*/26).fork();
                for (var i = 0; i < message.activeTraceCount.length; ++i)
                    writer.int32(message.activeTraceCount[i]);
                writer.ldelim();
            }
            return writer;
        };

        /**
         * Encodes the specified PActiveTraceHistogram message, length delimited. Does not implicitly {@link v1.PActiveTraceHistogram.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PActiveTraceHistogram
         * @static
         * @param {v1.IPActiveTraceHistogram} message PActiveTraceHistogram message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PActiveTraceHistogram.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PActiveTraceHistogram message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PActiveTraceHistogram
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PActiveTraceHistogram} PActiveTraceHistogram
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PActiveTraceHistogram.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PActiveTraceHistogram();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.version = reader.int32();
                    break;
                case 2:
                    message.histogramSchemaType = reader.int32();
                    break;
                case 3:
                    if (!(message.activeTraceCount && message.activeTraceCount.length))
                        message.activeTraceCount = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.activeTraceCount.push(reader.int32());
                    } else
                        message.activeTraceCount.push(reader.int32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PActiveTraceHistogram message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PActiveTraceHistogram
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PActiveTraceHistogram} PActiveTraceHistogram
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PActiveTraceHistogram.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PActiveTraceHistogram message.
         * @function verify
         * @memberof v1.PActiveTraceHistogram
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PActiveTraceHistogram.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.version != null && message.hasOwnProperty("version"))
                if (!$util.isInteger(message.version))
                    return "version: integer expected";
            if (message.histogramSchemaType != null && message.hasOwnProperty("histogramSchemaType"))
                if (!$util.isInteger(message.histogramSchemaType))
                    return "histogramSchemaType: integer expected";
            if (message.activeTraceCount != null && message.hasOwnProperty("activeTraceCount")) {
                if (!Array.isArray(message.activeTraceCount))
                    return "activeTraceCount: array expected";
                for (var i = 0; i < message.activeTraceCount.length; ++i)
                    if (!$util.isInteger(message.activeTraceCount[i]))
                        return "activeTraceCount: integer[] expected";
            }
            return null;
        };

        /**
         * Creates a PActiveTraceHistogram message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PActiveTraceHistogram
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PActiveTraceHistogram} PActiveTraceHistogram
         */
        PActiveTraceHistogram.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PActiveTraceHistogram)
                return object;
            var message = new $root.v1.PActiveTraceHistogram();
            if (object.version != null)
                message.version = object.version | 0;
            if (object.histogramSchemaType != null)
                message.histogramSchemaType = object.histogramSchemaType | 0;
            if (object.activeTraceCount) {
                if (!Array.isArray(object.activeTraceCount))
                    throw TypeError(".v1.PActiveTraceHistogram.activeTraceCount: array expected");
                message.activeTraceCount = [];
                for (var i = 0; i < object.activeTraceCount.length; ++i)
                    message.activeTraceCount[i] = object.activeTraceCount[i] | 0;
            }
            return message;
        };

        /**
         * Creates a plain object from a PActiveTraceHistogram message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PActiveTraceHistogram
         * @static
         * @param {v1.PActiveTraceHistogram} message PActiveTraceHistogram
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PActiveTraceHistogram.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.activeTraceCount = [];
            if (options.defaults) {
                object.version = 0;
                object.histogramSchemaType = 0;
            }
            if (message.version != null && message.hasOwnProperty("version"))
                object.version = message.version;
            if (message.histogramSchemaType != null && message.hasOwnProperty("histogramSchemaType"))
                object.histogramSchemaType = message.histogramSchemaType;
            if (message.activeTraceCount && message.activeTraceCount.length) {
                object.activeTraceCount = [];
                for (var j = 0; j < message.activeTraceCount.length; ++j)
                    object.activeTraceCount[j] = message.activeTraceCount[j];
            }
            return object;
        };

        /**
         * Converts this PActiveTraceHistogram to JSON.
         * @function toJSON
         * @memberof v1.PActiveTraceHistogram
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PActiveTraceHistogram.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PActiveTraceHistogram;
    })();

    v1.PActiveTrace = (function() {

        /**
         * Properties of a PActiveTrace.
         * @memberof v1
         * @interface IPActiveTrace
         * @property {v1.IPActiveTraceHistogram|null} [histogram] PActiveTrace histogram
         */

        /**
         * Constructs a new PActiveTrace.
         * @memberof v1
         * @classdesc Represents a PActiveTrace.
         * @implements IPActiveTrace
         * @constructor
         * @param {v1.IPActiveTrace=} [properties] Properties to set
         */
        function PActiveTrace(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PActiveTrace histogram.
         * @member {v1.IPActiveTraceHistogram|null|undefined} histogram
         * @memberof v1.PActiveTrace
         * @instance
         */
        PActiveTrace.prototype.histogram = null;

        /**
         * Creates a new PActiveTrace instance using the specified properties.
         * @function create
         * @memberof v1.PActiveTrace
         * @static
         * @param {v1.IPActiveTrace=} [properties] Properties to set
         * @returns {v1.PActiveTrace} PActiveTrace instance
         */
        PActiveTrace.create = function create(properties) {
            return new PActiveTrace(properties);
        };

        /**
         * Encodes the specified PActiveTrace message. Does not implicitly {@link v1.PActiveTrace.verify|verify} messages.
         * @function encode
         * @memberof v1.PActiveTrace
         * @static
         * @param {v1.IPActiveTrace} message PActiveTrace message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PActiveTrace.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.histogram != null && message.hasOwnProperty("histogram"))
                $root.v1.PActiveTraceHistogram.encode(message.histogram, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified PActiveTrace message, length delimited. Does not implicitly {@link v1.PActiveTrace.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PActiveTrace
         * @static
         * @param {v1.IPActiveTrace} message PActiveTrace message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PActiveTrace.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PActiveTrace message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PActiveTrace
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PActiveTrace} PActiveTrace
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PActiveTrace.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PActiveTrace();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.histogram = $root.v1.PActiveTraceHistogram.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PActiveTrace message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PActiveTrace
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PActiveTrace} PActiveTrace
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PActiveTrace.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PActiveTrace message.
         * @function verify
         * @memberof v1.PActiveTrace
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PActiveTrace.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.histogram != null && message.hasOwnProperty("histogram")) {
                var error = $root.v1.PActiveTraceHistogram.verify(message.histogram);
                if (error)
                    return "histogram." + error;
            }
            return null;
        };

        /**
         * Creates a PActiveTrace message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PActiveTrace
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PActiveTrace} PActiveTrace
         */
        PActiveTrace.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PActiveTrace)
                return object;
            var message = new $root.v1.PActiveTrace();
            if (object.histogram != null) {
                if (typeof object.histogram !== "object")
                    throw TypeError(".v1.PActiveTrace.histogram: object expected");
                message.histogram = $root.v1.PActiveTraceHistogram.fromObject(object.histogram);
            }
            return message;
        };

        /**
         * Creates a plain object from a PActiveTrace message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PActiveTrace
         * @static
         * @param {v1.PActiveTrace} message PActiveTrace
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PActiveTrace.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.histogram = null;
            if (message.histogram != null && message.hasOwnProperty("histogram"))
                object.histogram = $root.v1.PActiveTraceHistogram.toObject(message.histogram, options);
            return object;
        };

        /**
         * Converts this PActiveTrace to JSON.
         * @function toJSON
         * @memberof v1.PActiveTrace
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PActiveTrace.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PActiveTrace;
    })();

    v1.PResponseTime = (function() {

        /**
         * Properties of a PResponseTime.
         * @memberof v1
         * @interface IPResponseTime
         * @property {number|Long|null} [avg] PResponseTime avg
         * @property {number|Long|null} [max] PResponseTime max
         */

        /**
         * Constructs a new PResponseTime.
         * @memberof v1
         * @classdesc Represents a PResponseTime.
         * @implements IPResponseTime
         * @constructor
         * @param {v1.IPResponseTime=} [properties] Properties to set
         */
        function PResponseTime(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PResponseTime avg.
         * @member {number|Long} avg
         * @memberof v1.PResponseTime
         * @instance
         */
        PResponseTime.prototype.avg = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PResponseTime max.
         * @member {number|Long} max
         * @memberof v1.PResponseTime
         * @instance
         */
        PResponseTime.prototype.max = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new PResponseTime instance using the specified properties.
         * @function create
         * @memberof v1.PResponseTime
         * @static
         * @param {v1.IPResponseTime=} [properties] Properties to set
         * @returns {v1.PResponseTime} PResponseTime instance
         */
        PResponseTime.create = function create(properties) {
            return new PResponseTime(properties);
        };

        /**
         * Encodes the specified PResponseTime message. Does not implicitly {@link v1.PResponseTime.verify|verify} messages.
         * @function encode
         * @memberof v1.PResponseTime
         * @static
         * @param {v1.IPResponseTime} message PResponseTime message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PResponseTime.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.avg != null && message.hasOwnProperty("avg"))
                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.avg);
            if (message.max != null && message.hasOwnProperty("max"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.max);
            return writer;
        };

        /**
         * Encodes the specified PResponseTime message, length delimited. Does not implicitly {@link v1.PResponseTime.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PResponseTime
         * @static
         * @param {v1.IPResponseTime} message PResponseTime message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PResponseTime.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PResponseTime message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PResponseTime
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PResponseTime} PResponseTime
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PResponseTime.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PResponseTime();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.avg = reader.int64();
                    break;
                case 2:
                    message.max = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PResponseTime message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PResponseTime
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PResponseTime} PResponseTime
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PResponseTime.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PResponseTime message.
         * @function verify
         * @memberof v1.PResponseTime
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PResponseTime.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.avg != null && message.hasOwnProperty("avg"))
                if (!$util.isInteger(message.avg) && !(message.avg && $util.isInteger(message.avg.low) && $util.isInteger(message.avg.high)))
                    return "avg: integer|Long expected";
            if (message.max != null && message.hasOwnProperty("max"))
                if (!$util.isInteger(message.max) && !(message.max && $util.isInteger(message.max.low) && $util.isInteger(message.max.high)))
                    return "max: integer|Long expected";
            return null;
        };

        /**
         * Creates a PResponseTime message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PResponseTime
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PResponseTime} PResponseTime
         */
        PResponseTime.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PResponseTime)
                return object;
            var message = new $root.v1.PResponseTime();
            if (object.avg != null)
                if ($util.Long)
                    (message.avg = $util.Long.fromValue(object.avg)).unsigned = false;
                else if (typeof object.avg === "string")
                    message.avg = parseInt(object.avg, 10);
                else if (typeof object.avg === "number")
                    message.avg = object.avg;
                else if (typeof object.avg === "object")
                    message.avg = new $util.LongBits(object.avg.low >>> 0, object.avg.high >>> 0).toNumber();
            if (object.max != null)
                if ($util.Long)
                    (message.max = $util.Long.fromValue(object.max)).unsigned = false;
                else if (typeof object.max === "string")
                    message.max = parseInt(object.max, 10);
                else if (typeof object.max === "number")
                    message.max = object.max;
                else if (typeof object.max === "object")
                    message.max = new $util.LongBits(object.max.low >>> 0, object.max.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a PResponseTime message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PResponseTime
         * @static
         * @param {v1.PResponseTime} message PResponseTime
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PResponseTime.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.avg = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.avg = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.max = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.max = options.longs === String ? "0" : 0;
            }
            if (message.avg != null && message.hasOwnProperty("avg"))
                if (typeof message.avg === "number")
                    object.avg = options.longs === String ? String(message.avg) : message.avg;
                else
                    object.avg = options.longs === String ? $util.Long.prototype.toString.call(message.avg) : options.longs === Number ? new $util.LongBits(message.avg.low >>> 0, message.avg.high >>> 0).toNumber() : message.avg;
            if (message.max != null && message.hasOwnProperty("max"))
                if (typeof message.max === "number")
                    object.max = options.longs === String ? String(message.max) : message.max;
                else
                    object.max = options.longs === String ? $util.Long.prototype.toString.call(message.max) : options.longs === Number ? new $util.LongBits(message.max.low >>> 0, message.max.high >>> 0).toNumber() : message.max;
            return object;
        };

        /**
         * Converts this PResponseTime to JSON.
         * @function toJSON
         * @memberof v1.PResponseTime
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PResponseTime.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PResponseTime;
    })();

    v1.PDeadlock = (function() {

        /**
         * Properties of a PDeadlock.
         * @memberof v1
         * @interface IPDeadlock
         * @property {number|null} [count] PDeadlock count
         * @property {Array.<v1.IPThreadDump>|null} [threadDump] PDeadlock threadDump
         */

        /**
         * Constructs a new PDeadlock.
         * @memberof v1
         * @classdesc Represents a PDeadlock.
         * @implements IPDeadlock
         * @constructor
         * @param {v1.IPDeadlock=} [properties] Properties to set
         */
        function PDeadlock(properties) {
            this.threadDump = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PDeadlock count.
         * @member {number} count
         * @memberof v1.PDeadlock
         * @instance
         */
        PDeadlock.prototype.count = 0;

        /**
         * PDeadlock threadDump.
         * @member {Array.<v1.IPThreadDump>} threadDump
         * @memberof v1.PDeadlock
         * @instance
         */
        PDeadlock.prototype.threadDump = $util.emptyArray;

        /**
         * Creates a new PDeadlock instance using the specified properties.
         * @function create
         * @memberof v1.PDeadlock
         * @static
         * @param {v1.IPDeadlock=} [properties] Properties to set
         * @returns {v1.PDeadlock} PDeadlock instance
         */
        PDeadlock.create = function create(properties) {
            return new PDeadlock(properties);
        };

        /**
         * Encodes the specified PDeadlock message. Does not implicitly {@link v1.PDeadlock.verify|verify} messages.
         * @function encode
         * @memberof v1.PDeadlock
         * @static
         * @param {v1.IPDeadlock} message PDeadlock message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PDeadlock.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.count != null && message.hasOwnProperty("count"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.count);
            if (message.threadDump != null && message.threadDump.length)
                for (var i = 0; i < message.threadDump.length; ++i)
                    $root.v1.PThreadDump.encode(message.threadDump[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified PDeadlock message, length delimited. Does not implicitly {@link v1.PDeadlock.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PDeadlock
         * @static
         * @param {v1.IPDeadlock} message PDeadlock message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PDeadlock.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PDeadlock message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PDeadlock
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PDeadlock} PDeadlock
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PDeadlock.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PDeadlock();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.count = reader.int32();
                    break;
                case 2:
                    if (!(message.threadDump && message.threadDump.length))
                        message.threadDump = [];
                    message.threadDump.push($root.v1.PThreadDump.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PDeadlock message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PDeadlock
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PDeadlock} PDeadlock
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PDeadlock.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PDeadlock message.
         * @function verify
         * @memberof v1.PDeadlock
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PDeadlock.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.count != null && message.hasOwnProperty("count"))
                if (!$util.isInteger(message.count))
                    return "count: integer expected";
            if (message.threadDump != null && message.hasOwnProperty("threadDump")) {
                if (!Array.isArray(message.threadDump))
                    return "threadDump: array expected";
                for (var i = 0; i < message.threadDump.length; ++i) {
                    var error = $root.v1.PThreadDump.verify(message.threadDump[i]);
                    if (error)
                        return "threadDump." + error;
                }
            }
            return null;
        };

        /**
         * Creates a PDeadlock message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PDeadlock
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PDeadlock} PDeadlock
         */
        PDeadlock.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PDeadlock)
                return object;
            var message = new $root.v1.PDeadlock();
            if (object.count != null)
                message.count = object.count | 0;
            if (object.threadDump) {
                if (!Array.isArray(object.threadDump))
                    throw TypeError(".v1.PDeadlock.threadDump: array expected");
                message.threadDump = [];
                for (var i = 0; i < object.threadDump.length; ++i) {
                    if (typeof object.threadDump[i] !== "object")
                        throw TypeError(".v1.PDeadlock.threadDump: object expected");
                    message.threadDump[i] = $root.v1.PThreadDump.fromObject(object.threadDump[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a PDeadlock message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PDeadlock
         * @static
         * @param {v1.PDeadlock} message PDeadlock
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PDeadlock.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.threadDump = [];
            if (options.defaults)
                object.count = 0;
            if (message.count != null && message.hasOwnProperty("count"))
                object.count = message.count;
            if (message.threadDump && message.threadDump.length) {
                object.threadDump = [];
                for (var j = 0; j < message.threadDump.length; ++j)
                    object.threadDump[j] = $root.v1.PThreadDump.toObject(message.threadDump[j], options);
            }
            return object;
        };

        /**
         * Converts this PDeadlock to JSON.
         * @function toJSON
         * @memberof v1.PDeadlock
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PDeadlock.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PDeadlock;
    })();

    v1.PDirectBuffer = (function() {

        /**
         * Properties of a PDirectBuffer.
         * @memberof v1
         * @interface IPDirectBuffer
         * @property {number|Long|null} [directCount] PDirectBuffer directCount
         * @property {number|Long|null} [directMemoryUsed] PDirectBuffer directMemoryUsed
         * @property {number|Long|null} [mappedCount] PDirectBuffer mappedCount
         * @property {number|Long|null} [mappedMemoryUsed] PDirectBuffer mappedMemoryUsed
         */

        /**
         * Constructs a new PDirectBuffer.
         * @memberof v1
         * @classdesc Represents a PDirectBuffer.
         * @implements IPDirectBuffer
         * @constructor
         * @param {v1.IPDirectBuffer=} [properties] Properties to set
         */
        function PDirectBuffer(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PDirectBuffer directCount.
         * @member {number|Long} directCount
         * @memberof v1.PDirectBuffer
         * @instance
         */
        PDirectBuffer.prototype.directCount = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PDirectBuffer directMemoryUsed.
         * @member {number|Long} directMemoryUsed
         * @memberof v1.PDirectBuffer
         * @instance
         */
        PDirectBuffer.prototype.directMemoryUsed = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PDirectBuffer mappedCount.
         * @member {number|Long} mappedCount
         * @memberof v1.PDirectBuffer
         * @instance
         */
        PDirectBuffer.prototype.mappedCount = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PDirectBuffer mappedMemoryUsed.
         * @member {number|Long} mappedMemoryUsed
         * @memberof v1.PDirectBuffer
         * @instance
         */
        PDirectBuffer.prototype.mappedMemoryUsed = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new PDirectBuffer instance using the specified properties.
         * @function create
         * @memberof v1.PDirectBuffer
         * @static
         * @param {v1.IPDirectBuffer=} [properties] Properties to set
         * @returns {v1.PDirectBuffer} PDirectBuffer instance
         */
        PDirectBuffer.create = function create(properties) {
            return new PDirectBuffer(properties);
        };

        /**
         * Encodes the specified PDirectBuffer message. Does not implicitly {@link v1.PDirectBuffer.verify|verify} messages.
         * @function encode
         * @memberof v1.PDirectBuffer
         * @static
         * @param {v1.IPDirectBuffer} message PDirectBuffer message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PDirectBuffer.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.directCount != null && message.hasOwnProperty("directCount"))
                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.directCount);
            if (message.directMemoryUsed != null && message.hasOwnProperty("directMemoryUsed"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.directMemoryUsed);
            if (message.mappedCount != null && message.hasOwnProperty("mappedCount"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.mappedCount);
            if (message.mappedMemoryUsed != null && message.hasOwnProperty("mappedMemoryUsed"))
                writer.uint32(/* id 4, wireType 0 =*/32).int64(message.mappedMemoryUsed);
            return writer;
        };

        /**
         * Encodes the specified PDirectBuffer message, length delimited. Does not implicitly {@link v1.PDirectBuffer.verify|verify} messages.
         * @function encodeDelimited
         * @memberof v1.PDirectBuffer
         * @static
         * @param {v1.IPDirectBuffer} message PDirectBuffer message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PDirectBuffer.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PDirectBuffer message from the specified reader or buffer.
         * @function decode
         * @memberof v1.PDirectBuffer
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {v1.PDirectBuffer} PDirectBuffer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PDirectBuffer.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.v1.PDirectBuffer();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.directCount = reader.int64();
                    break;
                case 2:
                    message.directMemoryUsed = reader.int64();
                    break;
                case 3:
                    message.mappedCount = reader.int64();
                    break;
                case 4:
                    message.mappedMemoryUsed = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PDirectBuffer message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof v1.PDirectBuffer
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {v1.PDirectBuffer} PDirectBuffer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PDirectBuffer.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PDirectBuffer message.
         * @function verify
         * @memberof v1.PDirectBuffer
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PDirectBuffer.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.directCount != null && message.hasOwnProperty("directCount"))
                if (!$util.isInteger(message.directCount) && !(message.directCount && $util.isInteger(message.directCount.low) && $util.isInteger(message.directCount.high)))
                    return "directCount: integer|Long expected";
            if (message.directMemoryUsed != null && message.hasOwnProperty("directMemoryUsed"))
                if (!$util.isInteger(message.directMemoryUsed) && !(message.directMemoryUsed && $util.isInteger(message.directMemoryUsed.low) && $util.isInteger(message.directMemoryUsed.high)))
                    return "directMemoryUsed: integer|Long expected";
            if (message.mappedCount != null && message.hasOwnProperty("mappedCount"))
                if (!$util.isInteger(message.mappedCount) && !(message.mappedCount && $util.isInteger(message.mappedCount.low) && $util.isInteger(message.mappedCount.high)))
                    return "mappedCount: integer|Long expected";
            if (message.mappedMemoryUsed != null && message.hasOwnProperty("mappedMemoryUsed"))
                if (!$util.isInteger(message.mappedMemoryUsed) && !(message.mappedMemoryUsed && $util.isInteger(message.mappedMemoryUsed.low) && $util.isInteger(message.mappedMemoryUsed.high)))
                    return "mappedMemoryUsed: integer|Long expected";
            return null;
        };

        /**
         * Creates a PDirectBuffer message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof v1.PDirectBuffer
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {v1.PDirectBuffer} PDirectBuffer
         */
        PDirectBuffer.fromObject = function fromObject(object) {
            if (object instanceof $root.v1.PDirectBuffer)
                return object;
            var message = new $root.v1.PDirectBuffer();
            if (object.directCount != null)
                if ($util.Long)
                    (message.directCount = $util.Long.fromValue(object.directCount)).unsigned = false;
                else if (typeof object.directCount === "string")
                    message.directCount = parseInt(object.directCount, 10);
                else if (typeof object.directCount === "number")
                    message.directCount = object.directCount;
                else if (typeof object.directCount === "object")
                    message.directCount = new $util.LongBits(object.directCount.low >>> 0, object.directCount.high >>> 0).toNumber();
            if (object.directMemoryUsed != null)
                if ($util.Long)
                    (message.directMemoryUsed = $util.Long.fromValue(object.directMemoryUsed)).unsigned = false;
                else if (typeof object.directMemoryUsed === "string")
                    message.directMemoryUsed = parseInt(object.directMemoryUsed, 10);
                else if (typeof object.directMemoryUsed === "number")
                    message.directMemoryUsed = object.directMemoryUsed;
                else if (typeof object.directMemoryUsed === "object")
                    message.directMemoryUsed = new $util.LongBits(object.directMemoryUsed.low >>> 0, object.directMemoryUsed.high >>> 0).toNumber();
            if (object.mappedCount != null)
                if ($util.Long)
                    (message.mappedCount = $util.Long.fromValue(object.mappedCount)).unsigned = false;
                else if (typeof object.mappedCount === "string")
                    message.mappedCount = parseInt(object.mappedCount, 10);
                else if (typeof object.mappedCount === "number")
                    message.mappedCount = object.mappedCount;
                else if (typeof object.mappedCount === "object")
                    message.mappedCount = new $util.LongBits(object.mappedCount.low >>> 0, object.mappedCount.high >>> 0).toNumber();
            if (object.mappedMemoryUsed != null)
                if ($util.Long)
                    (message.mappedMemoryUsed = $util.Long.fromValue(object.mappedMemoryUsed)).unsigned = false;
                else if (typeof object.mappedMemoryUsed === "string")
                    message.mappedMemoryUsed = parseInt(object.mappedMemoryUsed, 10);
                else if (typeof object.mappedMemoryUsed === "number")
                    message.mappedMemoryUsed = object.mappedMemoryUsed;
                else if (typeof object.mappedMemoryUsed === "object")
                    message.mappedMemoryUsed = new $util.LongBits(object.mappedMemoryUsed.low >>> 0, object.mappedMemoryUsed.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a PDirectBuffer message. Also converts values to other types if specified.
         * @function toObject
         * @memberof v1.PDirectBuffer
         * @static
         * @param {v1.PDirectBuffer} message PDirectBuffer
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PDirectBuffer.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.directCount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.directCount = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.directMemoryUsed = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.directMemoryUsed = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.mappedCount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.mappedCount = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.mappedMemoryUsed = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.mappedMemoryUsed = options.longs === String ? "0" : 0;
            }
            if (message.directCount != null && message.hasOwnProperty("directCount"))
                if (typeof message.directCount === "number")
                    object.directCount = options.longs === String ? String(message.directCount) : message.directCount;
                else
                    object.directCount = options.longs === String ? $util.Long.prototype.toString.call(message.directCount) : options.longs === Number ? new $util.LongBits(message.directCount.low >>> 0, message.directCount.high >>> 0).toNumber() : message.directCount;
            if (message.directMemoryUsed != null && message.hasOwnProperty("directMemoryUsed"))
                if (typeof message.directMemoryUsed === "number")
                    object.directMemoryUsed = options.longs === String ? String(message.directMemoryUsed) : message.directMemoryUsed;
                else
                    object.directMemoryUsed = options.longs === String ? $util.Long.prototype.toString.call(message.directMemoryUsed) : options.longs === Number ? new $util.LongBits(message.directMemoryUsed.low >>> 0, message.directMemoryUsed.high >>> 0).toNumber() : message.directMemoryUsed;
            if (message.mappedCount != null && message.hasOwnProperty("mappedCount"))
                if (typeof message.mappedCount === "number")
                    object.mappedCount = options.longs === String ? String(message.mappedCount) : message.mappedCount;
                else
                    object.mappedCount = options.longs === String ? $util.Long.prototype.toString.call(message.mappedCount) : options.longs === Number ? new $util.LongBits(message.mappedCount.low >>> 0, message.mappedCount.high >>> 0).toNumber() : message.mappedCount;
            if (message.mappedMemoryUsed != null && message.hasOwnProperty("mappedMemoryUsed"))
                if (typeof message.mappedMemoryUsed === "number")
                    object.mappedMemoryUsed = options.longs === String ? String(message.mappedMemoryUsed) : message.mappedMemoryUsed;
                else
                    object.mappedMemoryUsed = options.longs === String ? $util.Long.prototype.toString.call(message.mappedMemoryUsed) : options.longs === Number ? new $util.LongBits(message.mappedMemoryUsed.low >>> 0, message.mappedMemoryUsed.high >>> 0).toNumber() : message.mappedMemoryUsed;
            return object;
        };

        /**
         * Converts this PDirectBuffer to JSON.
         * @function toJSON
         * @memberof v1.PDirectBuffer
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PDirectBuffer.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PDirectBuffer;
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
