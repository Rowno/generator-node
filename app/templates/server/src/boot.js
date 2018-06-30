'use strict'
const {once} = require('lodash')
const app = require('./app')
const logger = require('./logger')
const {PORT} = require('./config')

const server = app.listen(PORT, err => {
  if (err) {
    throw err
  }
  logger.info(`Listening at http://localhost:${PORT}`)
})

const gracefulShutdown = once(exitCode => {
  logger.info('Server stopping...')

  server.close(() => {
    logger.info('Server stopped')
    // Leave time for logging / error capture
    setTimeout(() => process.exit(exitCode), 300) // eslint-disable-line unicorn/no-process-exit
  })

  // Forcibly shutdown after 8 seconds (Docker forcibly kills after 10 seconds)
  setTimeout(() => {
    logger.crit('Forcibly shutting down')
    // Leave time for logging / error capture
    setTimeout(() => process.exit(1), 300) // eslint-disable-line unicorn/no-process-exit
  }, 8000)
})

function handleUncaught(error, crashType) {
  error.crashType = crashType
  logger.crit('😱  Server crashed', error)
}

process.on('uncaughtException', error => {
  handleUncaught(error, 'uncaughtException')
  gracefulShutdown(1)
})
process.on('unhandledRejection', error => {
  handleUncaught(error, 'unhandledRejection')
  gracefulShutdown(1)
})

// Termination signal sent by Docker on stop
process.on('SIGTERM', () => gracefulShutdown(0))
// Interrupt signal sent by Ctrl+C
process.on('SIGINT', () => gracefulShutdown(0))
