'use strict'

exports.NODE_ENV = process.env.NODE_ENV || 'development'
exports.PORT = process.env.PORT || 3000
exports.LOG_LEVEL = exports.NODE_ENV === 'test' ? 'crit' : process.env.LOG_LEVEL || 'debug'
