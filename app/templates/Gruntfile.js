'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);


    grunt.initConfig({
        eslint: {
            all: [
                '**/*.js',
                '!node_modules/**/*'
            ]
        },
        mochacli: {
            all: []
        }
    });


    grunt.registerTask('test', ['mochacli', 'eslint']);
    grunt.registerTask('default', 'test');
};
