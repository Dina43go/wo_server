const router = require('express').Router();
//hopital/doctors		/get (Hospital) and /post
const hospitalController = require('../../controllers/hospitalController');

router.post('/', hospitalController.postDoctor);
router.get('/:id' , hospitalController.doctors);
router.post('/login', hospitalController.doctorsLogin);
router.post('/logout', hospitalController.doctorsLogout);

module.exports = router;