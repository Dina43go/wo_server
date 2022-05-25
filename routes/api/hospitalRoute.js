const router = require('express').Router();
//hospital			/get and /put
const hospitalController = require('../../controllers/hospitalController')
router.get('/',hospitalController.hospital).put('/',hospitalController.hospital);

module.exports = router;