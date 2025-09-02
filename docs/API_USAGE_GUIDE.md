# Darwin ASI API - Usage Guide

## Overview

The Darwin ASI API provides a standalone service for accessing Advanced Superintelligence capabilities. This API can be integrated into any project requiring sophisticated reasoning, expert analysis, and evolutionary optimization.

**Key Features:**
- 384 expert reasoning system across 8 domains
- Long-context processing (128K tokens)
- Evolutionary optimization algorithms
- Legal compliance checking
- Real-time processing with statistics
- RESTful API design with JSON responses

## Quick Start

### 1. Start the API Server

```bash
# Basic startup
python darwin_asi_api.py

# Custom configuration
python darwin_asi_api.py --host 0.0.0.0 --port 8080 --debug

# Using PM2 for production (recommended)
pm2 start darwin_asi_api.py --name "darwin-asi-api" --interpreter python3
```

The server will be available at `http://localhost:8080` by default.

### 2. Test the Connection

```bash
# Health check
curl http://localhost:8080/api/asi/health

# System status
curl http://localhost:8080/api/asi/status
```

## API Endpoints

### 1. System Status

**GET** `/api/asi/status`

Returns comprehensive system information and capabilities.

```json
{
  "service": "Darwin ASI API",
  "version": "1.0.0",
  "status": "operational",
  "capabilities": [
    "advanced_reasoning",
    "expert_selection",
    "evolutionary_optimization",
    "legal_compliance_checking",
    "long_context_processing",
    "multi_domain_analysis"
  ],
  "system_info": {
    "experts_available": 384,
    "expert_categories": 8,
    "context_memory_usage": "0/128000 tokens"
  }
}
```

### 2. Advanced Reasoning

**POST** `/api/asi/reason`

Main reasoning endpoint that processes queries using multiple experts.

**Request Body:**
```json
{
  "query": "How can we implement sustainable AI practices in enterprise environments?",
  "context": "Enterprise context with 10,000+ employees, strict compliance requirements",
  "use_evolution": true,
  "num_experts": 8
}
```

**Response:**
```json
{
  "response": "## Executive Summary\nBased on analysis from 8 expert perspectives...",
  "experts_consulted": 8,
  "reasoning_depth": 8,
  "compliance_status": "compliant",
  "processing_time": 1.23,
  "confidence_score": 0.847,
  "request_id": "req_1703123456_42",
  "timestamp": "2024-01-01T12:00:00"
}
```

### 3. Expert Management

**GET** `/api/asi/experts`

Get expert information or select experts for a task.

**Query Parameters:**
- `task` (optional): Task description for expert selection
- `context` (optional): Additional context
- `num_experts` (optional): Number of experts to select (default: 8)

**POST** `/api/asi/experts`

Select experts based on detailed criteria.

**Request Body:**
```json
{
  "task": "Technical architecture design",
  "context": "Cloud-native microservices",
  "num_experts": 6
}
```

**Response:**
```json
{
  "selected_experts": [
    {
      "id": 245,
      "category": "technical",
      "specialization": "system_architecture_3",
      "confidence_threshold": 0.85,
      "activation_patterns": ["system_architecture", "technical"]
    }
  ],
  "total_selected": 6
}
```

### 4. Context Management

**GET** `/api/asi/context`

Get current context summary and memory usage.

**POST** `/api/asi/context`

Add content to context memory.

**Request Body:**
```json
{
  "content": "Important project information to remember",
  "priority": "working"
}
```

Priority levels: `immediate`, `working`, `episodic`, `semantic`

**DELETE** `/api/asi/context`

Clear all context memory.

### 5. Legal Compliance

**POST** `/api/asi/compliance`

Check content for legal compliance across multiple frameworks.

**Request Body:**
```json
{
  "content": "Content to check for compliance violations"
}
```

**Response:**
```json
{
  "compliance_result": {
    "status": "compliant",
    "warnings": [],
    "requirements_met": ["GDPR: Privacy considerations addressed"],
    "recommendations": []
  }
}
```

