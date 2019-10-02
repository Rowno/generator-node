const path = require('path')
const fs = require('fs-extra')
const helpers = require('yeoman-test')
const execa = require('execa')

const GENERATOR_PATH = path.resolve(__dirname, '../app')

jest.setTimeout(60 * 1000)

test('should inject github user details', async () => {
  const dir = await helpers.run(GENERATOR_PATH).withPrompts({
    username: 'Rowno',
    type: 'module'
  })

  let pkg = await fs.readFile(path.join(dir, 'package.json'))
  pkg = JSON.parse(pkg)

  expect(pkg.author).toMatch('Roland')
})

test('module tests should pass', async () => {
  const dir = await helpers
    .run(GENERATOR_PATH)
    .withOptions({ skipInstall: false })
    .withPrompts({
      username: 'Rowno',
      type: 'module'
    })

  await expect(execa('yarn', ['build'], { cwd: dir })).resolves.toMatchObject({ exitCode: 0 })
  await expect(execa('yarn', ['lint'], { cwd: dir })).resolves.toMatchObject({ exitCode: 0 })
  await expect(execa('yarn', ['test'], { cwd: dir })).resolves.toMatchObject({ exitCode: 0 })
})

test('server tests should pass', async () => {
  const dir = await helpers
    .run(GENERATOR_PATH)
    .withOptions({ skipInstall: false })
    .withPrompts({
      username: 'Rowno',
      type: 'server'
    })

  await expect(execa('yarn', ['build'], { cwd: dir })).resolves.toMatchObject({ exitCode: 0 })
  await expect(execa('yarn', ['lint'], { cwd: dir })).resolves.toMatchObject({ exitCode: 0 })
  await expect(execa('yarn', ['test'], { cwd: dir })).resolves.toMatchObject({ exitCode: 0 })
})

test('react tests should pass', async () => {
  const dir = await helpers
    .run(GENERATOR_PATH)
    .withOptions({ skipInstall: false })
    .withPrompts({
      username: 'Rowno',
      type: 'react'
    })

  await expect(execa('yarn', ['build'], { cwd: dir })).resolves.toMatchObject({ exitCode: 0 })
  await expect(execa('yarn', ['lint'], { cwd: dir })).resolves.toMatchObject({ exitCode: 0 })
  await expect(execa('yarn', ['test'], { cwd: dir })).resolves.toMatchObject({ exitCode: 0 })
  await expect(execa('yarn', ['size-limit'], { cwd: dir })).resolves.toMatchObject({ exitCode: 0 })
})
