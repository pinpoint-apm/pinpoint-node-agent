/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { MySqlContainer } = require("testcontainers")
const mysql = require('mysql')
const path = require('path')

const fixtures = path.resolve(__dirname, '..', '..', 'fixtures', 'db')
test(`MySql Query`, async (t) => {
    const source = path.resolve(fixtures, 'mysql.sql')
    const container = await new MySqlContainer('mysql:5.7.40')
        .withEnvironment({
            'MYSQL_DATABASE': 'test'
        })
        // .withCopyFilesToContainer([{
        //     source: source,
        //     target: '/docker-entrypoint-initdb.d/mysql.sql'
        // }])
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
    connection.query('SELECT DATABASE() as res', async function (error, results) {
        if (error) throw error
        t.equal(results[0].res, 'test', 'test database validation as res')

        connection.end()
        await container.stop()
        t.end()
    })
})