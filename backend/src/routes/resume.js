const express = require('express');
const { optionalAuth } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
const resumeService = require('../services/resumeService');
const fileService = require('../services/fileService');
const router = express.Router();

// Parse resume (upload or paste)
router.post('/parse', optionalAuth, uploadSingle, async (req, res) => {
  try {
    let resumeContent = '';

    if (req.file) {
      // Parse uploaded file
      resumeContent = await fileService.parseFile(req.file);
    } else if (req.body.latexContent) {
      // Use pasted LaTeX content
      resumeContent = req.body.latexContent;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Either upload a file or provide LaTeX content'
      });
    }

    const parsedData = await resumeService.parseResume(resumeContent);

    res.json({
      success: true,
      message: 'Resume parsed successfully',
      data: {
        originalContent: resumeContent,
        parsedData,
        fileName: req.file?.filename
      }
    });

  } catch (error) {
    console.error('Resume parsing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to parse resume'
    });
  }
});

// Optimize resume based on job description
router.post('/optimize', optionalAuth, async (req, res) => {
  try {
    const { resumeContent, jobDescription, optimizationOptions } = req.body;

    if (!resumeContent || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: 'Resume content and job description are required'
      });
    }

    const optimizedResume = await resumeService.optimizeResume({
      resumeContent,
      jobDescription,
      options: optimizationOptions || {}
    });

    res.json({
      success: true,
      message: 'Resume optimized successfully',
      data: optimizedResume
    });

  } catch (error) {
    console.error('Resume optimization error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to optimize resume'
    });
  }
});

// Generate resume from template
router.post('/generate', optionalAuth, async (req, res) => {
  try {
    const { template, personalInfo, sections } = req.body;

    if (!template || !personalInfo) {
      return res.status(400).json({
        success: false,
        message: 'Template and personal information are required'
      });
    }

    const generatedResume = await resumeService.generateFromTemplate({
      template,
      personalInfo,
      sections: sections || []
    });

    res.json({
      success: true,
      message: 'Resume generated successfully',
      data: generatedResume
    });

  } catch (error) {
    console.error('Resume generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate resume'
    });
  }
});

// Export resume to PDF/DOCX
router.post('/export', optionalAuth, async (req, res) => {
  try {
    const { resumeContent, format, companyName } = req.body;

    if (!resumeContent || !format) {
      return res.status(400).json({
        success: false,
        message: 'Resume content and export format are required'
      });
    }

    const exportedFile = await resumeService.exportResume({
      content: resumeContent,
      format,
      companyName
    });

    res.json({
      success: true,
      message: `Resume exported as ${format.toUpperCase()}`,
      data: {
        filePath: exportedFile.path,
        fileName: exportedFile.name,
        downloadUrl: `/uploads/${exportedFile.name}`
      }
    });

  } catch (error) {
    console.error('Resume export error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export resume'
    });
  }
});

// Get available templates
router.get('/templates', optionalAuth, async (req, res) => {
  try {
    const templates = await resumeService.getTemplates();

    res.json({
      success: true,
      message: 'Templates retrieved successfully',
      data: templates
    });

  } catch (error) {
    console.error('Templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve templates'
    });
  }
});

// Chat-like optimization suggestions
router.post('/chat-optimize', optionalAuth, async (req, res) => {
  try {
    const { message, resumeContent, jobDescription, conversationHistory } = req.body;

    const response = await resumeService.chatOptimization({
      message,
      resumeContent,
      jobDescription,
      history: conversationHistory || []
    });

    res.json({
      success: true,
      message: 'Chat response generated',
      data: response
    });

  } catch (error) {
    console.error('Chat optimization error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate chat response'
    });
  }
});

// Apply or reject a suggestion
router.post('/suggestion', optionalAuth, async (req, res) => {
  try {
    const { resumeContent, suggestion, action } = req.body;

    if (!resumeContent || !suggestion || !action) {
      return res.status(400).json({
        success: false,
        message: 'Resume content, suggestion, and action are required'
      });
    }

    const updatedContent = await resumeService.applySuggestion({
      resumeContent,
      suggestion,
      action
    });

    res.json({
      success: true,
      message: `Suggestion ${action}ed successfully`,
      data: {
        updatedContent
      }
    });

  } catch (error) {
    console.error('Suggestion handling error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to handle suggestion'
    });
  }
});

module.exports = router;