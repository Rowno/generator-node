'use strict'
const path = require('path')
const Github = require('@octokit/rest')
const Generator = require('yeoman-generator')
const moment = require('moment')

const github = new Github()

module.exports = class GeneratorNode extends Generator {
  async initializing() {
    const now = moment()
    this.data = {
      appname: path.basename(this.contextRoot),
      date: now.format('YYYY-MM-DD'),
      year: now.year()
    }

    try {
      const username = await this.user.github.username()
      const {data} = await github.users.getForUser({username})
      this.data.githubUser = username
      this.data.realname = data.name
      this.data.website = data.blog || data.html_url
    } catch (err) {
      throw new Error(`Could not fetch your GitHub profile.\n\n${err.message}`)
    }
  }

  async prompting() {
    const options = await this.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'What type of Node project is this?',
        choices: ['Module', 'Server'],
        filter: val => val.toLowerCase()
      }
    ])
    this.data.type = options.type
  }

  writing() {
    let files = ['.editorconfig', '.gitattributes']

    if (this.data.type === 'module') {
      files = files.concat([
        '.babelrc',
        ['gitignore-module', '.gitignore'],
        ['npmignore', '.npmignore'],
        '.travis.yml',
        'src/index.js',
        'src/index.test.js',
        'LICENSE',
        ['Makefile-module', 'Makefile'],
        ['package-module.json', 'package.json'],
        ['README-module.md', 'README.md']
      ])
    } else if (this.data.type === 'server') {
      files = files.concat([
        ['gitignore-server', '.gitignore'],
        '.nvmrc',
        'client/index.html',
        'server/app.js',
        'server/app.test.js',
        'server/boot.js',
        'server/utils.js',
        ['Makefile-server', 'Makefile'],
        ['package-server.json', 'package.json'],
        ['README-server.md', 'README.md']
      ])
    }

    files.forEach(file => {
      let src
      let dest

      if (Array.isArray(file)) {
        src = file[0]
        dest = file[1]
      } else {
        src = file
        dest = file
      }

      this.fs.copyTpl(
        this.templatePath(src),
        this.destinationPath(dest),
        this.data
      )
    })
  }

  install() {
    this.yarnInstall(['ava', 'husky', 'lint-staged', 'xo', 'babel-eslint'], {
      dev: true
    })

    if (this.data.type === 'module') {
      this.yarnInstall(['babel-cli', 'babel-preset-env', 'babel-register'], {
        dev: true
      })
    } else if (this.data.type === 'server') {
      this.yarnInstall(['express', 'helmet', 'isomorphic-fetch', 'winston'])
    }
  }
}
