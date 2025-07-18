/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const fs = require('fs')
const os = require('os')
const path = require('path')
const next = require('next')
const http = require('http')

function createNextLite({ files = {}, dev = false, conf = {} } = {}) {
  let app, server, port, tempDir

  return {
    async start() {
      process.env.NEXT_DISABLE_FILE_WATCHER = '1'

      tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'next-lite-'))

      const dirSet = new Set()
      for (const filename of Object.keys(files)) {
        const dir = path.dirname(filename)
        dirSet.add(dir)
      }
      for (const dir of dirSet) {
        await fs.promises.mkdir(path.join(tempDir, dir), { recursive: true })
      }

      for (const [filename, content] of Object.entries(files)) {
        const fullPath = path.join(tempDir, filename)
        await fs.promises.writeFile(fullPath, content, 'utf8')
      }

      const nodeModulesSrc = path.resolve('node_modules')
      const nodeModulesDest = path.join(tempDir, 'node_modules')
      try {
        await fs.promises.symlink(nodeModulesSrc, nodeModulesDest, 'dir')
      } catch (err) {
        if (err.code !== 'EEXIST') throw err
      }

      port = await getAvailablePort()
      app = next({ dev, dir: tempDir, conf })
      const handle = app.getRequestHandler()

      await app.prepare()
      server = http.createServer((req, res) => handle(req, res))
      await new Promise((resolve) => server.listen(port, resolve))
    },

    async stop() {
      if (server) {
        await app.close()
        await new Promise((resolve, reject) => {
          server.close((err) => {
            if (tempDir) {
              try {
                fs.rmSync(tempDir, { recursive: true, force: true })
              } catch (e) {
                return reject(e)
              }
            }
            if (err) return reject(err)
            resolve()
          })
        })
        server = null
      }
    },

    async fetch(pathname, init) {
      return fetch(`http://localhost:${port}${pathname}`, init)
    },

    get url() {
      return `http://localhost:${port}`
    },
  }
}

async function getAvailablePort() {
  const { default: getPort } = await import('get-port')
  return getPort()
}

module.exports = { createNextLite }