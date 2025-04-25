/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const mysql = require('mysql2/promise')

async function query(sql, values) {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    database: 'test',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    timezone: '+09:00',
  })

  const [results] = await connection.execute(sql, values)
  await connection.end()
  return results
}

module.exports = { query }