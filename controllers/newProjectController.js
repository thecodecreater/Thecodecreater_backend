const NewProject = require('../models/NewProject');

// @desc    Create new project request
// @route   POST /api/v1/new-project
// @access  Public
exports.createNewProject = async (req, res) => {
  try {
    console.log('New project request received:', req.body);
    
    const { name, email, phone, website, projectType, budget, message } = req.body;
    
    // Basic validation
    if (!name || !email || !projectType || !budget) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
        required: { 
          name: !!name, 
          email: !!email, 
          projectType: !!projectType, 
          budget: !!budget 
        }
      });
    }
    
    // Create new project
    const project = await NewProject.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      website: website ? website.trim() : '',
      projectType: projectType.trim(),
      budget: budget.trim(),
      message: message ? message.trim() : ''
    });
    
    console.log('Project created successfully:', project);
    
    res.status(201).json({
      success: true,
      message: 'Project request submitted successfully!',
      data: project
    });
    
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
