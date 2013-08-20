'use strict';

module.exports = function (grunt) {
    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);


    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                '.jshintrc',
                'package.json',
                '**/*.js',
                '!node_modules/**/*'
            ]
        },
        mochacli: {
            options: {
                require: ['should']
            },
            all: []
        }
    });


    grunt.registerTask('test', ['jshint', 'mochacli']);
    grunt.registerTask('default', 'test');
};
