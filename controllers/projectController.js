const ProjectSubmission = require('../models/ProjectSubmission');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create a new project submission
// @route   POST /api/project-submissions
// @access  Public
exports.createProjectSubmission = async (req, res, next) => {
  try {
    console.log('=== New Project Submission ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
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
      message: 'Project submitted successfully',
      data: newSubmission
    });
    
  } catch (error) {
    console.error('Error in createProjectSubmission:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
    next(error);
  }
};

// @desc    Get all project submissions (for admin)
// @route   GET /api/project-submissions
// @access  Private/Admin
exports.getProjectSubmissions = async (req, res, next) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await ProjectSubmission.countDocuments();

    // Build query
    let query = ProjectSubmission.find().sort({ createdAt: -1 });

    // Pagination
    query = query.skip(startIndex).limit(limit);

    // Execute query
    const submissions = await query;

    // Pagination result
    const pagination = {};
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: submissions.length,
      pagination,
      data: submissions
    });
  } catch (error) {
    console.error('Error getting project submissions:', error);
    next(error);
  }
};

// @desc    Update project submission status (for admin)
// @route   PUT /api/project-submissions/:id
// @access  Private/Admin
exports.updateProjectSubmission = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    
    const submission = await ProjectSubmission.findById(req.params.id);
    
    if (!submission) {
      return next(new ErrorResponse(`Project submission not found with id of ${req.params.id}`, 404));
    }

    // Update fields if they were sent
    if (status) submission.status = status;
    if (notes !== undefined) submission.notes = notes;

    await submission.save();

    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error) {
    console.error('Error updating project submission:', error);
    next(error);
  }
};
