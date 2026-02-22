import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { method, params } = body;

    let result;

    switch (method) {
      case 'initialize':
        result = {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {},
            resources: {}
          },
          serverInfo: {
            name: 'MCP Documentation Hub',
            version: '1.0.0',
            description: 'Complete documentation for the Model Context Protocol'
          }
        };
        break;

      case 'tools/list':
        result = {
          tools: [
            {
              name: 'get_protocol_docs',
              description: 'Get MCP protocol documentation and specifications',
              inputSchema: {
                type: 'object',
                properties: {
                  section: {
                    type: 'string',
                    enum: ['overview', 'architecture', 'protocol', 'best-practices', 'security'],
                    description: 'Documentation section to retrieve'
                  }
                }
              }
            },
            {
              name: 'get_examples',
              description: 'Get code examples for MCP implementation',
              inputSchema: {
                type: 'object',
                properties: {
                  language: {
                    type: 'string',
                    enum: ['javascript', 'python', 'typescript', 'go', 'rust'],
                    description: 'Programming language for examples'
                  }
                }
              }
            },
            {
              name: 'get_servers',
              description: 'Get list of available MCP servers and their documentation',
              inputSchema: {
                type: 'object',
                properties: {
                  category: {
                    type: 'string',
                    description: 'Filter by server category'
                  }
                }
              }
            },
            {
              name: 'get_integration_guide',
              description: 'Get step-by-step integration guide for MCP',
              inputSchema: {
                type: 'object',
                properties: {
                  platform: {
                    type: 'string',
                    enum: ['claude-desktop', 'web-app', 'server', 'custom'],
                    description: 'Target platform for integration'
                  }
                }
              }
            },
            {
              name: 'search_docs',
              description: 'Search MCP documentation',
              inputSchema: {
                type: 'object',
                properties: {
                  query: {
                    type: 'string',
                    description: 'Search query'
                  }
                },
                required: ['query']
              }
            }
          ]
        };
        break;

      case 'tools/call':
        const toolName = params?.name;

        switch (toolName) {
          case 'get_protocol_docs':
            const section = params?.arguments?.section || 'overview';
            result = getProtocolDocs(section);
            break;

          case 'get_examples':
            const language = params?.arguments?.language || 'javascript';
            result = getExamples(language);
            break;

          case 'get_servers':
            const category = params?.arguments?.category;
            result = getServers(category);
            break;

          case 'get_integration_guide':
            const platform = params?.arguments?.platform || 'claude-desktop';
            result = getIntegrationGuide(platform);
            break;

          case 'search_docs':
            const query = params?.arguments?.query;
            if (!query) {
              throw new Error('Query is required for search');
            }
            result = searchDocs(query);
            break;

          default:
            throw new Error(`Unknown tool: ${toolName}`);
        }
        break;

      default:
        throw new Error(`Unknown method: ${method}`);
    }

    return NextResponse.json({
      jsonrpc: '2.0',
      id: body.id,
      result
    });

  } catch (error) {
    return NextResponse.json({
      jsonrpc: '2.0',
      id: body.id || 1,
      error: {
        code: -32000,
        message: error instanceof Error ? error.message : 'Unknown error',
        data: error
      }
    }, { status: 500 });
  }
}

