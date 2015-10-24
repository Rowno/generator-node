'use strict';
var GitHubApi = require('github');
var Moment = require('moment');
var Slugify = require('underscore.string/slugify');
var Yeoman = require('yeoman-generator');
var Yosay = require('yosay');

var internals = {};
internals.github = new GitHubApi({
    version: '3.0.0'
});

internals.githubUserInfo = function (name, callback) {
    internals.github.user.getFrom({
        user: name
    }, function (err, res) {
        if (err) {
            throw new Error('Could not fetch your GitHub profile. Make sure you typed it correctly.\n\n' + err.message);
        }
        callback(res);
    });
};


module.exports = Yeoman.generators.Base.extend({
    init: function () {
        var now = Moment();
        this.day = now.format('DD');
        this.month = now.format('MM');
        this.year = now.format('YYYY');

        this.log(Yosay('Any application that can be written in JavaScript, will eventually be written in JavaScript.'));
    },

    askForUsername: function () {
        var done = this.async();
        var prompts = [{
            name: 'githubUser',
            message: 'What\'s your GitHub username?',
            store: true
        }];

        this.prompt(prompts, function (props) {
            internals.githubUserInfo(props.githubUser, function (res) {
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

        this.template('_CHANGELOG.md', 'CHANGELOG.md');
        this.template('_LICENSE', 'LICENSE');
        this.template('_package.json', 'package.json');
        this.template('_README.md', 'README.md');

        this.copy('editorconfig', '.editorconfig');
        this.copy('gitattributes', '.gitattributes');
        this.copy('gitignore', '.gitignore');
        this.copy('Gruntfile.js', 'Gruntfile.js');
        this.copy('eslintrc', '.eslintrc');
        this.copy('travis.yml', '.travis.yml');
    },

    installDependencies: function () {
        this.npmInstall([
            'chai',
            'eslint-config-rowno',
            'grunt-eslint',
            'grunt-mocha-cli',
            'grunt',
            'load-grunt-tasks',
            'time-grunt'
        ], { saveDev: true });
    }
});
