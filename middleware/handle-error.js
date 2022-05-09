const { writeLog } = require('../lib/logger');
const handleError = {}
handleError.handleError = (error, req, res, next) => {
    const level = error.level || 'error'
    const code = error.code || 500;
    const error_msg = error.msgReturn || "Có lỗi xảy ra. Vui lòng thử lại sau"
    const debug_msg = error.message || ""
    writeLog(error_msg, level)
    res.status(code).json({error_msg, debug_msg})
}
module.exports = handleError