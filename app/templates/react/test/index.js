import test from 'ava'
import React from 'react'
import {shallow} from 'enzyme'
import Button from '../src'

test('renders a <button>', t => {
  const component = shallow(<Button>Test</Button>)

  t.true(component.is('button'))
  t.is(component.prop('href'), undefined)
  t.true(component.contains('Test'))
})

test('renders an <a>', t => {
  const component = shallow(<Button href="https://roland.codes">Test</Button>)

  t.true(component.is('a'))
  t.is(component.prop('href'), 'https://roland.codes')
  t.true(component.contains('Test'))
})