### 6. Statistics

**GET** `/api/asi/stats`

Get API usage statistics and performance metrics.

```json
{
  "total_requests": 142,
  "average_response_time": 1.34,
  "active_requests": 2,
  "uptime_readable": "2:45:30",
  "requests_per_minute": 0.52
}
```

### 7. Health Check

**GET** `/api/asi/health`

Simple health check endpoint.

```json
{
  "status": "healthy",
  "asi_engine_ready": true,
  "version": "1.0.0"
}
```

## Integration Examples

### Python Integration

```python
import requests
import json

class DarwinASIClient:
    def __init__(self, base_url="http://localhost:8080"):
        self.base_url = base_url
        self.session = requests.Session()
    
    def reason(self, query, context="", use_evolution=True, num_experts=8):
        """Submit a reasoning request"""
        url = f"{self.base_url}/api/asi/reason"
        data = {
            "query": query,
            "context": context,
            "use_evolution": use_evolution,
            "num_experts": num_experts
        }
        
        response = self.session.post(url, json=data)
        response.raise_for_status()
        return response.json()
    
    def get_status(self):
        """Get system status"""
        url = f"{self.base_url}/api/asi/status"
        response = self.session.get(url)
        response.raise_for_status()
        return response.json()
    
    def check_compliance(self, content):
        """Check legal compliance"""
        url = f"{self.base_url}/api/asi/compliance"
        data = {"content": content}
        
        response = self.session.post(url, json=data)
        response.raise_for_status()
        return response.json()

# Usage example
client = DarwinASIClient()

# Check if service is running
status = client.get_status()
print(f"Service status: {status['status']}")

# Perform reasoning
result = client.reason(
    query="What are the best practices for AI model deployment?",
    context="Production environment with high availability requirements",
    num_experts=6
)

print(f"Response: {result['response']}")
print(f"Confidence: {result['confidence_score']}")
```

### JavaScript/Node.js Integration

```javascript
class DarwinASIClient {
    constructor(baseUrl = 'http://localhost:8080') {
        this.baseUrl = baseUrl;
    }
    
    async reason(query, options = {}) {
        const {
            context = '',
            use_evolution = true,
            num_experts = 8
        } = options;
        
        const response = await fetch(`${this.baseUrl}/api/asi/reason`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                context,
                use_evolution,
                num_experts
            })
        });
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        
        return await response.json();
    }
    
    async getStatus() {
        const response = await fetch(`${this.baseUrl}/api/asi/status`);
        
        if (!response.ok) {
            throw new Error(`Status request failed: ${response.status}`);
        }
        
        return await response.json();
    }
    
    async checkCompliance(content) {
        const response = await fetch(`${this.baseUrl}/api/asi/compliance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content })
        });
        
        if (!response.ok) {
            throw new Error(`Compliance check failed: ${response.status}`);
        }
        
        return await response.json();
    }
}

// Usage example
const client = new DarwinASIClient();

async function example() {
    try {
        // Check service status
        const status = await client.getStatus();
        console.log('Service status:', status.status);
        
        // Perform reasoning
        const result = await client.reason(
            'How can we optimize our development workflow?',
            {
                context: 'Agile development team with CI/CD pipeline',
                num_experts: 5
            }
        );
        
        console.log('Response:', result.response);
        console.log('Confidence:', result.confidence_score);
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

example();
```

### cURL Examples

```bash
# Basic reasoning request
curl -X POST http://localhost:8080/api/asi/reason \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What are the security implications of AI model deployment?",
    "context": "Cloud environment with sensitive data",
    "use_evolution": true,
    "num_experts": 8
  }'

# Expert selection
curl -X POST http://localhost:8080/api/asi/experts \
  -H "Content-Type: application/json" \
  -d '{
    "task": "Security analysis",
    "context": "Enterprise environment",
    "num_experts": 4
  }'

