'use strict';
var Github = require('github');
var Moment = require('moment');
var Slugify = require('underscore.string/slugify');
var Yeoman = require('yeoman-generator');


var github = new Github({
    version: '3.0.0'
});

function githubUserInfo(name, callback) {
    github.user.getFrom({
        user: name
    }, function (err, res) {
        if (err) {
            throw new Error('Could not fetch your GitHub profile. Make sure you typed it correctly.\n\n' + err.message);
        }
        callback(res);
    });
}


module.exports = Yeoman.generators.Base.extend({
    init: function () {
        var now = Moment();
        this.day = now.format('DD');
        this.month = now.format('MM');
        this.year = now.format('YYYY');
    },

    askForUsername: function () {
        var done = this.async();
        var prompts = [{
            name: 'githubUser',
            message: 'What\'s your GitHub username?',
            store: true
        }];

        this.prompt(prompts, function (props) {
            githubUserInfo(props.githubUser, function (res) {
                this.githubUser = res.login;
                this.realname = res.name;
                this.website = res.blog || res.html_url;
                done();
            }.bind(this));
        }.bind(this));
    },

    askForAppName: function () {
        var done = this.async();
        var prompts = [{
            name: 'appname',
            message: 'What\'s the name of your project?',
            default: this.appname
        }];

        this.prompt(prompts, function (props) {
            this.appname = props.appname;
            this.appnameSlug = Slugify(this.appname);
            done();
        }.bind(this));
    },

    files: function () {
        this.copy('lib/index.js', 'lib/index.js');
        this.copy('test/index.js', 'test/index.js');
        this.copy('test/eslintrc', 'test/.eslintrc');

        this.template('_CHANGELOG.md', 'CHANGELOG.md');
        this.template('_LICENSE', 'LICENSE');
        this.template('_package.json', 'package.json');
        this.template('_README.md', 'README.md');

        this.copy('editorconfig', '.editorconfig');
        this.copy('gitattributes', '.gitattributes');
        this.copy('gitignore', '.gitignore');
        this.copy('eslintrc', '.eslintrc');
        this.copy('travis.yml', '.travis.yml');
    },

    installDependencies: function () {
        this.npmInstall([
            'ava',
            'eslint',
            'eslint-config-rowno',
        ], { saveDev: true });
    }
});
