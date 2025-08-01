const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');

// Get all FAQs
router.get('/', faqController.getAllFaqs);
// Get FAQ by ID
router.get('/:id', faqController.getFaqById);
// Create FAQ
router.post('/', faqController.createFaq);
// Update FAQ
router.put('/:id', faqController.updateFaq);
// Delete FAQ
router.delete('/:id', faqController.deleteFaq);

module.exports = router; 