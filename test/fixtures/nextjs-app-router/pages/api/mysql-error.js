const mysql = require('mysql2/promise')

const handler = async function (req, res) {
  req['pinpoint.metric.uri-template'] = '/user/input/uri/mysql-error'
  const user = process.env.DB_USER || 'root'
  const password = process.env.DB_PASSWORD || 'password'
  const host = process.env.DB_HOST || 'localhost'
  const port = process.env.DB_PORT || 3306
  const connection = await mysql.createConnection(`mysql://${user}:${password}@${host}:${port}/test`)
  try {
    await connection.query('SELECT id FROM no_such_table')
    res.status(200).json({ ok: true })
  } catch (error) {
    res.status(500).json({ code: error.code })
  } finally {
    await connection.end()
  }
}

module.exports = handler
module.exports.default = handler
