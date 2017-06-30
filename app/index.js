'use strict'
const path = require('path')
const Github = require('github')
const Generator = require('yeoman-generator')
const moment = require('moment')

const github = new Github()

function githubUserInfo(username) {
  return github.users.getForUser({
    username
  }).catch(err => {
    throw new Error(`Could not fetch your GitHub profile. Make sure you typed it correctly.\n\n${err.message}`)
  })
}

module.exports = class extends Generator {
  initializing() {
    const now = moment()
    this.data = {
      appname: path.basename(this.contextRoot),
      date: now.format('YYYY-MM-DD'),
      year: now.year()
    }
  }

  prompting() {
    return this.prompt([{
      type: 'input',
      name: 'username',
      message: `What's your GitHub username?`,
      store: true
    }, {
      type: 'list',
      name: 'type',
      message: 'What type of Node project is this?',
      choices: ['Module', 'Server'],
      filter: val => val.toLowerCase()
    }]).then(({type, username}) => {
      this.data.type = type
      return githubUserInfo(username)
    }).then(({data}) => {
      this.data.githubUser = data.login
      this.data.realname = data.name
      this.data.website = data.blog || data.html_url
    })
  }

  writing() {
    let files = [
      '.editorconfig',
      '.gitattributes',
      ['gitignore', '.gitignore']
    ]

    if (this.data.type === 'module') {
      files = files.concat([
        ['npmignore', '.npmignore'],
        '.travis.yml',
        'lib/index.js',
        'lib/index.test.js',
        'LICENSE',
        ['Makefile-module', 'Makefile'],
        ['package-module.json', 'package.json'],
        ['README-module.md', 'README.md']
      ])
    } else if (this.data.type === 'server') {
      files = files.concat([
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
    this.yarnInstall(['ava', 'xo', 'lint-staged', 'husky'], {dev: true})

    if (this.data.type === 'server') {
      this.yarnInstall(['express', 'helmet', 'winston', 'isomorphic-fetch'])
    }
  }
}
