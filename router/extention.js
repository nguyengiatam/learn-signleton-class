const express = require('express');
const { writeLog } = require('../lib/logger');
const redispool = require('../database/redispool');

function handleError(_, res, error) {
    const level = error.level || 'error'
    const code = error.code || 500;
    const error_msg = error.msgReturn || "Có lỗi xảy ra. Vui lòng thử lại sau"
    const debug_msg = error.message || null
    const data_return = { error_code: 1, data: error.data || null, error_msg, debug_msg }
    if (level === 'error') {
        writeLog(error.message, error, level)
    }
    writeLog(`RETURN: ${JSON.stringify(data_return)}`, null, 'info')
    res.status(code).json(data_return)
}

function safety(callback, option = {}, validateToken = false,) {
    if (callback.constructor.name === 'AsyncFunction') {
        return async function (req, res, next) {
            res.pass = pass
            res.fail = fail
            try {
                function nextS(val) {
                    val ? next(val) : next()
                }
                req.dataOption = option
                await callback(req, res, nextS)
            } catch (err) {
                handleError(req, res, err)
            }
        }
    } else {
        return function (req, res, next) {
            res.pass = pass
            res.fail = fail
            try {
                function nextS(val) {
                    val ? next(val) : next()
                }
                req.dataOption = option
                callback(req, res, nextS)
            } catch (err) {
                handleError(req, res, err)
            }
        }
    }
}

function Router(...args) {
    const router = express.Router(...args);

    // router.useS = function (path, callbackList, option, validateToken) {
    //     const callbackSafetyList = []
    //     for (const callback of callbackList) {
    //         callbackSafetyList.push(safety(callback, option, validateToken))
    //     }
    //     path ? this.use(path, ...callbackSafetyList) : this.use(...callbackSafetyList)
    // }

    router.getS = function (path, callbackList, option, validateToken) {
        const callbackSafetyList = []
        for (const callback of callbackList) {
            callbackSafetyList.push(safety(callback, option, validateToken))
        }
        this.get(path, ...callbackSafetyList)
    }

    router.postS = function (path, callbackList, option, validateToken) {
        const callbackSafetyList = []
        for (const callback of callbackList) {
            callbackSafetyList.push(safety(callback, option, validateToken))
        }
        this.post(path, ...callbackSafetyList)
    }

    return router
}

function pass(data = {}, status = 200) {
    this.status(status).json({ error_code: 0, data, debug_msg: null })
    // writeLog(`RETURN: ${JSON.stringify(data)}`, null, 'info')
}

function fail(message = '', status = 400, data = {}) {
    const error = new Error()
    error.level = 'info'
    error.msgReturn = message
    error.code = status
    error.data = data
    throw error
}

function checkValues(valuelist = [], errNameList = [], errCode = []) {
    const error = new Error()
    for (let i = 0; i < valuelist.length; i++) {
        switch (true) {
            case !valuelist[i]:
                error.msgReturn = errNameList[i] || "Giá trị không hợp lệ. Vui lòng thử lại"
                error.code = errCode[i] || 400
                error.level = 'info'
                break;
            default:
                break;
        }
    }
    if (error.msgReturn) {
        throw error
    }
}

module.exports = {
    Router,
    checkValues
}