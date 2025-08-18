# ATS Resume & Outreach Assistant Backend

A comprehensive Node.js backend API for the ATS Resume & Outreach Assistant application. This service provides AI-powered resume optimization, job description analysis, cold email generation, and Google Drive integration.

## Features

- **Resume Processing**: Parse LaTeX, DOCX, PDF, and plain text resumes
- **AI-Powered Optimization**: OpenAI integration for resume analysis and improvement
- **Job Description Analysis**: Extract keywords and requirements from job postings
- **Cold Email Generation**: Create personalized outreach emails
- **Google Drive Integration**: Auto-upload resumes to organized folders
- **Gmail Integration**: Send cold emails with attachments
- **Multiple Resume Templates**: Classic, Modern, Technical, and Creative templates
- **File Export**: Generate PDF and DOCX files
- **Chat Interface**: Interactive resume optimization assistance

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Start Production Server**
   ```bash
   npm start
   ```

## Environment Variables

### Required Configuration

```env
# Server
PORT=3000
NODE_ENV=development

# OpenAI (Required for AI features)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo

# Google Services (Required for Drive integration)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=your_redirect_uri

# Gmail (Required for email sending)
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_app_password

# JWT (Required for authentication)
JWT_SECRET=your_jwt_secret_key_here
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Resume Processing
- `POST /api/resume/parse` - Parse resume from file or text
- `POST /api/resume/optimize` - Optimize resume based on job description
- `POST /api/resume/generate` - Generate resume from template
- `POST /api/resume/export` - Export resume to PDF/DOCX
- `GET /api/resume/templates` - Get available templates
- `POST /api/resume/chat-optimize` - Interactive optimization chat

### Job Analysis
- `POST /api/job/analyze` - Analyze job description
- `POST /api/job/suggestions` - Get optimization suggestions
- `POST /api/job/company-info` - Extract company information

### Email Services
- `POST /api/email/generate` - Generate cold email
- `POST /api/email/send` - Send email with attachments
- `POST /api/email/follow-up` - Generate follow-up email
- `POST /api/email/analyze` - Analyze email effectiveness
- `GET /api/email/templates` - Get email templates

### Google Drive
- `POST /api/drive/upload` - Upload file to Drive
- `GET /api/drive/files` - List resume files
- `POST /api/drive/setup-folder` - Create Resume folder
- `DELETE /api/drive/files/:fileId` - Delete file
- `GET /api/drive/files/:fileId/metadata` - Get file metadata

## API Usage Examples

### Resume Optimization
```javascript
// Parse and optimize resume
const response = await fetch('/api/resume/optimize', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: JSON.stringify({
    resumeContent: 'LaTeX or plain text resume...',
    jobDescription: 'Job description text...',
    optimizationOptions: {
      autoApply: true,
      focusAreas: ['keywords', 'skills', 'experience']
    }
  })
});

const result = await response.json();
```

### Generate Cold Email
```javascript
// Generate personalized cold email
const response = await fetch('/api/email/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    jobDescription: 'Job posting text...',
    companyName: 'Company Name',
    personalInfo: {
      name: 'Your Name',
      email: 'your@email.com',
      experience: 'Brief experience summary',
      skills: ['skill1', 'skill2']
    },
    resumeHighlights: 'Key resume points...',
    emailType: 'application'
  })
});

const email = await response.json();
```

### Upload to Google Drive
```javascript
// Upload resume to Google Drive
const response = await fetch('/api/drive/upload', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    filePath: '/path/to/resume.pdf',
    fileName: 'resume.pdf',
    companyName: 'CompanyName'
  })
});

const driveResult = await response.json();
```

## Resume Templates

The system includes four professional templates:

1. **Classic Professional** - Traditional format for all industries
2. **Modern Professional** - Contemporary design with clean typography
3. **Technical Expert** - Optimized for software engineers
4. **Creative Professional** - Unique design for creative roles

## Security Features

- JWT-based authentication
- Rate limiting (100 requests per 15 minutes)
- Helmet.js security headers
- CORS configuration
- File upload validation
- Input sanitization with Joi

## File Processing

Supported file formats:
- **Input**: PDF, DOCX, TXT, TEX files
- **Output**: PDF, DOCX files
- **Upload Limit**: 10MB per file

## Error Handling

The API provides comprehensive error handling with:
- Structured error responses
- HTTP status codes
- Development vs production error details
- Request validation
- File upload error handling

## Development

### Project Structure
```
src/
├── app.js              # Express app configuration
├── server.js           # Server startup
├── routes/            # API route handlers
├── services/          # Business logic services
├── middleware/        # Custom middleware
├── templates/         # Resume templates
└── utils/            # Utility functions
```

### Adding New Templates

1. Create template class in `src/templates/`
2. Implement `generate()` method
3. Add to template registry in `resumeService.js`
4. Test with different data structures

### Extending AI Features

1. Add new prompts to `aiService.js`
2. Create corresponding API endpoints
3. Update validation schemas
4. Test with various inputs

## Deployment

### Environment Setup
- Node.js 18+
- Environment variables configured
- Google Cloud credentials
- OpenAI API access

### Production Considerations
- Use process manager (PM2)
- Configure reverse proxy (nginx)
- Set up SSL certificates
- Monitor logs and performance
- Implement database for user data

## Support

For issues and questions:
1. Check environment variable configuration
2. Verify API credentials (OpenAI, Google)
3. Review server logs for errors
4. Test with provided examples

## License

ISC License - see LICENSE file for details.