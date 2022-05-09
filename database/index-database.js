const db = require('../config/db.config');
const DataTypes = require("sequelize").DataTypes;
const fs = require('fs');


class Database{
    static init() {
        this.loadModels()
        this.createAssocitions()
    }

    static loadModels(){
        const modelsNameList = fs.readdirSync(`${__dirname}/models`).map(val => val.toLowerCase()).filter(val => /^.*.model.js$/.test(val))
        const modelList = modelsNameList.map(val => require(`${__dirname}/models/${val}`)(db, DataTypes))
        this.models = {}
        for (let i = 0; i < modelList.length; i++) {
            let modelName = modelsNameList[i].split('_').map(val => `${val.charAt(0).toUpperCase()}${val.slice(1)}`).join('').split('.').shift()
            this.models[modelName] = modelList[i]
        }
    }

    static createAssocitions(){
        for (const key in this.models) {
            if (this.models[key].associate) {
                this.models[key].associate(this.models)
            }
        }
    }
}

Database.init()

module.exports = Database.models