import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface NetlifyFunctionResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

export interface EthicsCaseParams {
  persona: 'catalina' | 'mentor' | 'ana' | 'carlos';
  caseId: string;
  userId?: string;
  locale?: string;
}

export interface SurveyParams {
  userId?: string;
  responses?: any;
  section?: string;
}

export class NetlifyClient {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NETLIFY_FUNCTION_BASE_URL || 'https://integridai.netlify.app/.netlify/functions';
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000, // 30 seconds
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'IntegridAI-MCP-Server/1.0',
      },
    });

    // Add request interceptor for auth
    this.client.interceptors.request.use((config) => {
      if (process.env.NETLIFY_API_TOKEN) {
        config.headers.Authorization = `Bearer ${process.env.NETLIFY_API_TOKEN}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Netlify API Error:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          message: error.message,
          data: error.response?.data,
        });
        throw error;
      }
    );
  }

  /**
   * Get available characters from the simulator
   */
  async getCharacters(): Promise<NetlifyFunctionResponse> {
    try {
      const response = await this.client.get('/get-characters');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Start a conversation with a character
   */
  async startConversation(params: {
    persona: string;
    caseId: string;
    userId?: string;
    locale?: string;
  }): Promise<NetlifyFunctionResponse> {
    try {
      const response = await this.client.post('/start-conversation', params);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Continue a conversation
   */
  async continueConversation(params: {
    sessionId: string;
    message: string;
    persona: string;
  }): Promise<NetlifyFunctionResponse> {
    try {
      const response = await this.client.post('/continue-conversation', params);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * End conversation and get analysis
   */
  async endConversation(params: {
    sessionId: string;
    persona: string;
    decisions: any[];
  }): Promise<NetlifyFunctionResponse> {
    try {
      const response = await this.client.post('/end-conversation', params);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Submit survey responses
   */
  async submitSurveyResponse(params: {
    responses: any;
    userId?: string;
    sectionId?: string;
  }): Promise<NetlifyFunctionResponse> {
    try {
      const response = await this.client.post('/survey-responses', params);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get survey responses
   */
  async getSurveyResponses(params: {
    userId?: string;
    format?: 'json' | 'csv';
  }): Promise<NetlifyFunctionResponse> {
    try {
      const response = await this.client.get('/survey-responses', { params });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Execute a complete ethics case simulation
   * This is a higher-level method that orchestrates the full workflow
   */
  async executeEthicsCase(params: EthicsCaseParams): Promise<{
    success: boolean;
    sessionId?: string;
    decisions?: any[];
    analysis?: any;
    reportUrl?: string;
    error?: string;
  }> {
    try {
      // Start conversation
      const startResult = await this.startConversation(params);
      if (!startResult.success) {
        return { success: false, error: startResult.error };
      }

      const sessionId = startResult.data.sessionId;
      const decisions: any[] = [];

      // Simulate conversation turns (this would be more sophisticated in real implementation)
      const scenarioQuestions = [
        "¿Cómo manejarías esta situación de conflicto de interés?",
        "¿Qué harías si te ofrecieran una ventaja comercial cuestionable?",
        "¿Cómo procederías ante esta irregularidad contable?",
      ];

      for (const question of scenarioQuestions) {
        const continueResult = await this.continueConversation({
          sessionId,
          message: question,
          persona: params.persona,
        });

        if (continueResult.success && continueResult.data) {
          decisions.push({
            question,
            response: continueResult.data.response,
            timestamp: new Date().toISOString(),
          });
        }
      }

      // End conversation and get analysis
      const endResult = await this.endConversation({
        sessionId,
        persona: params.persona,
        decisions,
      });

      if (!endResult.success) {
        return { success: false, error: endResult.error };
      }

      return {
        success: true,
        sessionId,
        decisions,
        analysis: endResult.data.analysis,
        reportUrl: endResult.data.reportUrl,
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Execute a complete integrity survey
   */
  async executeIntegritySurvey(params: {
    userId?: string;
    surveyData?: any;
  }): Promise<{
    success: boolean;
    responses?: any;
    csvUrl?: string;
    jsonUrl?: string;
    summary?: string;
    error?: string;
  }> {
    try {
      // For now, simulate survey completion
      // In real implementation, this would orchestrate the full survey flow
      
      const mockResponses = {
        section1: { score: 85, responses: ['yes', 'no', 'partially'] },
        section2: { score: 90, responses: ['excellent', 'good', 'needs_improvement'] },
        // ... more sections
      };

      const submitResult = await this.submitSurveyResponse({
        responses: mockResponses,
        userId: params.userId,
      });

      if (!submitResult.success) {
        return { success: false, error: submitResult.error };
      }

      // Generate export URLs (mock for now)
      const exportResult = await this.getSurveyResponses({
        userId: params.userId,
        format: 'csv',
      });

      return {
        success: true,
        responses: mockResponses,
        csvUrl: exportResult.data?.csvUrl,
        jsonUrl: exportResult.data?.jsonUrl,
        summary: exportResult.data?.summary,
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}