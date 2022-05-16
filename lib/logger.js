const winston = require('winston');
require('winston-daily-rotate-file');

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.colorize({
            all: true,
            colors: {
                error: 'red',
                info: 'cyan',
                debug: 'green',
                warn: 'gold'
            }
        }),
        winston.format.errors({stack: true, code: true, errno: true}),
        winston.format.label({ label: 'Sakila Services' }),
        winston.format.timestamp({ format: 'HH:mm:ss DD-MM-YYYY' }),
        winston.format.printf((info) => {
            info.level = info.level.replace(/info/, 'INFO')
            info.level = info.level.replace(/error/, 'ERROR')
            info.level = info.level.replace(/warn/, 'WARN')
            info.level = info.level.replace(/debug/, 'DEBUG')
            if (info.stack) {
                return `${info.label} | ${info.timestamp} | [${info.level}] : ${info.stack}`
            }
            return `${info.label} | ${info.timestamp} | [${info.level}] : ${info.message}`
        }),
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
            dirname: `${__dirname}/../logs/default`,
            filename: `sakila-%DATE%.log`,
            datePattern: "DD-MM-YYYY",
            prepend: true,
            json: false
        })
    ],
    exitOnError: false
})

function writeLog(message, error = {}, level = 'debug') {
    logger[level](message, error)
}

module.exports = {
    writeLog
}