function getProtocolDocs(section: string) {
  const docs = {
    overview: {
      title: 'Model Context Protocol (MCP) - Overview',
      content: `
# What is MCP?

The Model Context Protocol (MCP) is an open protocol that enables AI applications
to connect to external data sources and tools.

## Key Concepts

- **Servers**: Applications that provide data and tools via MCP
- **Clients**: Applications that consume MCP services (like Claude Desktop)
- **Transport**: How data moves between client and server (HTTP, WebSocket, etc.)
- **Resources**: Data sources exposed by servers
- **Tools**: Functions that can be called on servers
- **Prompts**: Reusable prompt templates

## Benefits

- Standardized interface for AI integrations
- Server-side flexibility in implementation
- Client-side simplicity in consumption
- Type-safe and discoverable API
      `
    },
    architecture: {
      title: 'MCP Architecture',
      content: `
# MCP Architecture

## Client-Server Model

```
┌─────────────┐         ┌─────────────┐
│   Client    │◄───────►│   Server    │
│  (Claude)   │  JSON-  │  (Your App) │
│             │   RPC   │             │
└─────────────┘         └─────────────┘
```

## Transport Layer

MCP can run over multiple transports:
- **HTTP/HTTPS**: For web applications
- **WebSocket**: For real-time bidirectional communication
- **stdio**: For local applications
- **SSE**: For server-sent events

## Request Flow

1. Client sends JSON-RPC request
2. Server processes request
3. Server returns JSON-RPC response
4. Error handling built into protocol
      `
    },
    protocol: {
      title: 'MCP Protocol Specification',
      content: `
# JSON-RPC 2.0 Base

All MCP messages use JSON-RPC 2.0 format:

\`\`\`json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}
\`\`\`

## Standard Methods

### initialize
Establish connection and exchange capabilities.

### tools/list
List all available tools.

### tools/call
Execute a specific tool.

### resources/list
List all available resources.

### resources/read
Read a specific resource.

### prompts/list
List all available prompts.

### prompts/get
Get a specific prompt.
      `
    },
    'best-practices': {
      title: 'MCP Best Practices',
      content: `
# MCP Best Practices

## Server Design

1. **Keep tools focused**: Each tool should do one thing well
2. **Provide clear descriptions**: Help clients understand tool usage
3. **Handle errors gracefully**: Return meaningful error messages
4. **Validate inputs**: Check all parameters before processing
5. **Document schemas**: Use JSON Schema for input validation

## Performance

1. **Implement caching**: Cache expensive operations
2. **Use streaming**: For long-running operations
3. **Rate limiting**: Protect your server from abuse
4. **Monitor usage**: Track which tools are used most

## Security

1. **Validate all inputs**: Never trust client data
2. **Use HTTPS**: Always encrypt transport layer
3. **Implement auth**: Use API keys or OAuth
4. **Sanitize outputs**: Remove sensitive data
5. **Rate limit by user**: Prevent abuse
      `
    },
    security: {
      title: 'MCP Security Guide',
      content: `
# MCP Security Considerations

## Authentication

Recommended approaches:
- API Keys in headers
- OAuth 2.0 for user authentication
- JWT for signed requests

## Authorization

- Implement role-based access control
- Check permissions for each tool
- Log all access attempts

## Data Validation

- Validate all input parameters
- Sanitize output data
- Remove sensitive information
- Limit data size

## Transport Security

- Always use HTTPS in production
- Validate SSL certificates
- Use secure WebSocket (WSS)
- Implement CORS properly

## Rate Limiting

- Limit requests per user
- Implement backoff strategies
- Monitor for abuse patterns
      `
    }
  };

  return docs[section] || docs.overview;
}

