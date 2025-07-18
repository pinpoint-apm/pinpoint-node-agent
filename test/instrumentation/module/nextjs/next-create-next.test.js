/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
require('../../../support/agent-singleton-mock')
const { createNextLite } = require('../../../fixtures/create-next-lite')

// This test is for the Next.js app router feature, which is a new feature in Next.js 13+.
// But the agent needs to be able to handle both the app router and the pages router.
test.skip('Next.js Pinpoint Agent instrumentation test', async (t) => {
    const next = await createNextLite({
        dev: true,
        files: {
            'app/api/hello/route.js': `
                export const runtime = 'nodejs'

                export async function GET(req) {
                    return new Response(JSON.stringify({ message: 'Hello from app router' }), {
                    headers: { 'Content-Type': 'application/json' },
                    status: 200
                    })
                }
            `,
        },
    })

    await next.start()

    const res = await next.fetch('/api/hello')
    const json = await res.json()

    t.equal(res.status, 200, 'Response status is 200')
    t.deepEqual(json, { message: 'Hello from app router' })

    await next.stop()
    t.end()
})