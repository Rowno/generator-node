import path from 'path'
import fs from 'mz/fs'
import test from 'ava'
import helpers from 'yeoman-test'
import execa from 'execa'

test('should create src directory for modules', async t => {
  const dir = await helpers.run(__dirname).withPrompts({
    username: 'Rowno',
    type: 'module'
  })

  t.true(await fs.exists(path.join(dir, 'src/index.js')))
  t.false(await fs.exists(path.join(dir, 'server/app.js')))
})

test('should create server directory for servers', async t => {
  const dir = await helpers.run(__dirname).withPrompts({
    username: 'Rowno',
    type: 'server'
  })

  t.false(await fs.exists(path.join(dir, 'src/index.js')))
  t.true(await fs.exists(path.join(dir, 'server/app.js')))
})

test('should inject github user details', async t => {
  const dir = await helpers.run(__dirname).withPrompts({
    username: 'Rowno',
    type: 'module'
  })

  let pkg = await fs.readFile(path.join(dir, 'package.json'))
  pkg = JSON.parse(pkg)

  t.true(pkg.author.includes('Roland'))
})

test.serial('module tests should pass', async t => {
  const dir = await helpers.run(__dirname)
    .withOptions({skipInstall: false})
    .withPrompts({
      username: 'Rowno',
      type: 'module'
    })

  await t.notThrows(execa('npm', ['test'], {cwd: dir}))
})

test.serial('server tests should pass', async t => {
  const dir = await helpers.run(__dirname)
    .withOptions({skipInstall: false})
    .withPrompts({
      username: 'Rowno',
      type: 'server'
    })

  await t.notThrows(execa('npm', ['test'], {cwd: dir}))
})
