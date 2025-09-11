import crypto from 'crypto';

export interface StorageUploadResult {
  success: boolean;
  url?: string;
  hash?: string;
  size?: number;
  error?: string;
}

export interface StorageConfig {
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  endpoint?: string; // For Cloudflare R2 or other S3-compatible services
}

export class StorageClient {
  private config: StorageConfig;

  constructor(config?: StorageConfig) {
    this.config = config || {
      bucket: process.env.STORAGE_BUCKET || 'integridai-artifacts',
      region: process.env.STORAGE_REGION || 'us-east-1',
      accessKeyId: process.env.STORAGE_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY || '',
      endpoint: process.env.STORAGE_ENDPOINT,
    };
  }

  /**
   * Upload artifact to cloud storage
   */
  async uploadArtifact(
    fileName: string,
    content: string | Buffer,
    mimeType: string = 'application/octet-stream'
  ): Promise<StorageUploadResult> {
    try {
      // Generate content hash
      const hash = crypto
        .createHash('sha256')
        .update(content)
        .digest('hex');

      const size = Buffer.isBuffer(content) ? content.length : Buffer.byteLength(content);

      // For demo/development, we'll use a mock storage that generates signed URLs
      // In production, this would integrate with AWS S3, Cloudflare R2, etc.
      const mockUrl = this.generateMockUrl(fileName, hash);

      // TODO: Replace with actual cloud storage upload
      /*
      const s3 = new AWS.S3({
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
        region: this.config.region,
        endpoint: this.config.endpoint,
      });

      const uploadParams = {
        Bucket: this.config.bucket,
        Key: fileName,
        Body: content,
        ContentType: mimeType,
        Metadata: {
          hash,
          uploadedAt: new Date().toISOString(),
        },
      };

      const result = await s3.upload(uploadParams).promise();
      */

      return {
        success: true,
        url: mockUrl,
        hash,
        size,
      };

    } catch (error: any) {
      console.error('Storage upload error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Generate signed URL for artifact access
   */
  async generateSignedUrl(
    fileName: string,
    expiresIn: number = 3600 // 1 hour default
  ): Promise<string> {
    // For demo, generate a mock signed URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://integridai-mcp.vercel.app';
    const token = crypto
      .createHash('sha256')
      .update(`${fileName}:${Date.now()}:${this.config.accessKeyId}`)
      .digest('hex')
      .substring(0, 16);
    
    return `${baseUrl}/api/artifacts/${fileName}?token=${token}&expires=${Date.now() + (expiresIn * 1000)}`;
  }

  /**
   * Upload CSV export
   */
  async uploadCSV(
    fileName: string,
    csvData: string
  ): Promise<StorageUploadResult> {
    return this.uploadArtifact(fileName, csvData, 'text/csv');
  }

  /**
   * Upload JSON export
   */
  async uploadJSON(
    fileName: string,
    jsonData: any
  ): Promise<StorageUploadResult> {
    const content = JSON.stringify(jsonData, null, 2);
    return this.uploadArtifact(fileName, content, 'application/json');
  }

  /**
   * Upload HTML report
   */
  async uploadHTMLReport(
    fileName: string,
    htmlContent: string
  ): Promise<StorageUploadResult> {
    return this.uploadArtifact(fileName, htmlContent, 'text/html');
  }

  /**
   * Upload PDF report (would require PDF generation)
   */
  async uploadPDFReport(
    fileName: string,
    pdfBuffer: Buffer
  ): Promise<StorageUploadResult> {
    return this.uploadArtifact(fileName, pdfBuffer, 'application/pdf');
  }

  /**
   * Delete artifact
   */
  async deleteArtifact(fileName: string): Promise<{ success: boolean; error?: string }> {
    try {
      // TODO: Implement actual deletion
      console.log(`Mock deletion of ${fileName}`);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate mock URL for development
   */
  private generateMockUrl(fileName: string, hash: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://integridai-mcp.vercel.app';
    return `${baseUrl}/api/artifacts/${fileName}?hash=${hash}`;
  }

  /**
   * Generate file name with timestamp
   */
  static generateFileName(
    type: 'report' | 'csv' | 'json',
    extension: string,
    runId: string
  ): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `${type}_${runId}_${timestamp}.${extension}`;
  }

  /**
   * Convert objects to CSV
   */
  static objectArrayToCSV(objects: any[]): string {
    if (!objects || objects.length === 0) {
      return '';
    }

    // Get all unique keys
    const keys = [...new Set(objects.flatMap(obj => Object.keys(obj)))];
    
    // Create CSV header
    const header = keys.join(',');
    
    // Create CSV rows
    const rows = objects.map(obj => 
      keys.map(key => {
        const value = obj[key];
        if (value === null || value === undefined) {
          return '';
        }
        // Escape CSV values
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    );

    return [header, ...rows].join('\n');
  }

  /**
   * Generate HTML report template
   */
  static generateHTMLReport(data: {
    title: string;
    summary: string;
    sections: Array<{ title: string; content: string }>;
    legalRefs: string[];
    runId: string;
    timestamp: string;
  }): string {
    return `
<!DOCTYPE html>
<html lang="es-AR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .section { margin-bottom: 30px; }
        .legal-refs { background: #e8f4f8; padding: 15px; border-left: 4px solid #2196F3; }
        .metadata { font-size: 0.9em; color: #666; margin-top: 30px; }
        h1, h2 { color: #333; }
        .summary { font-size: 1.1em; line-height: 1.6; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${data.title}</h1>
        <p><strong>Fecha:</strong> ${data.timestamp}</p>
        <p><strong>ID de Ejecución:</strong> ${data.runId}</p>
    </div>

    <div class="section">
        <h2>Resumen Ejecutivo</h2>
        <div class="summary">${data.summary}</div>
    </div>

    ${data.sections.map(section => `
    <div class="section">
        <h2>${section.title}</h2>
        <div>${section.content}</div>
    </div>
    `).join('')}

    <div class="legal-refs">
        <h3>Referencias Legales y Normativas</h3>
        <ul>
            ${data.legalRefs.map(ref => `<li>${ref}</li>`).join('')}
        </ul>
        <p><strong>Importante:</strong> Este informe es generado automáticamente para fines de capacitación y evaluación. No constituye asesoramiento legal definitivo y debe ser revisado por personal especializado.</p>
    </div>

    <div class="metadata">
        <p>Generado por IntegridAI MCP Server - Plataforma de Compliance Ley 27.401</p>
        <p>© 2025 IntegridAI - Todos los derechos reservados</p>
    </div>
</body>
</html>
    `.trim();
  }
}