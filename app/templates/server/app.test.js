'use strict'
const test = require('ava')
const fetch = require('isomorphic-fetch')
const app = require('./app')

let server

test.before.cb(t => {
  server = app.listen(3000, t.end)
})

test.after.cb(t => {
  server.close(t.end)
})

test('should return 200', async t => {
  const res = await fetch('http://localhost:3000')
  t.is(res.status, 200)
})

test('should return 404', async t => {
  const res = await fetch('http://localhost:3000/404')
  t.is(res.status, 404)
})
