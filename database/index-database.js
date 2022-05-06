const db = require('../config/db.config');
const DataTypes = require("sequelize").DataTypes;
const fs = require('fs');


class Database{
    static init() {
        this.loadModels()
        this.models.Film.findOne({where: {id: 70}}).then(val => console.log(val)).catch(err => console.log(err));
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
}

Database.init()

module.exports = Database