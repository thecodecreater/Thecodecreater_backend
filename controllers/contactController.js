const ContactMessage = require('../models/ContactMessage');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create a new contact message
// @route   POST /api/contact
// @access  Public
exports.createContactMessage = async (req, res, next) => {
  try {
    console.log('Received contact form submission:', req.body);
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      console.log('Validation failed - missing required fields');
      return next(new ErrorResponse('Please provide name, email, and message', 400));
    }

    // Create new message
    const newMessage = new ContactMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      subject: subject ? subject.trim() : 'General Inquiry',
      message: message.trim()
    });

    console.log('Saving to database...');
    await newMessage.save();
    console.log('Message saved successfully:', newMessage);

    res.status(201).json({
      success: true,
      data: newMessage,
      message: 'Thank you for your message. We will get back to you soon!'
    });
  } catch (error) {
    console.error('Error creating contact message:', error);
    next(error);
  }
};

// @desc    Get all contact messages (for admin)
// @route   GET /api/contact
// @access  Private/Admin
exports.getContactMessages = async (req, res, next) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await ContactMessage.countDocuments();

    // Query
    let query = ContactMessage.find().sort({ createdAt: -1 });
    
    // Pagination
    query = query.skip(startIndex).limit(limit);
    
    // Execute query
    const messages = await query;

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
      count: messages.length,
      pagination,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    next(error);
  }
};
