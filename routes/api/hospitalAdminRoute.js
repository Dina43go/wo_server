const router = require('express').Router();

//admin/hospitals		/get (all hospitals) (Admin)

const hospitalAdminController = require('../../controllers/hospitalAdminController')
router.get('/' , hospitalAdminController.hospitalAdmin).post('/',hospitalAdminController.hospitalAdmin);
router.get('/:id',hospitalAdminController.hospitalAdmin);

module.exports = router;