const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const blogCtrl = require('../controllers/blogController');

router.get('/', blogCtrl.getAll);
router.post('/', auth, blogCtrl.create);
router.put('/:id', auth, blogCtrl.update);
router.delete('/:id', auth, blogCtrl.remove);

module.exports = router;
