const router = require('express').Router();
//patient/:id		/get
const patientController = require('../../controllers/patientController');

router.post('/' , patientController.newPatient);
router.get('/:id' , patientController.patient);

router.post('/:id/consultation' , patientController.addConsultation);
router.get('/:id/consultation' , patientController.consultation);

module.exports = router;