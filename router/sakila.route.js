const controller = require('../controller/sakila.controller');
const middleware = require('../middleware/sakila');
const router = require('./extention').Router()

// router.useS(middleware.authenticate)
router.getS('/film/:id', [middleware.authenticate, controller.getFilm])
router.getS('/film-by-actor', [controller.getFilmByActor])
router.postS('/film/create-new', [middleware.authenticate, controller.createFilm])

module.exports = router