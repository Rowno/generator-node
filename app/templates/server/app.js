'use strict'
const path = require('path')
const express = require('express')
const helmet = require('helmet')
const {logger} = require('./utils')

const app = express()
app.set('trust proxy', true)

app.use(helmet())

app.use(express.static('client'))

app.use((req, res) => {
  res
    .status(404)
    .sendFile(path.join(__dirname, '../client/index.html'), err => {
      if (err) {
        logger.error(err)
        res.status(err.status).end()
      }
    })
})

module.exports = app
