'use strict';
var expect = require('chai').expect;
var index = require('../lib/index');


describe('index', function () {
    describe('#addDomain', function () {
        it('adds domain to url', function () {
            var url = index.addDomain('http://127.0.0.1/test/');
            expect(url).to.equal('http://localhost/test/');
        });
    });
});
