'use strict'
const app = require('./app')
const {logger} = require('./utils')

logger.info('Server starting...')
app.listen(3000, () => {
  logger.info('Server started at http://localhost:3000')
})
