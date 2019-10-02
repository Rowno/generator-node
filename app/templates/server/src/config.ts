import { defaultTo } from 'lodash'

export const NODE_ENV = defaultTo(process.env.NODE_ENV, 'development')
export const PORT = parseInt(defaultTo(process.env.PORT, '3000'), 10)
export const LOG_LEVEL = NODE_ENV === 'test' ? 'crit' : defaultTo(process.env.LOG_LEVEL, 'debug')
