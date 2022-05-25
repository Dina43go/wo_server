const router = require('express').Router();
//hopital/doctors		/get (Hospital) and /post
const hospitalController = require('../../controllers/hospitalController')
router.get('/' , hospitalController.doctor).post('/', hospitalController.doctor);

module.exports = router;