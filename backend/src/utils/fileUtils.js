const fs = require('fs');
const path = require('path');

const createUploadsDir = () => {
  const uploadsPath = process.env.UPLOAD_PATH || './uploads';
  
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
    console.log(`📁 Created uploads directory: ${uploadsPath}`);
  }
};

const sanitizeFileName = (fileName) => {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
};

const getFileExtension = (fileName) => {
  return path.extname(fileName).toLowerCase();
};

const validateFileType = (fileName, allowedTypes) => {
  const extension = getFileExtension(fileName);
  return allowedTypes.includes(extension);
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const deleteFile = async (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

module.exports = {
  createUploadsDir,
  sanitizeFileName,
  getFileExtension,
  validateFileType,
  formatFileSize,
  deleteFile
};