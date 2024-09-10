/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'
const cmdMessages = require('../../data/v1/Cmd_pb')

class CommandType {
    static echo = new CommandType('ECHO', cmdMessages.PCommandType.ECHO)
    static activeThreadCount = new CommandType('ACTIVE_THREAD_COUNT', cmdMessages.PCommandType.ACTIVE_THREAD_COUNT)
    static none = new CommandType('NONE', cmdMessages.PCommandType.NONE)
    static supportedServices = [CommandType.echo, CommandType.activeThreadCount]

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

    static valueOf(command) {
        for (const commandType of CommandType.supportedServices) {
            if (commandType.value === command) {
                return commandType
            }
        }
        return CommandType.none
    }

    send(senders) {
        if (typeof senders[this.name] !== 'function') {
            return
        }

        senders[this.name]()
    }
}

module.exports = CommandType