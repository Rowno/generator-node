const fetch = require('isomorphic-fetch')
const app = require('../src/app')

let server

beforeAll(done => {
  server = app.listen(3000, done)
})

afterAll(done => {
  server.close(done)
})

test('should return 200', async () => {
  const res = await fetch('http://localhost:3000')
  expect(res.status).toBe(200)
})

test('should return 404', async () => {
  const res = await fetch('http://localhost:3000/404')
  expect(res.status).toBe(404)
})
