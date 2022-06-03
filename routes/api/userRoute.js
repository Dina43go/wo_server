const router = require('express').Router();
//alerte
const usersControler = require('../../controllers/usersControler');

router.get('/' , usersControler.userInfo);

module.exports = router;