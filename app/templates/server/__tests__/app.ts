import got from 'got'
import { Server } from 'http'
import app from '../src/app'

let server: Server

beforeAll(done => {
  server = app.listen(3000, done)
})

afterAll(done => {
  server.close(done)
})

test('should return 200', async () => {
  const res = await got('http://localhost:3000', { throwHttpErrors: false })
  expect(res.statusCode).toBe(200)
})

test('should return 404', async () => {
  const res = await got('http://localhost:3000/404', { throwHttpErrors: false })
  expect(res.statusCode).toBe(404)
})
