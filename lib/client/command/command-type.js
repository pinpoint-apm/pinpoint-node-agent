/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'
const cmdMessages = require('../../data/v1/Cmd_pb')

class CommandType {
    static ECHO = new CommandType('ECHO', cmdMessages.PCommandType.ECHO)
    static ACTIVE_THREAD_COUNT = new CommandType('ACTIVE_THREAD_COUNT', cmdMessages.PCommandType.ACTIVE_THREAD_COUNT)
    static supportedServices = [CommandType.ECHO, CommandType.ACTIVE_THREAD_COUNT]

    constructor(name, value) {
        this.name = name
        this.value = value
    }

    static supportedServicesCommandMessage() {
        const message = new cmdMessages.PCmdMessage()
        const command = new cmdMessages.PCmdServiceHandshake()

        CommandType.supportedServices.forEach(commandType => {
            command.addSupportcommandservicekey(commandType.value)
        })
        message.setHandshakemessage(command)
        return message
    }
}

module.exports = CommandType