function getExamples(language: string) {
  const examples = {
    javascript: `
// JavaScript MCP Server Example
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server({
  name: 'my-server',
  version: '1.0.0'
}, {
  capabilities: {
    tools: {}
  }
});

server.setRequestHandler('tools/list', async () => ({
  tools: [{
    name: 'my_tool',
    description: 'Does something useful',
    inputSchema: {
      type: 'object',
      properties: {
        param: { type: 'string' }
      }
    }
  }]
}));

server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'my_tool') {
    return {
      content: [{
        type: 'text',
        text: \`Result: \${args.param}\`
      }]
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
`,
    python: `
# Python MCP Server Example
from mcp.server import Server
from mcp.server.stdio import stdio_server
import json

server = Server('my-server')

@server.list_tools()
async def list_tools() -> list:
    return [{
        'name': 'my_tool',
        'description': 'Does something useful',
        'inputSchema': {
            'type': 'object',
            'properties': {
                'param': {'type': 'string'}
            }
        }
    }]

@server.call_tool()
async def call_tool(name: str, arguments: dict):
    if name == 'my_tool':
        return {
            'content': [{
                'type': 'text',
                'text': f"Result: {arguments['param']}"
            }]
        }

async def main():
    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            server.create_initialization_options()
        )

if __name__ == '__main__':
    import asyncio
    asyncio.run(main())
`,
    typescript: `
// TypeScript MCP Server Example
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new Server({
  name: 'my-server',
  version: '1.0.0'
}, {
  capabilities: {
    tools: {}
  }
});

// Define tool schema
const MyToolSchema = z.object({
  param: z.string()
});

server.setRequestHandler('tools/list', async () => ({
  tools: [{
    name: 'my_tool',
    description: 'Does something useful',
    inputSchema: MyToolSchema.extend({}).parse
  }]
}));

server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'my_tool') {
    const input = MyToolSchema.parse(args);
    return {
      content: [{
        type: 'text',
        text: \`Result: \${input.param}\`
      }]
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
`,
    go: `
// Go MCP Server Example
package main

import (
  "encoding/json"
  "fmt"
  "os"
)

type Request struct {
  JSONRPC string      \`json:"jsonrpc"\`
  ID      int         \`json:"id"\`
  Method  string      \`json:"method"\`
  Params  interface{} \`json:"params"\`
}

type Tool struct {
  Name        string                 \`json:"name"\`
  Description string                 \`json:"description"\`
  InputSchema map[string]interface{} \`json:"inputSchema"\`
}

func main() {
  decoder := json.NewDecoder(os.Stdin)
  encoder := json.NewEncoder(os.Stdout)

  for {
    var req Request
    if err := decoder.Decode(&req); err != nil {
      break
    }

    switch req.Method {
    case "tools/list":
      tools := []Tool{{
        Name:        "my_tool",
        Description: "Does something useful",
        InputSchema: map[string]interface{}{
          "type": "object",
          "properties": map[string]interface{}{
            "param": map[string]string{"type": "string"},
          },
        },
      }}

      encoder.Encode(map[string]interface{}{
        "jsonrpc": "2.0",
        "id":      req.ID,
        "result":  map[string]interface{}{"tools": tools},
      })
    }
  }
}
`,
    rust: `
// Rust MCP Server Example
use serde_json::{json, Value};

fn main() {
    let stdin = std::io::stdin();
    let stdout = std::io::stdout();

    for line in stdin.lock().lines() {
        if let Ok(request_str) = line {
            if let Ok(request) = serde_json::from_str::<Value>(&request_str) {
                let method = request["method"].as_str().unwrap_or("");

                let response = match method {
                    "tools/list" => json!({
                        "jsonrpc": "2.0",
                        "id": request["id"],
                        "result": {
                            "tools": [{
                                "name": "my_tool",
                                "description": "Does something useful",
                                "inputSchema": {
                                    "type": "object",
                                    "properties": {
                                        "param": {"type": "string"}
                                    }
                                }
                            }]
                        }
                    }
                    ),
                    _ => json!({
                        "jsonrpc": "2.0",
                        "id": request["id"],
                        "error": {"code": -32601, "message": "Method not found"}
                    })
                };

                println!("{}", response);
            }
        }
    }
}
`
  };

  return {
    language,
    code: examples[language] || examples.javascript
  };
}

function getServers(category?: string) {
  const servers = [
    {
      id: 'portfolio',
      name: 'Portfolio API',
      description: 'Access projects, skills, and blog posts',
      category: 'Personal',
      url: 'https://bookchaowalit-portfolio-frontend.vercel.app/api/mcp',
      endpoints: 6
    },
    {
      id: 'techblog',
      name: 'Tech Blog API',
      description: 'Technical articles and programming content',
      category: 'Content',
      url: 'https://bookchaowalit-techblog-frontend.vercel.app/api/mcp',
      endpoints: 3
    },
    {
      id: 'artblog',
      name: 'Art Blog API',
      description: 'Creative arts and design content',
      category: 'Content',
      url: 'https://bookchaowalit-artblog-frontend.vercel.app/api/mcp',
      endpoints: 3
    },
    {
      id: 'techspace',
      name: 'Tech Space API',
      description: 'Technology stacks and development platforms',
      category: 'Tech',
      url: 'https://bookchaowalit-techspace-frontend.vercel.app/api/mcp',
      endpoints: 6
    },
    {
      id: 'mcp',
      name: 'MCP List Hub',
      description: 'Central aggregator for all MCP servers',
      category: 'Infrastructure',
      url: 'https://bookchaowalit-mcplist-frontend.vercel.app/api/mcp',
      endpoints: 3
    }
  ];

  if (category) {
    return servers.filter(s => s.category.toLowerCase() === category.toLowerCase());
  }

  return servers;
}

