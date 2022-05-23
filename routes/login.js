// # constantes ...
const router = require('express').Router();
const loginController = require('../controllers/loginController')

router.route('/').get(loginController.login);

module.exports = router;