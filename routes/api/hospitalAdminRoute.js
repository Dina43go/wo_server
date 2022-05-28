const router = require('express').Router();

//admin/hospitals		/get (all hospitals) (Admin)

const hospitalAdminController = require('../../controllers/hospitalAdminController')
router.get('/' , hospitalAdminController.getAllHospital)
      .post('/',hospitalAdminController.addHospital);

router.get('/:id',hospitalAdminController.getHospital);

module.exports = router;