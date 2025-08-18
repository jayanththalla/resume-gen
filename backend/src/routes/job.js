const express = require('express');
const Joi = require('joi');
const { optionalAuth } = require('../middleware/auth');
const aiService = require('../services/aiService');
const router = express.Router();

// Validation schema
const analyzeJobSchema = Joi.object({
  jobDescription: Joi.string().min(50).required(),
  companyName: Joi.string().optional(),
  jobTitle: Joi.string().optional(),
  requirements: Joi.array().items(Joi.string()).optional()
});

// Analyze job description
router.post('/analyze', optionalAuth, async (req, res) => {
  try {
    const { error, value } = analyzeJobSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { jobDescription, companyName, jobTitle, requirements } = value;

    // Extract keywords and requirements using AI
    const analysis = await aiService.analyzeJobDescription({
      jobDescription,
      companyName,
      jobTitle,
      requirements
    });

    res.json({
      success: true,
      message: 'Job description analyzed successfully',
      data: {
        keywords: analysis.keywords,
        requirements: analysis.requirements,
        skills: analysis.skills,
        experience: analysis.experience,
        education: analysis.education,
        companyInfo: analysis.companyInfo,
        jobInfo: analysis.jobInfo,
        atsScore: analysis.atsScore
      }
    });

  } catch (error) {
    console.error('Job analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze job description'
    });
  }
});

// Get job analysis suggestions
router.post('/suggestions', optionalAuth, async (req, res) => {
  try {
    const { jobDescription, resumeContent } = req.body;

    if (!jobDescription || !resumeContent) {
      return res.status(400).json({
        success: false,
        message: 'Job description and resume content are required'
      });
    }

    const suggestions = await aiService.getOptimizationSuggestions({
      jobDescription,
      resumeContent
    });

    res.json({
      success: true,
      message: 'Optimization suggestions generated',
      data: suggestions
    });

  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate suggestions'
    });
  }
});

// Extract company information
router.post('/company-info', optionalAuth, async (req, res) => {
  try {
    const { companyName, jobDescription } = req.body;

    if (!companyName) {
      return res.status(400).json({
        success: false,
        message: 'Company name is required'
      });
    }

    const companyInfo = await aiService.extractCompanyInfo({
      companyName,
      jobDescription
    });

    res.json({
      success: true,
      message: 'Company information extracted',
      data: companyInfo
    });

  } catch (error) {
    console.error('Company info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to extract company information'
    });
  }
});

module.exports = router;