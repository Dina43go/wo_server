const router = require('express').Router();

//admin/dashboard-info	/get	(Admin)

const infoController = require('../../controllers/hospitalAdminController')
router.get('/' , infoController.info);

module.exports = router;