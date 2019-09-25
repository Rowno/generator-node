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
    } catch (error) {}

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
    } catch (error) {
      throw new Error(`Couldn't fetch your GitHub profile: ${error.message}`)
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
    // Extend package.json with a specific ava version for babel 7 compatibility
    this.fs.extendJSON(this.destinationPath('package.json'), {
      devDependencies: {
        ava: '1.0.0-beta.8'
      }
    })

    if (this.data.type === 'react') {
      this.yarnInstall(['prop-types'])
      this.yarnInstall(
        [
          '@babel/cli',
          '@babel/core',
          '@babel/plugin-proposal-class-properties',
          '@babel/preset-env',
          '@babel/preset-react',
          '@babel/register',
          'babel-eslint',
          'concurrently',
          'enzyme',
          'enzyme-adapter-react-16',
          'eslint-config-xo-react',
          'eslint-plugin-react',
          'eslint-plugin-react-hooks',
          'react',
          'react-dom',
          '@size-limit/preset-small-lib',
          'xo'
        ],
        {dev: true}
      )
    } else if (this.data.type === 'module') {
      this.yarnInstall(['babel-eslint', 'xo'], {dev: true})
    } else if (this.data.type === 'server') {
      this.yarnInstall([
        'express',
        'helmet',
        'isomorphic-fetch',
        'lodash',
        'winston'
      ])
      this.yarnInstall(['babel-eslint', 'nodemon', 'xo'], {dev: true})
    }
  }
}
