'use strict'
const winston = require('winston')

const logger = new winston.Logger({
  transports: [new winston.transports.Console()]
})
exports.logger = logger
