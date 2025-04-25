/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

let nextInstance

/**
 * @param {object} opts - Options for setting up the Next.js instance
 * @returns {Promise<{ fetch: Function, render: Function, destroy: Function }>}
 */
async function createNext(opts) {
  if (nextInstance) {
    throw new Error(`createNext called without destroying previous instance`)
  }

  const dir = opts.dir || process.cwd()

  // 1. check for .next directory
  const buildPath = path.join(dir, '.next')
  if (!fs.existsSync(buildPath)) {
    console.log('[createNext] .next not found, building...')
    await new Promise((resolve, reject) => {
      const build = spawn('node', ['node_modules/next/dist/bin/next', 'build'], {
        cwd: dir,
        env: process.env,
        stdio: 'inherit',
      })
      build.on('exit', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error('next build failed'))
        }
      })
    })
  } else {
    console.log('[createNext] .next found, skipping build')
  }

  // 2. next start server
  const port = opts.port || 3000
  const child = spawn('node', ['node_modules/next/dist/bin/next', 'start', '-p', String(port)], {
    cwd: dir,
    env: process.env,
    stdio: 'inherit',
  })

  // 3. wait for server to be ready
  const baseUrl = `http://localhost:${port}`

  const waitUntilReady = () => {
    return new Promise((resolve) => {
      const tryFetch = async () => {
        try {
          const res = await fetch(baseUrl)
          if (res.ok) {
            resolve()
          } else {
            setTimeout(tryFetch, 500)
          }
        } catch (err) {
          setTimeout(tryFetch, 500)
        }
      }
      tryFetch()
    })
  }

  await waitUntilReady()

  console.log(`[createNext] Next.js server started on ${baseUrl}`)

  // 4. nextInstance
  nextInstance = {
    fetch: (url, opts) => fetch(baseUrl + url, opts),
    render: async (url) => {
      const res = await fetch(baseUrl + url)
      return res.text()
    },
    destroy: () => {
      child.kill()
      nextInstance = undefined
    },
  }

  return nextInstance
}


/**
 * Tape-friendly next test setup
 * @param {object} options
 * @returns {{
 *   next: () => import('./types').NextInstance,
 *   setup: () => Promise<void>,
 *   teardown: () => Promise<void>
 * }}
 */
function nextTestSetup(options) {
  let localInstance

  async function setup() {
    localInstance = await createNext(options)
  }

  async function teardown() {
    await localInstance?.destroy()
    localInstance = undefined
  }

  function next() {
    if (!localInstance) {
      throw new Error(
        'next instance is not initialized yet. Did you call setup()?'
      )
    }
    return localInstance
  }

  return {
    next,
    setup,
    teardown,
  }
}

module.exports = {
  createNext,
  nextTestSetup,
}