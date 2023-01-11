/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { MySqlContainer } = require("testcontainers")
const mysql = require('mysql')

test(`MySql Query`, async (t) => {
    const container = await new MySqlContainer('mysql:5.7.40')
        .withCopyFilesToContainer([{
            source: "./fixtures/mysql.sql",
            target: "/docker-entrypoint-initdb.d/mysql.sql"
        }])
        .start()

    const stream = await container.logs()
    stream
        .on("data", line => console.log(line))
        .on("err", line => console.error(line))
        .on("end", () => console.log("Stream closed"))

    const connection = mysql.createConnection({
        host: container.getHost(),
        port: container.getPort(),
        database: 'test',
        user: container.getUsername(),
        password: container.getUserPassword(),
    })
    connection.connect(function (err) {
        if (err) {
            console.error('error connecting: ' + err.stack)
            return
        }
        console.log('connected as id ' + connection.threadId)
    })
    connection.query('SELECT * FROM member', async function (error, results) {
        if (error) throw error
        t.equal(results[0].res, 1, 'rows SELECT 1 as res')

        connection.end()
        await container.stop()
        t.end()
    })
})