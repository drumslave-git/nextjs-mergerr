import winston from "winston"
const { combine, timestamp, printf } = winston.format

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`
})

const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp(), myFormat),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: './config/logs.log',
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: './config/exceptions.log' })
  ]
})

export { logger }