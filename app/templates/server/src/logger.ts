import winston from 'winston'
import { LOG_LEVEL } from './config'

export default winston.createLogger({
  level: LOG_LEVEL,
  levels: winston.config.syslog.levels,
  transports: [new winston.transports.Console()]
})
