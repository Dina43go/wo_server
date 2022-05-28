const router = require('express').Router();
//hospital/emergency    	 /get and /put
const hospitalController = require('../../controllers/hospitalController')

router.put('/' , hospitalController.setEmergency);
router.get('/:id' , hospitalController.emergency);

module.exports = router;