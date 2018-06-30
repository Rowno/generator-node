import test from 'ava'
import add from '../src'

test('adds domain to url', t => {
  t.is(add(2, 3), 5)
})