function getIntegrationGuide(platform: string) {
  const guides = {
    'claude-desktop': {
      title: 'Integrating MCP with Claude Desktop',
      content: `
# Claude Desktop Integration

## Step 1: Create Your Server

Build your MCP server following the protocol specification.

## Step 2: Configure Claude Desktop

Edit the Claude Desktop config file:

**macOS**: \`~/Library/Application Support/Claude/claude_desktop_config.json\`

**Windows**: \`%APPDATA%/Claude/claude_desktop_config.json\`

\`\`\`json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["/path/to/your/server.js"]
    }
  }
}
\`\`\`

## Step 3: Restart Claude Desktop

Your server will be available in the Claude interface!

## Troubleshooting

- Check server logs for errors
- Verify file paths are absolute
- Ensure your server handles JSON-RPC properly
- Test with \`echo '{"method": "tools/list"}' | node server.js\`
      `
    },
    'web-app': {
      title: 'Integrating MCP with Web Applications',
      content: `
# Web Application Integration

## Step 1: Deploy Your Server

Deploy your MCP server as an HTTP endpoint (Vercel, Railway, etc.)

## Step 2: Make Requests

\`\`\`javascript
const response = await fetch('https://your-server.com/api/mcp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list'
  })
});

const data = await response.json();
console.log(data.result.tools);
\`\`\`

## Step 3: Handle Responses

Process the JSON-RPC response and display results in your UI.

## Best Practices

- Implement proper error handling
- Show loading states for long requests
- Cache results when appropriate
- Handle network failures gracefully
      `
    },
    server: {
      title: 'Building MCP Servers',
      content: `
# Building MCP Servers

## Choose Your Transport

- **stdio**: For local desktop integration
- **HTTP**: For web applications
- **WebSocket**: For real-time features

## Basic Structure

\`\`\`
my-mcp-server/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts
│   ├── tools/
│   └── handlers/
└── dist/
\`\`\`

## Implement Required Methods

1. \`initialize\` - Server capabilities
2. \`tools/list\` - Available tools
3. \`tools/call\` - Execute tools
4. Optionally: \`resources/list\`, \`resources/read\`

## Testing

\`\`\`bash
# Test with stdio
echo '{"method": "tools/list"}' | node dist/index.js

# Test with HTTP
curl -X POST http://localhost:3000/api/mcp \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
\`\`\`
      `
    },
    custom: {
      title: 'Custom MCP Integrations',
      content: `
# Custom MCP Integrations

## Use Cases

- **Internal tools**: Connect company data to AI
- **Services**: Offer data via MCP
- **Automation**: Build AI-powered workflows
- **Research**: Share datasets with AI

## Architecture Considerations

1. **Authentication**: API keys, OAuth, JWT
2. **Rate Limiting**: Protect your resources
3. **Caching**: Improve performance
4. **Monitoring**: Track usage and errors

## Security Best Practices

- Validate all inputs
- Sanitize outputs
- Use HTTPS
- Implement rate limiting
- Log access patterns
- Monitor for abuse

## Deployment

- Vercel (HTTP)
- Railway (HTTP/WebSocket)
- AWS Lambda (HTTP)
- Docker containers (any transport)
      `
    }
  };

  return guides[platform] || guides['claude-desktop'];
}

function searchDocs(query: string) {
  const searchIndex = [
    { title: 'JSON-RPC 2.0', section: 'protocol', content: 'The base protocol used by MCP' },
    { title: 'Tools', section: 'protocol', content: 'Functions that can be called on servers' },
    { title: 'Resources', section: 'protocol', content: 'Data sources exposed by servers' },
    { title: 'Authentication', section: 'security', content: 'API keys, OAuth, JWT for MCP' },
    { title: 'Transport Layer', section: 'architecture', content: 'HTTP, WebSocket, stdio transports' },
    { title: 'Claude Desktop', section: 'integration', content: 'Integrating MCP with Claude Desktop' },
    { title: 'Best Practices', section: 'best-practices', content: 'Server design and performance tips' },
    { title: 'Error Handling', section: 'best-practices', content: 'Graceful error handling in MCP' },
    { title: 'Rate Limiting', section: 'security', content: 'Protecting servers from abuse' },
    { title: 'Examples', section: 'examples', content: 'Code examples in JavaScript, Python, and more' }
  ];

  const lowerQuery = query.toLowerCase();
  const results = searchIndex.filter(item =>
    item.title.toLowerCase().includes(lowerQuery) ||
    item.content.toLowerCase().includes(lowerQuery) ||
    item.section.toLowerCase().includes(lowerQuery)
  );

  return {
    query,
    count: results.length,
    results
  };
}
