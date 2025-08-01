const express = require('express');
const router = express.Router();

const ProjectConsultation = require('../models/ProjectConsultation');

// Save project consultation form data
router.post('/', async (req, res) => {
  try {
    const { projectType, name, email, phone, company, budget, timeline, description } = req.body;
    
    if (!projectType || !name || !email || !budget || !timeline || !description) {
      return res.status(400).json({ message: 'Required fields missing' });
    }
    
    // Save to DB
    const saved = await ProjectConsultation.create({ 
      projectType, 
      name, 
      email, 
      phone, 
      company, 
      budget, 
      timeline, 
      description 
    });
    
    console.log('Project consultation (saved to DB):', saved);
    res.json({ message: 'Project consultation received' });
  } catch (err) {
    console.error('Error saving project consultation:', err);
    res.status(500).json({ message: 'Failed to save consultation', err: err.message });
  }
});

module.exports = router; 