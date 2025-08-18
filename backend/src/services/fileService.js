const fs = require('fs').promises;
const path = require('path');
const mammoth = require('mammoth');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

class FileService {
  constructor() {
    this.uploadsDir = process.env.UPLOAD_PATH || './uploads';
  }

  async parseFile(file) {
    try {
      const filePath = file.path;
      const extension = path.extname(file.originalname).toLowerCase();

      switch (extension) {
        case '.pdf':
          return await this.parsePDF(filePath);
        case '.docx':
          return await this.parseDOCX(filePath);
        case '.doc':
          return await this.parseDOCX(filePath);
        case '.txt':
          return await this.parseTXT(filePath);
        case '.tex':
          return await this.parseTEX(filePath);
        default:
          throw new Error(`Unsupported file type: ${extension}`);
      }

    } catch (error) {
      console.error('File parsing error:', error);
      throw new Error('Failed to parse uploaded file');
    }
  }

  async parsePDF(filePath) {
    // For PDF parsing, you might want to use pdf-parse or similar
    // For now, we'll return a placeholder
    const content = await fs.readFile(filePath, 'utf8');
    return content;
  }

  async parseDOCX(filePath) {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } catch (error) {
      throw new Error('Failed to parse DOCX file');
    }
  }

  async parseTXT(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      return content;
    } catch (error) {
      throw new Error('Failed to parse TXT file');
    }
  }

  async parseTEX(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      return content;
    } catch (error) {
      throw new Error('Failed to parse TEX file');
    }
  }

  async generatePDF(latexContent, fileName) {
    try {
      // Create PDF from LaTeX content
      const pdfDoc = await PDFDocument.create();
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      
      // Convert LaTeX to plain text for PDF generation
      const plainText = this.latexToPlainText(latexContent);
      
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const fontSize = 12;
      
      // Split text into lines that fit the page
      const lines = this.splitTextToLines(plainText, width - 100, timesRomanFont, fontSize);
      
      let yPosition = height - 50;
      
      for (const line of lines) {
        if (yPosition < 50) {
          // Add new page if needed
          page = pdfDoc.addPage();
          yPosition = height - 50;
        }
        
        page.drawText(line, {
          x: 50,
          y: yPosition,
          size: fontSize,
          font: timesRomanFont,
          color: rgb(0, 0, 0)
        });
        
        yPosition -= fontSize + 2;
      }

      const pdfBytes = await pdfDoc.save();
      const outputPath = path.join(this.uploadsDir, fileName);
      
      await fs.writeFile(outputPath, pdfBytes);
      
      return outputPath;

    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  async generateDOCX(content, fileName) {
    try {
      // For DOCX generation, you might want to use docx or similar library
      // For now, we'll create a simple text file
      const plainText = this.latexToPlainText(content);
      const outputPath = path.join(this.uploadsDir, fileName.replace('.docx', '.txt'));
      
      await fs.writeFile(outputPath, plainText, 'utf8');
      
      return outputPath;

    } catch (error) {
      console.error('DOCX generation error:', error);
      throw new Error('Failed to generate DOCX');
    }
  }

  latexToPlainText(latexContent) {
    // Remove LaTeX commands and convert to plain text
    let plainText = latexContent
      .replace(/\\documentclass\{[^}]+\}/g, '')
      .replace(/\\usepackage\{[^}]+\}/g, '')
      .replace(/\\begin\{document\}/g, '')
      .replace(/\\end\{document\}/g, '')
      .replace(/\\section\{([^}]+)\}/g, '\n\n$1\n' + '='.repeat(20) + '\n')
      .replace(/\\subsection\{([^}]+)\}/g, '\n\n$1\n' + '-'.repeat(15) + '\n')
      .replace(/\\textbf\{([^}]+)\}/g, '$1')
      .replace(/\\textit\{([^}]+)\}/g, '$1')
      .replace(/\\hfill/g, '\t')
      .replace(/\\\\/g, '\n')
      .replace(/\\item/g, '• ')
      .replace(/\\begin\{[^}]+\}/g, '')
      .replace(/\\end\{[^}]+\}/g, '')
      .replace(/\\[a-zA-Z]+\{[^}]*\}/g, '')
      .replace(/\\[a-zA-Z]+/g, '')
      .replace(/\{|\}/g, '')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();

    return plainText;
  }

  splitTextToLines(text, maxWidth, font, fontSize) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
        }
        currentLine = word;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  async cleanupFile(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('File cleanup error:', error);
    }
  }
}

module.exports = new FileService();