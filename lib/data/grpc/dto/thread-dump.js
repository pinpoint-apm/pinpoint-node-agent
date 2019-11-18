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
