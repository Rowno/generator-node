'use strict'
const url = require('url')

const DOMAIN = 'localhost'

exports.addDomain = inputUrl => {
  const parsedUrl = url.parse(inputUrl)
  parsedUrl.host = null
  parsedUrl.hostname = DOMAIN
  return url.format(parsedUrl)
}
