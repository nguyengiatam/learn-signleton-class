const Redis = require('redis');
const bluebird = require('bluebird');
const { writeLog } = require('../lib/logger');
require('../config/constant.global');

function delay(ms) {
    return new Promise(res => setTimeout(res, ms))
}

class RedisPool {
    static fixBug = 1
    static init(maxConnection) {
        this.pool = []
        for (let i = 0; i < maxConnection; i++) {
            const redis = Redis.createClient({
                port: 6379,
                host: 'localhost',
                maxConnection: 5,
                handleRedisError: true
            })
            bluebird.promisifyAll(redis)
            redis.connect().then(() => console.log('connected redis client'))
            this.pool.push(redis)
        }

        const pool = Redis.createClient()
        for (const key in pool) {
            if (typeof pool[key] === 'function' && !pool[key].name) {
                this[key] = async (...args) => {
                    const client = await this.getClient(false)
                    try {
                        const result = await client[key](...args)
                        this.release(client)
                        return result
                    } catch (error) {
                        this.release(client)
                        throw error
                    }
                }
            }
        }
        return this
    }

    static async command(key, ...args) {
        console.log('running command');
        const client = await this.getClient(false)
        try {
            const result = await client[key](...args)
            this.release(client)
            return result
        } catch (error) {
            this.release(client)
            writeLog(err)
            throw error
        }
    }

    static async getClient(autoRelease = true, msWaitStep = 1) {
        if (!this.pool) {
            this.init(MAX_CONNECTION)
        }
        while (!this.pool.length) {
            await delay(msWaitStep)
        }
        const client = this.pool.shift()
        if (autoRelease) {
            setTimeout(() => this.release(client), 5000)
        }
        return client
    }

    static release(client) {
        if (!this.pool) {
            throw new Error('Please call init method first')
        }

        if (!this.pool.includes(client)) {
            this.pool.push(client)
        }
    }
}

RedisPool.init(MAX_CONNECTION)

module.exports = RedisPool