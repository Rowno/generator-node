'use strict';

var index = require('../index'),
    fs = require('fs');

describe('index', function () {
    it('.version should match package.json version', function () {
        var packageJson = fs.readFileSync(__dirname + '/../package.json', 'utf8');

        packageJson = JSON.parse(packageJson);
        index.version.should.equal(packageJson.version);
    });
});
