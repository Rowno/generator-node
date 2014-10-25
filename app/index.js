'use strict';
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var moment = require('moment');
var GitHubApi = require('github');
var github = new GitHubApi({
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


var NodeGenerator = yeoman.generators.Base.extend({
    init: function () {
        var now = moment();
        this.day = now.format('DD');
        this.month = now.format('MM');
        this.year = now.format('YYYY');

        this.log(yosay('Atwood\'s Law!'));

        this.on('end', function () {
            if (!this.options['skip-install']) {
                this.npmInstall();
            }
        });
    },

    askForUsername: function () {
        var done = this.async();
        var prompts = [{
            name: 'githubUser',
            message: 'What\'s your GitHub username?'
        }];

        this.prompt(prompts, function (props) {
            githubUserInfo(props.githubUser, function (res) {
                /*jshint camelcase:false */
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
            done();
        }.bind(this));
    },

    files: function () {
        this.mkdir('doc');
        this.mkdir('example');
        this.mkdir('lib');
        this.mkdir('test');

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
        this.copy('jshintrc', '.jshintrc');
        this.copy('travis.yml', '.travis.yml');
    }
});

module.exports = NodeGenerator;
