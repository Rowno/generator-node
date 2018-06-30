'use strict'
const path = require('path')
const Github = require('@octokit/rest')
const Generator = require('yeoman-generator')
const moment = require('moment')
const globby = require('globby')

const github = new Github()

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
      const {data} = await github.users.getForUser({username: options.username})
      this.data.githubUser = options.username
      this.data.realname = data.name
      this.data.website = data.blog || data.html_url
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
      this.yarnInstall(['helmet', 'isomorphic-fetch', 'winston', 'express'])
      this.yarnInstall(['ava', 'babel-eslint', 'xo'], {dev: true})
    }
  }
}