# Compliance check
curl -X POST http://localhost:8080/api/asi/compliance \
  -H "Content-Type: application/json" \
  -d '{
    "content": "We collect user data for personalization purposes"
  }'

# Add to context
curl -X POST http://localhost:8080/api/asi/context \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Project deadline is next Friday",
    "priority": "immediate"
  }'
```

## Production Deployment

### Using PM2 (Recommended)

```bash
# Install PM2
npm install -g pm2

# Start the service
pm2 start darwin_asi_api.py --name "darwin-asi-api" --interpreter python3

# Configure auto-restart
pm2 startup
pm2 save

# Monitor
pm2 status
pm2 logs darwin-asi-api --nostream
```

### Using Docker

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY darwin_asi_core.py darwin_asi_api.py ./

EXPOSE 8080

CMD ["python", "darwin_asi_api.py", "--host", "0.0.0.0", "--port", "8080"]
```

```bash
# Build and run
docker build -t darwin-asi-api .
docker run -p 8080:8080 darwin-asi-api
```

### Environment Variables

```bash
# Optional environment variables
export DARWIN_ASI_HOST=0.0.0.0
export DARWIN_ASI_PORT=8080
export DARWIN_ASI_DEBUG=false
export DARWIN_ASI_LOG_LEVEL=INFO
```

## Error Handling

The API returns standard HTTP status codes:

- `200`: Success
- `400`: Bad Request (invalid parameters)
- `404`: Endpoint not found
- `500`: Internal server error
- `503`: Service unavailable (ASI engine not initialized)

Error responses include detailed information:

```json
{
  "error": "Missing required field: query",
  "status": "invalid_request"
}
```

## Performance Considerations

### Request Optimization

- Use appropriate `num_experts` values (4-8 for most tasks)
- Enable `use_evolution` only when needed (adds processing time)
- Provide relevant context to improve expert selection
- Use context management to maintain conversation state

### Monitoring

Monitor these metrics for optimal performance:

- Average response time
- Active request count
- Memory usage
- Expert utilization patterns

### Scaling

For high-load scenarios:

1. Use multiple API instances behind a load balancer
2. Implement request queuing for burst traffic
3. Cache frequently requested reasoning patterns
4. Monitor system resources and scale accordingly

## Best Practices

### Query Design

- Be specific and clear in queries
- Provide relevant context information
- Use domain-specific terminology when appropriate
- Structure complex queries with clear objectives

### Context Management

- Add important information to context memory
- Use appropriate priority levels
- Clear context periodically to manage memory
- Monitor context usage through the stats endpoint

### Integration Patterns

- Implement proper error handling and retries
- Use async/await patterns for non-blocking operations
- Cache responses when appropriate
- Monitor API health and implement fallback strategies

## Troubleshooting

### Common Issues

**Service won't start:**
- Check if port 8080 is available
- Verify Python dependencies are installed
- Check logs for initialization errors

**Slow responses:**
- Reduce number of experts requested
- Disable evolutionary optimization for simple queries
- Check system resources and memory usage

**Memory issues:**
- Clear context memory regularly
- Monitor context token usage
- Adjust context priority levels

**Compliance warnings:**
- Review content for sensitive information
- Check against specific legal frameworks
- Implement recommended safeguards

### Debug Mode

Enable debug mode for detailed logging:

```bash
python darwin_asi_api.py --debug
```

This provides verbose logging for troubleshooting integration issues.

## Support and Development

### API Versioning

The API uses semantic versioning. Check the version in status responses:

```json
{
  "version": "1.0.0"
}
```

### Extending the API

To add custom endpoints or modify behavior:

1. Extend the `darwin_asi_api.py` file
2. Add new routes using Flask decorators
3. Implement proper error handling
4. Update this documentation

### Contributing

When extending or modifying the API:

1. Maintain backward compatibility
2. Add proper error handling
3. Include comprehensive logging
4. Update documentation
5. Test all endpoints thoroughly

---

This API provides a powerful foundation for integrating advanced reasoning capabilities into any project while maintaining independence from the main Darwin Writer system.