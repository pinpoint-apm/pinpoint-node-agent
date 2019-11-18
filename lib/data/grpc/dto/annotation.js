/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

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
