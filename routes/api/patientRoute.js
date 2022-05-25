const router = require('express').Router();
//patient/:id		/get
const patientController = require('../../controllers/patientController')
router.get('/' , patientController.patient);

module.exports = router;