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

    v1.Span = (function() {

        /**
         * Constructs a new Span service.
         * @memberof v1
         * @classdesc Represents a Span
         * @extends $protobuf.rpc.Service
         * @constructor
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         */
        function Span(rpcImpl, requestDelimited, responseDelimited) {
            $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
        }

        (Span.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = Span;

        /**
         * Creates new Span service using the specified rpc implementation.
         * @function create
         * @memberof v1.Span
         * @static
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         * @returns {Span} RPC service. Useful where requests and/or responses are streamed.
         */
        Span.create = function create(rpcImpl, requestDelimited, responseDelimited) {
            return new this(rpcImpl, requestDelimited, responseDelimited);
        };

        /**
         * Callback as used by {@link v1.Span#sendSpan}.
         * @memberof v1.Span
         * @typedef SendSpanCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {google.protobuf.Empty} [response] Empty
         */

        /**
         * Calls SendSpan.
         * @function sendSpan
         * @memberof v1.Span
         * @instance
         * @param {v1.IPSpanMessage} request PSpanMessage message or plain object
         * @param {v1.Span.SendSpanCallback} callback Node-style callback called with the error, if any, and Empty
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(Span.prototype.sendSpan = function sendSpan(request, callback) {
            return this.rpcCall(sendSpan, $root.v1.PSpanMessage, $root.google.protobuf.Empty, request, callback);
        }, "name", { value: "SendSpan" });

        /**
         * Calls SendSpan.
         * @function sendSpan
         * @memberof v1.Span
         * @instance
         * @param {v1.IPSpanMessage} request PSpanMessage message or plain object
         * @returns {Promise<google.protobuf.Empty>} Promise
         * @variation 2
         */

        return Span;
    })();

    v1.Agent = (function() {

        /**
         * Constructs a new Agent service.
         * @memberof v1
         * @classdesc Represents an Agent
         * @extends $protobuf.rpc.Service
         * @constructor
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         */
        function Agent(rpcImpl, requestDelimited, responseDelimited) {
            $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
        }

        (Agent.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = Agent;

        /**
         * Creates new Agent service using the specified rpc implementation.
         * @function create
         * @memberof v1.Agent
         * @static
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         * @returns {Agent} RPC service. Useful where requests and/or responses are streamed.
         */
        Agent.create = function create(rpcImpl, requestDelimited, responseDelimited) {
            return new this(rpcImpl, requestDelimited, responseDelimited);
        };

        /**
         * Callback as used by {@link v1.Agent#requestAgentInfo}.
         * @memberof v1.Agent
         * @typedef RequestAgentInfoCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {v1.PResult} [response] PResult
         */

        /**
         * Calls RequestAgentInfo.
         * @function requestAgentInfo
         * @memberof v1.Agent
         * @instance
         * @param {v1.IPAgentInfo} request PAgentInfo message or plain object
         * @param {v1.Agent.RequestAgentInfoCallback} callback Node-style callback called with the error, if any, and PResult
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(Agent.prototype.requestAgentInfo = function requestAgentInfo(request, callback) {
            return this.rpcCall(requestAgentInfo, $root.v1.PAgentInfo, $root.v1.PResult, request, callback);
        }, "name", { value: "RequestAgentInfo" });

        /**
         * Calls RequestAgentInfo.
         * @function requestAgentInfo
         * @memberof v1.Agent
         * @instance
         * @param {v1.IPAgentInfo} request PAgentInfo message or plain object
         * @returns {Promise<v1.PResult>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link v1.Agent#pingSession}.
         * @memberof v1.Agent
         * @typedef PingSessionCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {v1.PPing} [response] PPing
         */

        /**
         * Calls PingSession.
         * @function pingSession
         * @memberof v1.Agent
         * @instance
         * @param {v1.IPPing} request PPing message or plain object
         * @param {v1.Agent.PingSessionCallback} callback Node-style callback called with the error, if any, and PPing
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(Agent.prototype.pingSession = function pingSession(request, callback) {
            return this.rpcCall(pingSession, $root.v1.PPing, $root.v1.PPing, request, callback);
        }, "name", { value: "PingSession" });

        /**
         * Calls PingSession.
         * @function pingSession
         * @memberof v1.Agent
         * @instance
         * @param {v1.IPPing} request PPing message or plain object
         * @returns {Promise<v1.PPing>} Promise
         * @variation 2
         */

        return Agent;
    })();

    v1.Metadata = (function() {

        /**
         * Constructs a new Metadata service.
         * @memberof v1
         * @classdesc Represents a Metadata
         * @extends $protobuf.rpc.Service
         * @constructor
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         */
        function Metadata(rpcImpl, requestDelimited, responseDelimited) {
            $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
        }

        (Metadata.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = Metadata;

        /**
         * Creates new Metadata service using the specified rpc implementation.
         * @function create
         * @memberof v1.Metadata
         * @static
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         * @returns {Metadata} RPC service. Useful where requests and/or responses are streamed.
         */
        Metadata.create = function create(rpcImpl, requestDelimited, responseDelimited) {
            return new this(rpcImpl, requestDelimited, responseDelimited);
        };

        /**
         * Callback as used by {@link v1.Metadata#requestSqlMetaData}.
         * @memberof v1.Metadata
         * @typedef RequestSqlMetaDataCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {v1.PResult} [response] PResult
         */

        /**
         * Calls RequestSqlMetaData.
         * @function requestSqlMetaData
         * @memberof v1.Metadata
         * @instance
         * @param {v1.IPSqlMetaData} request PSqlMetaData message or plain object
         * @param {v1.Metadata.RequestSqlMetaDataCallback} callback Node-style callback called with the error, if any, and PResult
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(Metadata.prototype.requestSqlMetaData = function requestSqlMetaData(request, callback) {
            return this.rpcCall(requestSqlMetaData, $root.v1.PSqlMetaData, $root.v1.PResult, request, callback);
        }, "name", { value: "RequestSqlMetaData" });

        /**
         * Calls RequestSqlMetaData.
         * @function requestSqlMetaData
         * @memberof v1.Metadata
         * @instance
         * @param {v1.IPSqlMetaData} request PSqlMetaData message or plain object
         * @returns {Promise<v1.PResult>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link v1.Metadata#requestApiMetaData}.
         * @memberof v1.Metadata
         * @typedef RequestApiMetaDataCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {v1.PResult} [response] PResult
         */

        /**
         * Calls RequestApiMetaData.
         * @function requestApiMetaData
         * @memberof v1.Metadata
         * @instance
         * @param {v1.IPApiMetaData} request PApiMetaData message or plain object
         * @param {v1.Metadata.RequestApiMetaDataCallback} callback Node-style callback called with the error, if any, and PResult
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(Metadata.prototype.requestApiMetaData = function requestApiMetaData(request, callback) {
            return this.rpcCall(requestApiMetaData, $root.v1.PApiMetaData, $root.v1.PResult, request, callback);
        }, "name", { value: "RequestApiMetaData" });

        /**
         * Calls RequestApiMetaData.
         * @function requestApiMetaData
         * @memberof v1.Metadata
         * @instance
         * @param {v1.IPApiMetaData} request PApiMetaData message or plain object
         * @returns {Promise<v1.PResult>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link v1.Metadata#requestStringMetaData}.
         * @memberof v1.Metadata
         * @typedef RequestStringMetaDataCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {v1.PResult} [response] PResult
         */

        /**
         * Calls RequestStringMetaData.
         * @function requestStringMetaData
         * @memberof v1.Metadata
         * @instance
         * @param {v1.IPStringMetaData} request PStringMetaData message or plain object
         * @param {v1.Metadata.RequestStringMetaDataCallback} callback Node-style callback called with the error, if any, and PResult
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(Metadata.prototype.requestStringMetaData = function requestStringMetaData(request, callback) {
            return this.rpcCall(requestStringMetaData, $root.v1.PStringMetaData, $root.v1.PResult, request, callback);
        }, "name", { value: "RequestStringMetaData" });

        /**
         * Calls RequestStringMetaData.
         * @function requestStringMetaData
         * @memberof v1.Metadata
         * @instance
         * @param {v1.IPStringMetaData} request PStringMetaData message or plain object
         * @returns {Promise<v1.PResult>} Promise
         * @variation 2
         */

        return Metadata;
    })();

    v1.Stat = (function() {

        /**
         * Constructs a new Stat service.
         * @memberof v1
         * @classdesc Represents a Stat
         * @extends $protobuf.rpc.Service
         * @constructor
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         */
        function Stat(rpcImpl, requestDelimited, responseDelimited) {
            $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
        }

        (Stat.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = Stat;

        /**
         * Creates new Stat service using the specified rpc implementation.
         * @function create
         * @memberof v1.Stat
         * @static
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         * @returns {Stat} RPC service. Useful where requests and/or responses are streamed.
         */
        Stat.create = function create(rpcImpl, requestDelimited, responseDelimited) {
            return new this(rpcImpl, requestDelimited, responseDelimited);
        };

        /**
         * Callback as used by {@link v1.Stat#sendAgentStat}.
         * @memberof v1.Stat
         * @typedef SendAgentStatCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {google.protobuf.Empty} [response] Empty
         */

        /**
         * Calls SendAgentStat.
         * @function sendAgentStat
         * @memberof v1.Stat
         * @instance
         * @param {v1.IPStatMessage} request PStatMessage message or plain object
         * @param {v1.Stat.SendAgentStatCallback} callback Node-style callback called with the error, if any, and Empty
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(Stat.prototype.sendAgentStat = function sendAgentStat(request, callback) {
            return this.rpcCall(sendAgentStat, $root.v1.PStatMessage, $root.google.protobuf.Empty, request, callback);
        }, "name", { value: "SendAgentStat" });

        /**
         * Calls SendAgentStat.
         * @function sendAgentStat
         * @memberof v1.Stat
         * @instance
         * @param {v1.IPStatMessage} request PStatMessage message or plain object
         * @returns {Promise<google.protobuf.Empty>} Promise
         * @variation 2
         */

        return Stat;
    })();

    v1.ProfilerCommandService = (function() {

        /**
         * Constructs a new ProfilerCommandService service.
         * @memberof v1
         * @classdesc Represents a ProfilerCommandService
         * @extends $protobuf.rpc.Service
         * @constructor
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         */
        function ProfilerCommandService(rpcImpl, requestDelimited, responseDelimited) {
            $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
        }

        (ProfilerCommandService.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = ProfilerCommandService;

        /**
         * Creates new ProfilerCommandService service using the specified rpc implementation.
         * @function create
         * @memberof v1.ProfilerCommandService
         * @static
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         * @returns {ProfilerCommandService} RPC service. Useful where requests and/or responses are streamed.
         */
        ProfilerCommandService.create = function create(rpcImpl, requestDelimited, responseDelimited) {
            return new this(rpcImpl, requestDelimited, responseDelimited);
        };

        /**
         * Callback as used by {@link v1.ProfilerCommandService#handleCommand}.
         * @memberof v1.ProfilerCommandService
         * @typedef HandleCommandCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {v1.PCmdRequest} [response] PCmdRequest
         */

        /**
         * Calls HandleCommand.
         * @function handleCommand
         * @memberof v1.ProfilerCommandService
         * @instance
         * @param {v1.IPCmdMessage} request PCmdMessage message or plain object
         * @param {v1.ProfilerCommandService.HandleCommandCallback} callback Node-style callback called with the error, if any, and PCmdRequest
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(ProfilerCommandService.prototype.handleCommand = function handleCommand(request, callback) {
            return this.rpcCall(handleCommand, $root.v1.PCmdMessage, $root.v1.PCmdRequest, request, callback);
        }, "name", { value: "HandleCommand" });

        /**
         * Calls HandleCommand.
         * @function handleCommand
         * @memberof v1.ProfilerCommandService
         * @instance
         * @param {v1.IPCmdMessage} request PCmdMessage message or plain object
         * @returns {Promise<v1.PCmdRequest>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link v1.ProfilerCommandService#commandEcho}.
         * @memberof v1.ProfilerCommandService
         * @typedef CommandEchoCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {google.protobuf.Empty} [response] Empty
         */

        /**
         * Calls CommandEcho.
         * @function commandEcho
         * @memberof v1.ProfilerCommandService
         * @instance
         * @param {v1.IPCmdEchoResponse} request PCmdEchoResponse message or plain object
         * @param {v1.ProfilerCommandService.CommandEchoCallback} callback Node-style callback called with the error, if any, and Empty
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(ProfilerCommandService.prototype.commandEcho = function commandEcho(request, callback) {
            return this.rpcCall(commandEcho, $root.v1.PCmdEchoResponse, $root.google.protobuf.Empty, request, callback);
        }, "name", { value: "CommandEcho" });

        /**
         * Calls CommandEcho.
         * @function commandEcho
         * @memberof v1.ProfilerCommandService
         * @instance
         * @param {v1.IPCmdEchoResponse} request PCmdEchoResponse message or plain object
         * @returns {Promise<google.protobuf.Empty>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link v1.ProfilerCommandService#commandStreamActiveThreadCount}.
         * @memberof v1.ProfilerCommandService
         * @typedef CommandStreamActiveThreadCountCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {google.protobuf.Empty} [response] Empty
         */

        /**
         * Calls CommandStreamActiveThreadCount.
         * @function commandStreamActiveThreadCount
         * @memberof v1.ProfilerCommandService
         * @instance
         * @param {v1.IPCmdActiveThreadCountRes} request PCmdActiveThreadCountRes message or plain object
         * @param {v1.ProfilerCommandService.CommandStreamActiveThreadCountCallback} callback Node-style callback called with the error, if any, and Empty
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(ProfilerCommandService.prototype.commandStreamActiveThreadCount = function commandStreamActiveThreadCount(request, callback) {
            return this.rpcCall(commandStreamActiveThreadCount, $root.v1.PCmdActiveThreadCountRes, $root.google.protobuf.Empty, request, callback);
        }, "name", { value: "CommandStreamActiveThreadCount" });

        /**
         * Calls CommandStreamActiveThreadCount.
         * @function commandStreamActiveThreadCount
         * @memberof v1.ProfilerCommandService
         * @instance
         * @param {v1.IPCmdActiveThreadCountRes} request PCmdActiveThreadCountRes message or plain object
         * @returns {Promise<google.protobuf.Empty>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link v1.ProfilerCommandService#commandActiveThreadDump}.
         * @memberof v1.ProfilerCommandService
         * @typedef CommandActiveThreadDumpCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {google.protobuf.Empty} [response] Empty
         */

        /**
         * Calls CommandActiveThreadDump.
         * @function commandActiveThreadDump
         * @memberof v1.ProfilerCommandService
         * @instance
         * @param {v1.IPCmdActiveThreadDumpRes} request PCmdActiveThreadDumpRes message or plain object
         * @param {v1.ProfilerCommandService.CommandActiveThreadDumpCallback} callback Node-style callback called with the error, if any, and Empty
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(ProfilerCommandService.prototype.commandActiveThreadDump = function commandActiveThreadDump(request, callback) {
            return this.rpcCall(commandActiveThreadDump, $root.v1.PCmdActiveThreadDumpRes, $root.google.protobuf.Empty, request, callback);
        }, "name", { value: "CommandActiveThreadDump" });

        /**
         * Calls CommandActiveThreadDump.
         * @function commandActiveThreadDump
         * @memberof v1.ProfilerCommandService
         * @instance
         * @param {v1.IPCmdActiveThreadDumpRes} request PCmdActiveThreadDumpRes message or plain object
         * @returns {Promise<google.protobuf.Empty>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link v1.ProfilerCommandService#commandActiveThreadLightDump}.
         * @memberof v1.ProfilerCommandService
         * @typedef CommandActiveThreadLightDumpCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {google.protobuf.Empty} [response] Empty
         */

        /**
         * Calls CommandActiveThreadLightDump.
         * @function commandActiveThreadLightDump
         * @memberof v1.ProfilerCommandService
         * @instance
         * @param {v1.IPCmdActiveThreadLightDumpRes} request PCmdActiveThreadLightDumpRes message or plain object
         * @param {v1.ProfilerCommandService.CommandActiveThreadLightDumpCallback} callback Node-style callback called with the error, if any, and Empty
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(ProfilerCommandService.prototype.commandActiveThreadLightDump = function commandActiveThreadLightDump(request, callback) {
            return this.rpcCall(commandActiveThreadLightDump, $root.v1.PCmdActiveThreadLightDumpRes, $root.google.protobuf.Empty, request, callback);
        }, "name", { value: "CommandActiveThreadLightDump" });

        /**
         * Calls CommandActiveThreadLightDump.
         * @function commandActiveThreadLightDump
         * @memberof v1.ProfilerCommandService
         * @instance
         * @param {v1.IPCmdActiveThreadLightDumpRes} request PCmdActiveThreadLightDumpRes message or plain object
         * @returns {Promise<google.protobuf.Empty>} Promise
         * @variation 2
         */

        return ProfilerCommandService;
    })();

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
