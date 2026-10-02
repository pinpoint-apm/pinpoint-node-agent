/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { randomBytes } = require('node:crypto')

// 16 bytes in URL-safe base64 without padding always yields 22 characters.
const UID_BASE64_LENGTH = 22

// RFC 9562 UUIDv7: 48-bit big-endian Unix epoch milliseconds, version 7, variant 0b10, the rest random.
function newUuidV7(now = Date.now()) {
    const bytes = randomBytes(16)
    bytes.writeUIntBE(now, 0, 6)
    bytes[6] = (bytes[6] & 0x0f) | 0x70
    bytes[8] = (bytes[8] & 0x3f) | 0x80
    return bytes
}

// Java Base64Utils.encode(UUID): msb/lsb big-endian bytes, RFC 4648 §5 URL-safe base64, no padding.
function encodeUid(bytes) {
    return Buffer.from(bytes).toString('base64url')
}

function newAgentId() {
    return encodeUid(newUuidV7())
}

module.exports = {
    UID_BASE64_LENGTH,
    newUuidV7,
    encodeUid,
    newAgentId
}
