'use strict'
const winston = require('winston')

const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
})
exports.logger = logger
