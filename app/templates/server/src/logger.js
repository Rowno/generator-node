'use strict'
const winston = require('winston')
const { LOG_LEVEL } = require('./config')

module.exports = winston.createLogger({
  level: LOG_LEVEL,
  levels: winston.config.syslog.levels,
  transports: [new winston.transports.Console()]
})
