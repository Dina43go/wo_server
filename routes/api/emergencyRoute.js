const router = require('express').Router();
//hospital/emergency    	 /get and /put
const hospitalController = require('../../controllers/hospitalController')
router.get('/' , hospitalController.emergency).put('/' , hospitalController.emergency);

module.exports = router;