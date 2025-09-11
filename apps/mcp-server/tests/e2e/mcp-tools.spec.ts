import { test, expect } from '@playwright/test';

const MCP_BASE_URL = '/api/mcp/http';

// Helper function to make MCP requests
async function makeMCPRequest(page: any, method: string, params?: any) {
  const response = await page.request.post(MCP_BASE_URL, {
    data: {
      jsonrpc: '2.0',
      id: 1,
      method: method,
      params: params || {}
    },
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
  });
  
  return response;
}

test.describe('MCP Server Integration Tests', () => {
  
  test('should return server info', async ({ page }) => {
    const response = await makeMCPRequest(page, 'initialize');
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('result');
    expect(data.result).toHaveProperty('serverInfo');
  });

  test('should list available tools', async ({ page }) => {
    const response = await makeMCPRequest(page, 'tools/list');
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('result');
    expect(data.result).toHaveProperty('tools');
    expect(Array.isArray(data.result.tools)).toBe(true);
    
    const toolNames = data.result.tools.map((tool: any) => tool.name);
    expect(toolNames).toContain('simulate_ethics_case');
    expect(toolNames).toContain('run_integrity_survey');
  });
});

test.describe('Simulate Ethics Case Tool', () => {
  
  test('should successfully execute ethics simulation - Happy Path', async ({ page }) => {
    const response = await makeMCPRequest(page, 'tools/call', {
      name: 'simulate_ethics_case',
      arguments: {
        persona: 'catalina',
        caseId: 'TEST-CASE-001',
        userId: 'test-user-001',
        locale: 'es-AR'
      }
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('result');
    
    const result = data.result.content[0].text;
    const parsedResult = JSON.parse(result);
    
    expect(parsedResult).toHaveProperty('status', 'completed');
    expect(parsedResult).toHaveProperty('summary');
    expect(parsedResult).toHaveProperty('reportUrl');
    expect(parsedResult).toHaveProperty('runId');
    expect(parsedResult).toHaveProperty('executionTime');
    expect(parsedResult).toHaveProperty('legalReferences');
    
    expect(typeof parsedResult.summary).toBe('string');
    expect(parsedResult.summary.length).toBeGreaterThan(0);
    expect(typeof parsedResult.reportUrl).toBe('string');
    expect(parsedResult.reportUrl).toMatch(/^https?:\/\//);
    expect(Array.isArray(parsedResult.legalReferences)).toBe(true);
    expect(parsedResult.legalReferences.length).toBeGreaterThan(0);
  });

  test('should handle invalid persona parameter', async ({ page }) => {
    const response = await makeMCPRequest(page, 'tools/call', {
      name: 'simulate_ethics_case',
      arguments: {
        persona: 'invalid_persona',
        caseId: 'TEST-CASE-001'
      }
    });
    
    expect(response.status()).toBe(400);
    
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  test('should handle missing required caseId parameter', async ({ page }) => {
    const response = await makeMCPRequest(page, 'tools/call', {
      name: 'simulate_ethics_case',
      arguments: {
        persona: 'mentor'
        // Missing caseId
      }
    });
    
    expect(response.status()).toBe(400);
    
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  test('should be idempotent - same request returns same result', async ({ page }) => {
    const testParams = {
      name: 'simulate_ethics_case',
      arguments: {
        persona: 'ana',
        caseId: 'IDEMPOTENT-TEST-001',
        userId: 'test-user-idempotent'
      }
    };

    const idempotencyKey = `test-idempotent-${Date.now()}`;

    // First request
    const response1 = await page.request.post(MCP_BASE_URL, {
      data: {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: testParams
      },
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey
      }
    });

    expect(response1.status()).toBe(200);
    const data1 = await response1.json();
    const result1 = JSON.parse(data1.result.content[0].text);

    // Second request with same idempotency key
    const response2 = await page.request.post(MCP_BASE_URL, {
      data: {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: testParams
      },
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey
      }
    });

    expect(response2.status()).toBe(200);
    const data2 = await response2.json();
    const result2 = JSON.parse(data2.result.content[0].text);

    // Results should be identical
    expect(result1.runId).toBe(result2.runId);
    expect(result1.reportUrl).toBe(result2.reportUrl);
    expect(result1.summary).toBe(result2.summary);
  });
});

test.describe('Run Integrity Survey Tool', () => {
  
  test('should successfully execute integrity survey - Happy Path', async ({ page }) => {
    const response = await makeMCPRequest(page, 'tools/call', {
      name: 'run_integrity_survey',
      arguments: {
        userId: 'test-user-survey-001',
        delivery: 'both',
        notifyEmails: ['test@integridai.com']
      }
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('result');
    
    const result = data.result.content[0].text;
    const parsedResult = JSON.parse(result);
    
    expect(parsedResult).toHaveProperty('status', 'completed');
    expect(parsedResult).toHaveProperty('summary');
    expect(parsedResult).toHaveProperty('csvUrl');
    expect(parsedResult).toHaveProperty('jsonUrl');
    expect(parsedResult).toHaveProperty('runId');
    expect(parsedResult).toHaveProperty('totalScore');
    expect(parsedResult).toHaveProperty('sectionScores');
    
    expect(typeof parsedResult.summary).toBe('string');
    expect(typeof parsedResult.csvUrl).toBe('string');
    expect(typeof parsedResult.jsonUrl).toBe('string');
    expect(typeof parsedResult.totalScore).toBe('number');
    expect(parsedResult.totalScore).toBeGreaterThanOrEqual(0);
    expect(parsedResult.totalScore).toBeLessThanOrEqual(100);
    expect(typeof parsedResult.sectionScores).toBe('object');
  });

  test('should handle CSV-only delivery', async ({ page }) => {
    const response = await makeMCPRequest(page, 'tools/call', {
      name: 'run_integrity_survey',
      arguments: {
        delivery: 'csv'
      }
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    const result = JSON.parse(data.result.content[0].text);
    
    expect(result).toHaveProperty('csvUrl');
    expect(result.jsonUrl).toBeUndefined();
  });

  test('should handle JSON-only delivery', async ({ page }) => {
    const response = await makeMCPRequest(page, 'tools/call', {
      name: 'run_integrity_survey',
      arguments: {
        delivery: 'json'
      }
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    const result = JSON.parse(data.result.content[0].text);
    
    expect(result).toHaveProperty('jsonUrl');
    expect(result.csvUrl).toBeUndefined();
  });

  test('should validate email format in notifyEmails', async ({ page }) => {
    const response = await makeMCPRequest(page, 'tools/call', {
      name: 'run_integrity_survey',
      arguments: {
        delivery: 'json',
        notifyEmails: ['invalid-email-format']
      }
    });
    
    expect(response.status()).toBe(400);
    
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });
});

test.describe('Error Handling and Edge Cases', () => {
  
  test('should handle unknown tool name', async ({ page }) => {
    const response = await makeMCPRequest(page, 'tools/call', {
      name: 'unknown_tool',
      arguments: {}
    });
    
    expect(response.status()).toBe(404);
  });

  test('should handle malformed JSON request', async ({ page }) => {
    const response = await page.request.post(MCP_BASE_URL, {
      data: 'invalid json{',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    expect(response.status()).toBe(400);
  });

  test('should handle CORS preflight request', async ({ page }) => {
    const response = await page.request.fetch(MCP_BASE_URL, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://example.com',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    expect(response.status()).toBe(200);
    expect(response.headers()['access-control-allow-origin']).toBe('*');
    expect(response.headers()['access-control-allow-methods']).toContain('POST');
  });
});

test.describe('Concurrency and Load Tests', () => {
  
  test('should handle concurrent requests without conflicts', async ({ page }) => {
    // Execute multiple requests concurrently
    const concurrentRequests = Array.from({ length: 5 }, (_, index) => 
      makeMCPRequest(page, 'tools/call', {
        name: 'simulate_ethics_case',
        arguments: {
          persona: 'mentor',
          caseId: `CONCURRENT-TEST-${index}`,
          userId: `concurrent-user-${index}`
        }
      })
    );

    const responses = await Promise.all(concurrentRequests);
    
    // All requests should succeed
    responses.forEach(response => {
      expect(response.status()).toBe(200);
    });

    // All should return unique runIds
    const runIds = new Set();
    for (const response of responses) {
      const data = await response.json();
      const result = JSON.parse(data.result.content[0].text);
      runIds.add(result.runId);
    }
    
    expect(runIds.size).toBe(5); // All runIds should be unique
  });
});

test.describe('Artifact Access and Integrity', () => {
  
  test('should generate accessible artifact URLs', async ({ page }) => {
    const response = await makeMCPRequest(page, 'tools/call', {
      name: 'simulate_ethics_case',
      arguments: {
        persona: 'carlos',
        caseId: 'ARTIFACT-TEST-001'
      }
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    const result = JSON.parse(data.result.content[0].text);
    
    // Try to access the report URL (should be accessible)
    const artifactResponse = await page.request.get(result.reportUrl);
    
    // Should either be accessible (200) or require auth (401/403)
    // but not be a 404 (not found)
    expect(artifactResponse.status()).not.toBe(404);
  });
});