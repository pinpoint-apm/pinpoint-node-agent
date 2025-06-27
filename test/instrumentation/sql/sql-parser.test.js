/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const SqlParser = require('../../../lib/instrumentation/sql/sql-parser')

test(`normalized`, async (t) => {
    let normalizedSql = SqlParser.normalizedSql(`select * from table a = 1 and b=50 and c=? and d='11'`)
    // t.equal(normalizedSql.normalizedSql, `select * from table a = 0# and b=1# and c=? and d='2$'`)
    t.equal(normalizedSql.parseParameter, `1,50,11`)

    normalizedSql = SqlParser.normalizedSql(`-- comment`)
    t.equal(normalizedSql.normalizedSql, `-- comment`)

    normalizedSql = SqlParser.normalizedSql(`-`)
    t.equal(normalizedSql.normalizedSql, `-`)

    normalizedSql = SqlParser.normalizedSql(`select * from table a = 1 and b=50 and c=? and d='11'`)
    t.equal(normalizedSql.normalizedSql, `select * from table a = 0# and b=1# and c=? and d='2$'`)
    t.equal(normalizedSql.parseParameter, `1,50,11`)

    normalizedSql = SqlParser.normalizedSql(`select * from table a = -1 and b=-50 and c=? and d='-11'`)
    t.equal(normalizedSql.normalizedSql, `select * from table a = -0# and b=-1# and c=? and d='2$'`)
    t.equal(normalizedSql.parseParameter, `1,50,-11`)

    normalizedSql = SqlParser.normalizedSql(`select * from table a = +1 and b=+50 and c=? and d='+11'`)
    t.equal(normalizedSql.normalizedSql, `select * from table a = +0# and b=+1# and c=? and d='2$'`)
    t.equal(normalizedSql.parseParameter, `1,50,+11`)

    normalizedSql = SqlParser.normalizedSql(`select * from table a = 1/*test*/ and b=50/*test*/ and c=? and d='11'`)
    t.equal(normalizedSql.normalizedSql, `select * from table a = 0#/*test*/ and b=1#/*test*/ and c=? and d='2$'`)
    t.equal(normalizedSql.parseParameter, `1,50,11`)

    normalizedSql = SqlParser.normalizedSql(`select a.ZIPCODE,a.CITY from ZIPCODE as a`)
    t.equal(normalizedSql.normalizedSql, `select a.ZIPCODE,a.CITY from ZIPCODE as a`)
    t.equal(normalizedSql.parseParameter, ``)

    normalizedSql = SqlParser.normalizedSql(`select ZIPCODE,123 from ZIPCODE`)
    t.equal(normalizedSql.normalizedSql, `select ZIPCODE,0# from ZIPCODE`)
    t.equal(normalizedSql.parseParameter, `123`)

    normalizedSql = SqlParser.normalizedSql(`select ZIPCODE,123.123 from ZIPCODE`)
    t.equal(normalizedSql.normalizedSql, `select ZIPCODE,0# from ZIPCODE`)
    t.equal(normalizedSql.parseParameter, `123.123`)

    normalizedSql = SqlParser.normalizedSql(`SELECT * from table a=123 and b='abc' and c=1-3`)
    t.equal(normalizedSql.normalizedSql, `SELECT * from table a=0# and b='1$' and c=2#-3#`)
    t.equal(normalizedSql.parseParameter, `123,abc,1,3`)

    normalizedSql = SqlParser.normalizedSql(`SELECT * FROM member WHERE id = $1`)
    t.equal(normalizedSql.normalizedSql, `SELECT * FROM member WHERE id = $1`, `PostgreSQL positional parameter no changes 'SELECT * FROM member WHERE id = $1'`)
    t.equal(normalizedSql.parseParameter, ``, `PostgreSQL positional parameter parseParameter is empty 'SELECT * FROM member WHERE id = $1'`)

    normalizedSql = SqlParser.normalizedSql(`SELECT * FROM member WHERE id = $122309`)
    t.equal(normalizedSql.normalizedSql, `SELECT * FROM member WHERE id = $122309`, `PostgreSQL positional parameter no changes 'SELECT * FROM member WHERE id = $122309'`)
    t.equal(normalizedSql.parseParameter, ``, `PostgreSQL positional parameter parseParameter is empty 'SELECT * FROM member WHERE id = $122309'`)
    t.end()
})
