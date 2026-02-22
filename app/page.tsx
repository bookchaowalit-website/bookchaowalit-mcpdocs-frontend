import { Book, Code, Globe, Layers, Search } from 'lucide-react';

export default function Home() {
  const tools = [
    {
      name: 'get_protocol_docs',
      description: 'Get MCP protocol documentation and specifications',
      icon: Book,
      params: ['overview', 'architecture', 'protocol', 'best-practices', 'security']
    },
    {
      name: 'get_examples',
      description: 'Get code examples for MCP implementation',
      icon: Code,
      params: ['javascript', 'python', 'typescript', 'go', 'rust']
    },
    {
      name: 'get_servers',
      description: 'Get list of available MCP servers',
      icon: Globe,
      params: ['category (optional)']
    },
    {
      name: 'get_integration_guide',
      description: 'Get step-by-step integration guide',
      icon: Layers,
      params: ['claude-desktop', 'web-app', 'server', 'custom']
    },
    {
      name: 'search_docs',
      description: 'Search MCP documentation',
      icon: Search,
      params: ['query (required)']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
              <Book className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">MCP Documentation Hub</h1>
              <p className="text-sm text-slate-400">Model Context Protocol Reference</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-violet-400"></span>
            <span className="text-sm text-violet-300">MCP-Enabled Server</span>
          </div>

          <h2 className="mb-6 text-5xl font-bold text-white">
            Complete MCP Documentation
          </h2>

          <p className="mb-8 text-lg text-slate-300">
            Your comprehensive guide to the Model Context Protocol.
            Access documentation, code examples, integration guides, and search functionality
            all through a standardized MCP interface.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/api/mcp"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-3 font-medium text-white transition-all hover:from-violet-600 hover:to-purple-700"
            >
              <Code className="h-4 w-4" />
              MCP Endpoint
            </a>
            <a
              href="https://modelcontextprotocol.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-800/50 px-6 py-3 font-medium text-white transition-all hover:bg-slate-700/50"
            >
              <Book className="h-4 w-4" />
              Official Docs
            </a>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="container mx-auto px-6 pb-20">
        <div className="mb-10 text-center">
          <h3 className="mb-4 text-3xl font-bold text-white">Available MCP Tools</h3>
          <p className="text-slate-400">
            Interact with this server using any MCP-compatible client
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.name}
                className="group rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 backdrop-blur-sm transition-all hover:border-violet-500/50 hover:bg-slate-800/50"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-600/20 group-hover:from-violet-500/30 group-hover:to-purple-600/30">
                  <Icon className="h-6 w-6 text-violet-400" />
                </div>

                <h4 className="mb-2 font-semibold text-white">{tool.name}</h4>
                <p className="mb-4 text-sm text-slate-400">{tool.description}</p>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500">Parameters:</p>
                  {tool.params.map((param) => (
                    <code
                      key={param}
                      className="block rounded bg-slate-900/50 px-2 py-1 text-xs text-violet-300"
                    >
                      {param}
                    </code>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Usage Example */}
      <section className="border-t border-slate-700/50">
        <div className="container mx-auto px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <h3 className="mb-6 text-2xl font-bold text-white">Example Usage</h3>

            <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500"></span>
                <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                <span className="h-3 w-3 rounded-full bg-green-500"></span>
                <span className="ml-4 text-sm text-slate-500">JSON-RPC Request</span>
              </div>

              <pre className="overflow-x-auto text-sm text-slate-300">
                <code>{`{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "get_protocol_docs",
    "arguments": {
      "section": "architecture"
    }
  }
}`}</code>
              </pre>
            </div>

            <div className="mt-8 rounded-xl border border-slate-700/50 bg-slate-800/30 p-6">
              <h4 className="mb-3 font-semibold text-white">Server Information</h4>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-slate-400">Name</dt>
                  <dd className="text-white">MCP Documentation Hub</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-400">Version</dt>
                  <dd className="text-white">1.0.0</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-400">Protocol</dt>
                  <dd className="text-white">2024-11-05</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-400">Transport</dt>
                  <dd className="text-white">HTTP/HTTPS</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50">
        <div className="container mx-auto px-6 py-8">
          <p className="text-center text-sm text-slate-500">
            Part of the bookchaowalit portfolio ecosystem • Built with Next.js 15 and TypeScript
          </p>
        </div>
      </footer>
    </div>
  );
}
