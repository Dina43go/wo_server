const router = require('express').Router();
//alerte
const alerteController = require('../../controllers/alerteController');

router.post('/' , alerteController.alerts); 

module.exports = router;