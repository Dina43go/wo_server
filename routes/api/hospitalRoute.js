const router = require('express').Router();
//hospital			/get and /put
const hospitalController = require('../../controllers/hospitalController')

router.put('/',hospitalController.updatePassword);
router.get('/:id',hospitalController.hospitalProfilInfo)


module.exports = router;