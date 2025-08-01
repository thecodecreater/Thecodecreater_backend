const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const portfolioCtrl = require('../controllers/portfolioController');

router.get('/', portfolioCtrl.getAll);
router.post('/', auth, portfolioCtrl.create);
router.put('/:id', auth, portfolioCtrl.update);
router.delete('/:id', auth, portfolioCtrl.remove);

module.exports = router;
