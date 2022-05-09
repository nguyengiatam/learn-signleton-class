const router = require('express').Router();
const controller = require('../controller/sakila.controller');
const middleware = require('../middleware/handle-error');

router.get('/film/:id', controller.getFilm)
router.use(middleware.handleError)

module.exports = router