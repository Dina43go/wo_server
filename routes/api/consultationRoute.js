const router = require('express').Router();
//consultation/:id	/get	(Médecin , patient)
const consultationController = require('../../controllers/consultationController')
router.post('/' , consultationController.consultation);
router.get('/:id' , consultationController.consultation);

module.exports = router;