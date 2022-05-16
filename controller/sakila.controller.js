const models = require('../database/index-database');
const { writeLog } = require('../lib/logger');
const { checkValues } = require('../router/extention')
const redispool = require('../database/redispool');
const controller = {}

controller.getFilm = async (req, res) => {
    const filmId = req.params.id;
    checkValues([filmId], ['film id incorrect'], [400])
    const film = await models.Film.findByPk(filmId, { raw: true })
    writeLog(film)
    checkValues([film], ['film not exist'], [404])
    res.pass(film)
}

controller.createFilm = async (req, res) => {
    const filmInfo = {
        title: req.body.title,
        description: req.body.description,
        release: req.body.release,
        length: req.body.length,
        rental_rate: req.body.rental_rate,
        rental_duration: req.body.rental_duration,
        replacement_cost: req.body.replacement_cost,
        rating: req.body.rating,
        special_features: req.body.special_features,
        language_id: req.body.language_id
    }
    writeLog(filmInfo)
    checkValues([filmInfo.title, filmInfo.description, filmInfo.release, filmInfo.length, filmInfo.language_id], ['Invalid title', 'Invalid description', 'Invalid release', 'Invalid length', 'Invalid language id'])
    const film = await models.Film.create(filmInfo, { raw: true })
    res.pass(film)
}

controller.getFilmByActor = async function (req, res) {
    const first_name = req.query.first_name
    const last_name = req.query.last_name
    checkValues([first_name, last_name],['First name invalid', "Last name invalid"])
    const result = await models.FilmActor.findAll({
        asttributes: [],
        include: [
            {
                model: models.Film,
                as: "Film",
            },
            {
                asttributes: ['first_name', 'last_name'],
                model: models.Actor,
                as: "Actor",
                where: {
                    first_name: first_name,
                    last_name: last_name
                }
            }
        ],
        raw: true
    })
    res.pass(result)
}

module.exports = controller