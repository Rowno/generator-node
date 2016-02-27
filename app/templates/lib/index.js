'use strict';
var url = require('url');

var DOMAIN = 'localhost';


exports.addDomain = function (inputUrl) {
    var parsedUrl = url.parse(inputUrl);
    parsedUrl.host = null;
    parsedUrl.hostname = DOMAIN;
    return url.format(parsedUrl);
};
