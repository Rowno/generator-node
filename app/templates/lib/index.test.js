'use strict'
const test = require('ava')
const {add} = require('./index')

test('adds domain to url', t => {
  t.is(add(2, 3), 5)
})
