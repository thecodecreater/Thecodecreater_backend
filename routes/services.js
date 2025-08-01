const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const serviceCtrl = require('../controllers/serviceController');

router.get('/', serviceCtrl.getAll);
router.post('/', auth, serviceCtrl.create);
router.put('/:id', auth, serviceCtrl.update);
router.delete('/:id', auth, serviceCtrl.remove);

module.exports = router;
