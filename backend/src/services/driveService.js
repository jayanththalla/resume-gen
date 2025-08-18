const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

class DriveService {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Set credentials if available
    if (process.env.GOOGLE_ACCESS_TOKEN) {
      this.oauth2Client.setCredentials({
        access_token: process.env.GOOGLE_ACCESS_TOKEN,
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
      });
    }

    this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
    this.resumeFolderName = 'Resume';
  }

  async uploadFile({ filePath, fileName, companyName }) {
    try {
      // Ensure Resume folder exists
      const folderId = await this.getOrCreateResumeFolder();

      // Generate final filename with company name
      const finalFileName = companyName 
        ? `${companyName}_${fileName}` 
        : fileName;

      const fileMetadata = {
        name: finalFileName,
        parents: [folderId]
      };

      const media = {
        mimeType: this.getMimeType(filePath),
        body: fs.createReadStream(filePath)
      };

      const response = await this.drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id,name,webViewLink,webContentLink'
      });

      // Make file shareable
      await this.drive.permissions.create({
        fileId: response.data.id,
        resource: {
          role: 'reader',
          type: 'anyone'
        }
      });

      return {
        fileId: response.data.id,
        fileName: response.data.name,
        webViewLink: response.data.webViewLink,
        webContentLink: response.data.webContentLink
      };

    } catch (error) {
      console.error('Drive upload error:', error);
      throw new Error('Failed to upload file to Google Drive');
    }
  }

  async getOrCreateResumeFolder() {
    try {
      // Check if Resume folder exists
      const response = await this.drive.files.list({
        q: `name='${this.resumeFolderName}' and mimeType='application/vnd.google-apps.folder'`,
        fields: 'files(id, name)'
      });

      if (response.data.files.length > 0) {
        return response.data.files[0].id;
      }

      // Create Resume folder if it doesn't exist
      return await this.createResumeFolder();

    } catch (error) {
      console.error('Folder check error:', error);
      throw new Error('Failed to access Resume folder');
    }
  }

  async createResumeFolder() {
    try {
      const fileMetadata = {
        name: this.resumeFolderName,
        mimeType: 'application/vnd.google-apps.folder'
      };

      const response = await this.drive.files.create({
        resource: fileMetadata,
        fields: 'id,name'
      });

      return response.data.id;

    } catch (error) {
      console.error('Folder creation error:', error);
      throw new Error('Failed to create Resume folder');
    }
  }

  async listResumeFiles() {
    try {
      const folderId = await this.getOrCreateResumeFolder();

      const response = await this.drive.files.list({
        q: `'${folderId}' in parents`,
        fields: 'files(id, name, createdTime, modifiedTime, size, webViewLink, webContentLink)',
        orderBy: 'modifiedTime desc'
      });

      return response.data.files.map(file => ({
        id: file.id,
        name: file.name,
        createdTime: file.createdTime,
        modifiedTime: file.modifiedTime,
        size: file.size,
        webViewLink: file.webViewLink,
        webContentLink: file.webContentLink
      }));

    } catch (error) {
      console.error('List files error:', error);
      throw new Error('Failed to list resume files');
    }
  }

  async deleteFile(fileId) {
    try {
      await this.drive.files.delete({
        fileId: fileId
      });

      return { success: true, message: 'File deleted successfully' };

    } catch (error) {
      console.error('File deletion error:', error);
      throw new Error('Failed to delete file');
    }
  }

  async getFileMetadata(fileId) {
    try {
      const response = await this.drive.files.get({
        fileId: fileId,
        fields: 'id, name, mimeType, size, createdTime, modifiedTime, webViewLink, webContentLink'
      });

      return response.data;

    } catch (error) {
      console.error('File metadata error:', error);
      throw new Error('Failed to get file metadata');
    }
  }

  getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.doc': 'application/msword',
      '.txt': 'text/plain',
      '.tex': 'application/x-tex'
    };

    return mimeTypes[ext] || 'application/octet-stream';
  }

  async getAuthUrl() {
    const scopes = [
      'https://www.googleapis.com/auth/drive.file'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes
    });
  }

  async getTokenFromCode(code) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);

      return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token
      };

    } catch (error) {
      console.error('Token exchange error:', error);
      throw new Error('Failed to exchange authorization code for tokens');
    }
  }
}

module.exports = new DriveService();