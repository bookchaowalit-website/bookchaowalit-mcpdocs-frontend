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
  const docs: Record<string, any> = {
    overview: {
      title: 'Model Context Protocol (MCP) - Overview',
      content: 'MCP is an open protocol that enables AI applications to connect to external data sources and tools.'
    },
    architecture: {
      title: 'MCP Architecture',
      content: 'MCP uses a client-server model with JSON-RPC 2.0 as the base protocol.'
    },
    protocol: {
      title: 'MCP Protocol Specification',
      content: 'All MCP messages use JSON-RPC 2.0 format with standard methods like initialize, tools/list, and tools/call.'
    },
    'best-practices': {
      title: 'MCP Best Practices',
      content: 'Keep tools focused, provide clear descriptions, handle errors gracefully, and validate all inputs.'
    },
    security: {
      title: 'MCP Security Guide',
      content: 'Always use HTTPS, implement authentication, validate inputs, and use rate limiting to protect your server.'
    }
  };

  return docs[section] || docs.overview;
}

function getExamples(language: string) {
  const examples: Record<string, any> = {
    javascript: {
      language: 'javascript',
      code: 'const server = new Server({ name: "my-server", version: "1.0.0" });'
    },
    python: {
      language: 'python',
      code: 'server = Server("my-server")'
    },
    typescript: {
      language: 'typescript',
      code: 'const server = new Server({ name: "my-server", version: "1.0.0" });'
    },
    go: {
      language: 'go',
      code: 'package main'
    },
    rust: {
      language: 'rust',
      code: 'fn main() {}'
    }
  };

  return {
    language,
    code: examples[language]?.code || examples.javascript.code
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
  const guides: Record<string, any> = {
    'claude-desktop': {
      title: 'Integrating MCP with Claude Desktop',
      content: 'Edit the Claude Desktop config file and add your server configuration.'
    },
    'web-app': {
      title: 'Integrating MCP with Web Applications',
      content: 'Deploy your MCP server as an HTTP endpoint and make fetch requests to it.'
    },
    server: {
      title: 'Building MCP Servers',
      content: 'Implement the required methods: initialize, tools/list, and tools/call.'
    },
    custom: {
      title: 'Custom MCP Integrations',
      content: 'Build custom integrations using the MCP protocol specification.'
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
