const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const testimonialCtrl = require('../controllers/testimonialController');

router.get('/', testimonialCtrl.getAll);
router.post('/', auth, testimonialCtrl.create);
router.put('/:id', auth, testimonialCtrl.update);
router.delete('/:id', auth, testimonialCtrl.remove);

module.exports = router;
