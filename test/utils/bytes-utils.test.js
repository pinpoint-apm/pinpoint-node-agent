const test = require('tape')
const { log, fixture, util } = require('../test-helper')

const bytesUtils = require('utils/bytes-utils')

/*
 * bound 1->0
 * bound 2->128
 * bound 3->16384
 * bound 4->2097152
 * bound 5->268435456
 */
test('Should get length of 32bit size number', function (t) {
  t.plan(1)

  let exponent = 1
  while(exponent <= 28) {
    const val = Math.pow(2, exponent)
    log.info(val-1, bytesUtils.computeVar32Size(val-1))
    log.info(val, bytesUtils.computeVar32Size(val))
    exponent += 1
  }
  t.ok(exponent)
})

/*
 * bound 1->0
 * bound 2->128
 * bound 3->16384
 * bound 4->2097152
 * bound 5->268435456
 * bound 6->34359738368
 */
test('Should get length of 64bit size number', function (t) {
  t.plan(1)

  let val
  let exponent = 1
  while(true) {
    val = Math.pow(2, exponent)
    if (val > Number.MAX_SAFE_INTEGER) {
      break;
    }
    log.info(val-1, bytesUtils.computeVar64Size(val-1))
    log.info(val, bytesUtils.computeVar64Size(val))
    exponent += 1
  }
  t.ok(exponent)
})
