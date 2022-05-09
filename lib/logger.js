const winston = require('winston');
require('winston-daily-rotate-file');

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        // winston.format.colorize({
        //     level: true,
        //     colors: {
        //         debug: 'green'
        //     }
        // }),
        winston.format.errors({ stack: true }),
        winston.format.label({ label: 'Sakila Services' }),
        winston.format.timestamp({ format: 'HH:mm:ss DD-MM-YYYY' }),
        winston.format.printf(({ level, message, label, timestamp, stack }) => {
            if (stack) {
                return `${label} | ${timestamp} | [${level.toString().toUpperCase()}] : ${stack}`
            }
            return `${label} | ${timestamp} | [${level.toString().toUpperCase()}] : ${message}`
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

// winston.addColors({
//     error: 'red',
//     info: 'cyan',
//     debug: 'green',
//     warn: 'gold'
// })

function writeLog(message, level = 'info') {
    logger.log({ level, message })
}

module.exports = {
    writeLog
}