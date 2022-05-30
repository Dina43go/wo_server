const router = require('express').Router();
//antecedents/:id	/get	(Médecin) and /put
const antecedentController = require('../../controllers/antecedentController');

router.put('/' , antecedentController.setAntecedent);
router.get('/:id' , antecedentController.antecedent);

module.exports = router; 