'use strict';
var Url = require('url');

var internals = {
    domain: 'localhost'
};


exports.addDomain = function (url) {
    var parsedUrl = Url.parse(url);
    parsedUrl.host = null;
    parsedUrl.hostname = internals.domain;
    return Url.format(parsedUrl);
};
