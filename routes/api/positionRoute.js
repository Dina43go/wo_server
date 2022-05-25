const router = require('express').Router();
//hospital/position		/put
const hospitalController = require('../../controllers/hospitalController')
router.put('/' , hospitalController.position);

module.exports = router;