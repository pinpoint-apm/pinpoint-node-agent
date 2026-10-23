/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

// Returns the type name V8 reports for a method called on a named function, such as express `router.process_params`.
// V8 reports `Function` on Node.js 22 and the function name on Node.js 24, so the test asks the runtime instead of the version.
function receiverTypeNameOfFunctionMethod(functionName) {
    const receiver = { [functionName]: function () {} }[functionName]
    receiver.method = function () {
        const originalPrepareStackTrace = Error.prepareStackTrace
        Error.prepareStackTrace = (_, callSites) => callSites
        const callSites = new Error().stack
        Error.prepareStackTrace = originalPrepareStackTrace
        return callSites[0].getTypeName()
    }
    return receiver.method()
}

module.exports = {
    receiverTypeNameOfFunctionMethod,
}
