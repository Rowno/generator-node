import { once } from 'lodash'
import app from './app'
import logger from './logger'
import { PORT } from './config'

const server = app.listen(PORT, () => {
  logger.info(`Listening at http://localhost:${PORT}`)
})

const gracefulShutdown = once((exitCode: number) => {
  logger.info('Server stopping...')

  server.close(() => {
    logger.info('Server stopped')
    // Leave time for logging / error capture
    setTimeout(() => process.exit(exitCode), 300)
  })

  // Forcibly shutdown after 8 seconds (Docker forcibly kills after 10 seconds)
  setTimeout(() => {
    logger.crit('Forcibly shutting down')
    // Leave time for logging / error capture
    setTimeout(() => process.exit(1), 300)
  }, 8000)
})

function handleUncaught(error: any, crashType: string): void {
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
