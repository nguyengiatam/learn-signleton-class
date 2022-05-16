const { writeLog } = require('../lib/logger');
const all = {}

all.writeLogApi = (req, res, next) => {
    writeLog(`${req.socket.remoteAddress} - - ${req.method} ${req.originalUrl}`, null,'info')
    next()
}

all.authenticate = (req, res, next) => {
    if (req.query.token == 1234) {
        return next()
    }
    res.fail("Permissions denied", 403)
}

module.exports = all