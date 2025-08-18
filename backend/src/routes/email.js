const express = require('express');
const { optionalAuth } = require('../middleware/auth');
const emailService = require('../services/emailService');
const Joi = require('joi');
const router = express.Router();

// Validation schemas
const generateEmailSchema = Joi.object({
  jobDescription: Joi.string().required(),
  companyName: Joi.string().required(),
  personalInfo: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    experience: Joi.string().optional(),
    skills: Joi.array().items(Joi.string()).optional()
  }).required(),
  resumeHighlights: Joi.string().optional(),
  emailType: Joi.string().valid('application', 'follow-up', 'networking').default('application')
});

const sendEmailSchema = Joi.object({
  to: Joi.string().email().required(),
  subject: Joi.string().required(),
  body: Joi.string().required(),
  attachments: Joi.array().items(Joi.object({
    filename: Joi.string().required(),
    path: Joi.string().required()
  })).optional()
});

// Generate cold email
router.post('/generate', optionalAuth, async (req, res) => {
  try {
    const { error, value } = generateEmailSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const email = await emailService.generateColdEmail(value);

    res.json({
      success: true,
      message: 'Cold email generated successfully',
      data: email
    });

  } catch (error) {
    console.error('Email generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate cold email'
    });
  }
});

// Send email
router.post('/send', optionalAuth, async (req, res) => {
  try {
    const { error, value } = sendEmailSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const result = await emailService.sendEmail(value);

    res.json({
      success: true,
      message: 'Email sent successfully',
      data: {
        messageId: result.messageId,
        response: result.response
      }
    });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email'
    });
  }
});

// Get email templates
router.get('/templates', optionalAuth, async (req, res) => {
  try {
    const templates = await emailService.getEmailTemplates();

    res.json({
      success: true,
      message: 'Email templates retrieved successfully',
      data: templates
    });

  } catch (error) {
    console.error('Email templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve email templates'
    });
  }
});

// Generate follow-up email
router.post('/follow-up', optionalAuth, async (req, res) => {
  try {
    const { originalEmail, daysSinceApplication, companyName, personalInfo } = req.body;

    if (!originalEmail || !companyName || !personalInfo) {
      return res.status(400).json({
        success: false,
        message: 'Original email, company name, and personal info are required'
      });
    }

    const followUpEmail = await emailService.generateFollowUpEmail({
      originalEmail,
      daysSinceApplication: daysSinceApplication || 7,
      companyName,
      personalInfo
    });

    res.json({
      success: true,
      message: 'Follow-up email generated successfully',
      data: followUpEmail
    });

  } catch (error) {
    console.error('Follow-up email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate follow-up email'
    });
  }
});

// Analyze email effectiveness
router.post('/analyze', optionalAuth, async (req, res) => {
  try {
    const { subject, body, recipientInfo } = req.body;

    if (!subject || !body) {
      return res.status(400).json({
        success: false,
        message: 'Subject and body are required'
      });
    }

    const analysis = await emailService.analyzeEmailEffectiveness({
      subject,
      body,
      recipientInfo
    });

    res.json({
      success: true,
      message: 'Email analyzed successfully',
      data: analysis
    });

  } catch (error) {
    console.error('Email analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze email'
    });
  }
});

module.exports = router;