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
test(`testcontainer docker-entrypoint-initdb.d learning test`, async (t) => {
    const source = path.resolve(fixtures, 'mysql.sql')
    const container = await new MySqlContainer()
        .withCommand(['--default-authentication-plugin=mysql_native_password'])
        .withEnvironment({
            'MYSQL_DATABASE': 'test'
        })
        .withCopyFilesToContainer([{
            source: source,
            target: '/docker-entrypoint-initdb.d/mysql.sql'
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

    connection.query('SELECT DATABASE() as res', async function (error, results) {
        if (error) throw error
        t.equal(results[0].res, 'test', 'SELECT DATABASE() as res')
    })
    connection.query(`SHOW TABLES`, async function (error, results) {
        if (error) throw error
        t.equal(results[0].Tables_in_test, 'member', 'SHOW TABLES')

        connection.end()
        await container.stop()
        t.end()
    })
})