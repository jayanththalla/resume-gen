const express = require('express');
const { optionalAuth } = require('../middleware/auth');
const driveService = require('../services/driveService');
const router = express.Router();

// Upload file to Google Drive
router.post('/upload', optionalAuth, async (req, res) => {
  try {
    const { filePath, fileName, companyName } = req.body;

    if (!filePath || !fileName) {
      return res.status(400).json({
        success: false,
        message: 'File path and name are required'
      });
    }

    const result = await driveService.uploadFile({
      filePath,
      fileName,
      companyName
    });

    res.json({
      success: true,
      message: 'File uploaded to Google Drive successfully',
      data: {
        fileId: result.fileId,
        webViewLink: result.webViewLink,
        webContentLink: result.webContentLink
      }
    });

  } catch (error) {
    console.error('Drive upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file to Google Drive'
    });
  }
});

// List files in Resume folder
router.get('/files', optionalAuth, async (req, res) => {
  try {
    const files = await driveService.listResumeFiles();

    res.json({
      success: true,
      message: 'Files retrieved successfully',
      data: files
    });

  } catch (error) {
    console.error('Drive files error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve files from Google Drive'
    });
  }
});

// Create Resume folder if it doesn't exist
router.post('/setup-folder', optionalAuth, async (req, res) => {
  try {
    const folder = await driveService.createResumeFolder();

    res.json({
      success: true,
      message: 'Resume folder created successfully',
      data: {
        folderId: folder.id,
        folderName: folder.name
      }
    });

  } catch (error) {
    console.error('Drive folder setup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to setup Resume folder'
    });
  }
});

// Delete file from Google Drive
router.delete('/files/:fileId', optionalAuth, async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: 'File ID is required'
      });
    }

    await driveService.deleteFile(fileId);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Drive file deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file from Google Drive'
    });
  }
});

// Get file metadata
router.get('/files/:fileId/metadata', optionalAuth, async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: 'File ID is required'
      });
    }

    const metadata = await driveService.getFileMetadata(fileId);

    res.json({
      success: true,
      message: 'File metadata retrieved successfully',
      data: metadata
    });

  } catch (error) {
    console.error('Drive metadata error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get file metadata'
    });
  }
});

module.exports = router;