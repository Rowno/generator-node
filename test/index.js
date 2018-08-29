import path from 'path'
import fs from 'fs-extra'
import test from 'ava'
import helpers from 'yeoman-test'
import execa from 'execa'

const GENERATOR_PATH = path.resolve(__dirname, '../app')

test('should inject github user details', async t => {
  const dir = await helpers.run(GENERATOR_PATH).withPrompts({
    username: 'Rowno',
    type: 'module'
  })

  let pkg = await fs.readFile(path.join(dir, 'package.json'))
  pkg = JSON.parse(pkg)

  t.true(pkg.author.includes('Roland'))
})

test.serial('module tests should pass', async t => {
  const dir = await helpers
    .run(GENERATOR_PATH)
    .withOptions({skipInstall: false})
    .withPrompts({
      username: 'Rowno',
      type: 'module'
    })

  await t.notThrowsAsync(execa('yarn', ['test'], {cwd: dir}))
})

test.serial('server tests should pass', async t => {
  const dir = await helpers
    .run(GENERATOR_PATH)
    .withOptions({skipInstall: false})
    .withPrompts({
      username: 'Rowno',
      type: 'server'
    })

  await t.notThrowsAsync(execa('yarn', ['test'], {cwd: dir}))
})

test.serial('react tests should pass', async t => {
  const dir = await helpers
    .run(GENERATOR_PATH)
    .withOptions({skipInstall: false})
    .withPrompts({
      username: 'Rowno',
      type: 'react'
    })

  await t.notThrowsAsync(execa('yarn', ['test'], {cwd: dir}))
  await t.notThrowsAsync(execa('yarn', ['build'], {cwd: dir}))
  await t.notThrowsAsync(execa('yarn', ['size-limit'], {cwd: dir}))
})
