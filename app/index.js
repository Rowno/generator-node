'use strict'
const Github = require('github')
const moment = require('moment')
const Generator = require('yeoman-generator')

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
      appname: this.appname
    }
    this.data.day = now.format('DD')
    this.data.month = now.format('MM')
    this.data.year = now.format('YYYY')
  }

  prompting() {
    return this.prompt([{
      type: 'input',
      name: 'username',
      message: `What's your GitHub username?`,
      store: true
    }]).then(props => {
      return githubUserInfo(props.username)
    }).then(user => {
      this.data.githubUser = user.login
      this.data.realname = user.name
      this.data.website = user.blog || user.html_url
    })
  }

  writing() {
    [
      'lib/index.js',
      'test/index.js',
      '.editorconfig',
      '.gitattributes',
      '.gitignore',
      '.travis.yml',
      'CHANGELOG.md',
      'LICENSE',
      'package.json',
      'README.md'
    ].forEach(file => {
      this.fs.copyTpl(
        this.templatePath(file),
        this.destinationPath(file),
        this.data
      )
    })
  }

  install() {
    this.yarnInstall(['ava', 'xo'], {dev: true})
  }
}
