const router = require('express').Router();
//alerte
const refreshTokenController = require('../../controllers/refreshTokenController');

router.get('/' , refreshTokenController.handleRefreshToken);

module.exports = router;