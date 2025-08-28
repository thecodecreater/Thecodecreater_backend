const express = require('express');
const ProjectSubmission = require('../models/ProjectSubmission');
const router = express.Router();

// @route   POST /api/start-project-new
// @access  Public
router.post('/', async (req, res) => {
  console.log('=== New Project Submission (New Endpoint) ===');
  console.log('Request body:', req.body);
  
  try {
    const { name, email, phone, website, projectType, budget, message } = req.body;
    
    // Basic validation
    if (!name || !email || !projectType || !budget) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
        required: { name: !!name, email: !!email, projectType: !!projectType, budget: !!budget }
      });
    }

    // Create submission
    const submission = await ProjectSubmission.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : undefined,
      website: website ? website.trim() : undefined,
      projectType: projectType.trim(),
      budget: budget.trim(),
      message: message ? message.trim() : undefined
    });

    res.status(201).json({
      success: true,
      data: submission,
      message: 'Thank you for your submission! We will get back to you soon.'
    });
    
  } catch (error) {
    console.error('Error in project submission:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
