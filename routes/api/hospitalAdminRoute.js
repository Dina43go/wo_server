const router = require('express').Router();

//admin/hospitals		/get (all hospitals) (Admin)

const hospitalAdminController = require('../../controllers/hospitalAdminController');

const code = require('../../config/roles').roleCode;
const checkRoles = require('../../middlewares/checkRoles');

router.get('/' , hospitalAdminController.getAllHospital)
      .post('/',hospitalAdminController.addHospital);

router.get('/:id',hospitalAdminController.getHospital);

module.exports = router;