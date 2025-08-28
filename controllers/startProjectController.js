const ProjectSubmission = require('../models/ProjectSubmission');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create a new project submission
// @route   POST /api/start-project
// @access  Public
exports.submitProject = async (req, res, next) => {
  console.log('=== New Project Submission ===');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    // Log headers for debugging
    console.log('Request headers:', req.headers);
    
    const { name, email, phone, website, projectType, budget, message } = req.body;
    
    // Basic validation
    if (!name || !email || !projectType || !budget) {
      const errorMsg = 'Missing required fields. Required: name, email, projectType, budget';
      console.error('Validation error:', errorMsg);
      return res.status(400).json({
        success: false,
        error: errorMsg,
        receivedData: { name: !!name, email: !!email, projectType: !!projectType, budget: !!budget }
      });
    }

    console.log('Creating new project submission...');
    
    // Create submission
    const submissionData = {
      name: name.toString().trim(),
      email: email.toString().trim().toLowerCase(),
      projectType: projectType.toString().trim(),
      budget: budget.toString().trim(),
      status: 'new',
      ...(phone && { phone: phone.toString().trim() }),
      ...(website && { website: website.toString().trim() }),
      ...(message && { message: message.toString().trim() })
    };

    console.log('Processed submission data:', submissionData);
    
    const newSubmission = await ProjectSubmission.create(submissionData);
    console.log('Project submission created successfully:', newSubmission._id);
    
    // Send response with proper headers
    res.setHeader('Content-Type', 'application/json');
    return res.status(201).json({
      success: true,
      message: 'Thank you for your submission! We will get back to you soon.',
      submissionId: newSubmission._id
    });
    
  } catch (error) {
    console.error('Error in submitProject:', error);
    
    // Handle duplicate key error (e.g., duplicate email)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'A submission with this email already exists.'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        messages: messages
      });
    }
    
    // Generic error response
    res.status(500).json({
      success: false,
      error: 'Server error. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
