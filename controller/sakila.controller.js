const models = require('../database/index-database');
const sakilaController = {}

sakilaController.getFilm = async (req, res, next) => {
    try {
        const filmId = req.params.id;
        checkValues([filmId], ['film id incorrect'], [400])
        const film = await models.Film.findByPk(filmId, { raw: true })
        checkValues([film], ['film not exist'], [404])
        res.status(200).json(film)
    } catch (error) {
        next(error);
    }

}

function checkValues(valuelist = [], errNameList = [], errCode = []) {
    let errorObj = {}
    for (let i = 0; i < valuelist.length; i++) {
        switch (true) {
            case !valuelist[i]:
                errorObj.msgReturn = errNameList[i] || "Giá trị không hợp lệ. Vui lòng thử lại"
                errorObj.code = errCode[i] || 400
                errorObj.level = 'info'
                break;
            default:
                break;
        }
    }

    if(errorObj.msgReturn){
        const error = {...new Error(), ...errorObj}
        throw error
    }
}

module.exports = sakilaController