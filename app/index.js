'use strict'
const path = require('path')
const ghUser = require('gh-user')
const Generator = require('yeoman-generator')
const moment = require('moment')
const globby = require('globby')

module.exports = class GeneratorNode extends Generator {
  async initializing() {
    const now = moment()
    this.data = {
      appname: path.basename(this.contextRoot),
      date: now.format('YYYY-MM-DD'),
      year: now.year()
    }
  }

  async prompting() {
    // Try to guess the user's github username
    let username
    try {
      username = await this.user.github.username()
    } catch (err) {}

    const options = await this.prompt([
      {
        type: 'input',
        name: 'username',
        message: `What's your GitHub username?`,
        default: username
      },
      {
        type: 'list',
        name: 'type',
        message: 'What type of project is this?',
        choices: [
          {name: 'React Component', value: 'react'},
          {name: 'Module', value: 'module'},
          {name: 'Server', value: 'server'}
        ],
        default: 'module'
      }
    ])

    try {
      const user = await ghUser(options.username)
      this.data.githubUser = options.username
      this.data.realname = user.name
      this.data.website = user.blog || user.html_url
    } catch (err) {
      throw new Error(`Couldn't fetch your GitHub profile: ${err.message}`)
    }

    this.data.type = options.type
  }

  async writing() {
    const templatesPath = path.join(__dirname, 'templates', this.data.type)
    this.sourceRoot(templatesPath)

    let files = await globby(templatesPath, {dot: true})
    // Convert back to relative paths
    files = files.map(file => path.relative(templatesPath, file))

    for (const file of files) {
      this.fs.copyTpl(
        this.templatePath(file),
        this.destinationPath(file.replace('~', '')),
        this.data
      )
    }
  }

  install() {
    if (this.data.type === 'react') {
      this.yarnInstall(['prop-types'])
      this.yarnInstall(
        [
          'ava',
          'babel-cli',
          'babel-core',
          'babel-eslint',
          'babel-preset-env',
          'babel-preset-react',
          'babel-preset-stage-0',
          'babel-register',
          'concurrently',
          'enzyme',
          'enzyme-adapter-react-16',
          'eslint-config-xo-react',
          'eslint-plugin-react',
          'react',
          'react-dom',
          'size-limit',
          'xo'
        ],
        {dev: true}
      )
    } else if (this.data.type === 'module') {
      this.yarnInstall(['ava', 'babel-eslint', 'xo'], {dev: true})
    } else if (this.data.type === 'server') {
      this.yarnInstall([
        'express',
        'helmet',
        'isomorphic-fetch',
        'lodash',
        'winston'
      ])
      this.yarnInstall(['ava', 'babel-eslint', 'nodemon', 'xo'], {dev: true})
    }
  }
}
