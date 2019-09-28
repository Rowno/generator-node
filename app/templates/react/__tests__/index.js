import React from 'react'
import { shallow } from 'enzyme'
import Button from '../src'

test('renders a <button>', () => {
  const component = shallow(<Button>Test</Button>)

  expect(component.is('button')).toBeTruthy()
  expect(component.prop('href')).toBeUndefined()
  expect(component.contains('Test')).toBeTruthy()
})

test('renders an <a>', () => {
  const component = shallow(<Button href="https://roland.codes">Test</Button>)

  expect(component.is('a')).toBeTruthy()
  expect(component.prop('href')).toBe('https://roland.codes')
  expect(component.contains('Test')).toBeTruthy()
})
