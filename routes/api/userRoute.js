const router = require('express').Router();
//alerte
const usersControler = require('../../controllers/usersControler');

router.get('/' , usersControler.userInfo);
router.get('/carnet' , usersControler.userCarnet);

module.exports = router;