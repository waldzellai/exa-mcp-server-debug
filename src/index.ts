#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Import tool implementations
import { registerWebSearchTool } from "./tools/webSearch.js";
import { registerResearchPaperSearchTool } from "./tools/researchPaperSearch.js";
import { registerCompanyResearchTool } from "./tools/companyResearch.js";
import { registerCrawlingTool } from "./tools/crawling.js";
import { registerCompetitorFinderTool } from "./tools/competitorFinder.js";
import { registerLinkedInSearchTool } from "./tools/linkedInSearch.js";
import { registerWikipediaSearchTool } from "./tools/wikipediaSearch.js";
import { registerGithubSearchTool } from "./tools/githubSearch.js";
import { log } from "./utils/logger.js";

// Configuration schema for the EXA API key and tool selection
export const configSchema = z.object({
  exaApiKey: z.string().optional().describe("Exa AI API key for search operations"),
  enabledTools: z.array(z.string()).optional().describe("List of tools to enable (if not specified, all tools are enabled)"),
  debug: z.boolean().default(false).describe("Enable debug logging")
});

// Tool registry for managing available tools
const availableTools = {
  'web_search_exa': { name: 'Web Search (Exa)', description: 'Real-time web search using Exa AI', enabled: true },
  'research_paper_search_exa': { name: 'Research Paper Search', description: 'Search academic papers and research', enabled: true },
  'company_research_exa': { name: 'Company Research', description: 'Research companies and organizations', enabled: true },
  'crawling_exa': { name: 'Web Crawling', description: 'Extract content from specific URLs', enabled: true },
  'competitor_finder_exa': { name: 'Competitor Finder', description: 'Find business competitors', enabled: true },
  'linkedin_search_exa': { name: 'LinkedIn Search', description: 'Search LinkedIn profiles and companies', enabled: true },
  'wikipedia_search_exa': { name: 'Wikipedia Search', description: 'Search Wikipedia articles', enabled: true },
  'github_search_exa': { name: 'GitHub Search', description: 'Search GitHub repositories and code', enabled: true }
};

/**
 * Exa AI Web Search MCP Server
 * 
 * This MCP server integrates Exa AI's search capabilities with Claude and other MCP-compatible clients.
 * Exa is a search engine and API specifically designed for up-to-date web searching and retrieval,
 * offering more recent and comprehensive results than what might be available in an LLM's training data.
 * 
 * The server provides tools that enable:
 * - Real-time web searching with configurable parameters
 * - Research paper searches
 * - Company research and analysis
 * - Competitive intelligence
 * - And more!
 */

export default function ({ config }: { config: z.infer<typeof configSchema> }) {
  try {
    if (config.debug) {
      log("Starting Exa MCP Server in debug mode");
    }

    // Create MCP server
    const server = new McpServer({
      name: "exa-search-server",
      version: "1.0.0"
    });
    
    log("Server initialized with modern MCP SDK and Smithery CLI support");

    // Helper function to check if a tool should be registered
    const shouldRegisterTool = (toolId: string): boolean => {
      if (config.enabledTools && config.enabledTools.length > 0) {
        return config.enabledTools.includes(toolId);
      }
      return availableTools[toolId as keyof typeof availableTools]?.enabled ?? false;
    };

    // Helper function to register a tool if enabled
    const registerToolIfEnabled = (toolId: string, registerFn: Function): void => {
      if (shouldRegisterTool(toolId)) {
        registerFn(server, config);
        registeredTools.push(toolId);
      }
    };

    // Register tools based on configuration
    const registeredTools: string[] = [];
    
    registerToolIfEnabled('web_search_exa', registerWebSearchTool);
    registerToolIfEnabled('research_paper_search_exa', registerResearchPaperSearchTool);
    registerToolIfEnabled('company_research_exa', registerCompanyResearchTool);
    registerToolIfEnabled('crawling_exa', registerCrawlingTool);
    registerToolIfEnabled('competitor_finder_exa', registerCompetitorFinderTool);
    registerToolIfEnabled('linkedin_search_exa', registerLinkedInSearchTool);
    registerToolIfEnabled('wikipedia_search_exa', registerWikipediaSearchTool);
    registerToolIfEnabled('github_search_exa', registerGithubSearchTool);
    
    if (config.debug) {
      log(`Registered ${registeredTools.length} tools: ${registeredTools.join(', ')}`);
    }
    
    return server;
    
  } catch (error) {
    log(`Server initialization error: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}