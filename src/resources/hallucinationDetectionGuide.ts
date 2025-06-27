import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Hallucination Detection Guide Resource
 * 
 * Provides guidance for using Exa's search capabilities to detect hallucinations
 * in text content through a client-orchestrated workflow.
 */

const guides = {
  overview: {
    title: "Hallucination Detection Overview",
    content: `
**Welcome to Hallucination Detection with Exa!**

This guide helps you detect potential hallucinations or incorrect claims in text content using Exa's powerful search capabilities.

**Available Guide Topics:**
- \`fact_check_guide\` - Learn the 3-step process for fact-checking claims

**Key Concepts:**
- **Hallucination**: When text contains false or unverifiable claims
- **Claim Extraction**: Identifying specific, verifiable statements
- **Source Verification**: Finding authoritative sources to verify claims
- **Confidence Scoring**: Assessing the reliability of verification

Use this tool to understand how to implement fact-checking workflows in your applications.
    `
  },

  fact_check_guide: {
    title: "Fact-Checking Guide: 3-Step Process",
    content: `
**Fact-Checking with Exa: A 3-Step Process**

This guide documents how to detect hallucinations by verifying claims against web sources.

## Step 1: Extract Verifiable Claims (Client-Side)

The MCP client (Claude Code, Cline, etc.) analyzes the text and extracts specific, verifiable claims.

**What makes a good claim:**
- Specific facts, dates, numbers, or statistics
- Named entities (people, companies, places)
- Cause-and-effect relationships
- Historical events or timelines
- Scientific or technical assertions

**Example extraction:**
Text: "OpenAI was founded in 2015 in San Francisco with $1 billion in funding."

Claims extracted:
1. "OpenAI was founded in 2015"
2. "OpenAI was founded in San Francisco"  
3. "OpenAI was founded with $1 billion in funding"

## Step 2: Search for Sources (Using Exa)

For each extracted claim, use Exa's web_search_exa tool to find relevant sources.

**Example search queries:**
\`\`\`
For claim: "OpenAI was founded in 2015"
Search query: "OpenAI founding date year established"

For claim: "OpenAI was founded with $1 billion in funding"
Search query: "OpenAI initial funding amount investors"
\`\`\`

**Best practices for source searching:**
- Use multiple search variations per claim
- Include entity names and key facts
- Search for authoritative sources (news, official sites)
- Gather 3-5 sources per claim for reliability

## Step 3: Evaluate Claims (Client-Side)

The client evaluates each claim against the retrieved sources.

**Evaluation process:**
1. **Check source agreement**: Do multiple sources confirm the claim?
2. **Assess source quality**: Are sources authoritative and recent?
3. **Identify contradictions**: Do any sources dispute the claim?
4. **Determine verification status**:
   - ✅ **True**: Multiple reliable sources confirm
   - ❌ **False**: Sources contradict the claim
   - ⚠️ **Unverifiable**: Insufficient or conflicting information

**Confidence scoring (0-100):**
- 90-100: Strong agreement across multiple authoritative sources
- 70-89: Good agreement with some minor variations
- 50-69: Mixed evidence or limited sources
- 0-49: Contradictory or no supporting evidence

## Complete Example Workflow

**Input text:**
"Tesla's Cybertruck was announced in 2019 and immediately received 500,000 pre-orders within the first week."

**Step 1 - Claims extracted:**
1. "Tesla's Cybertruck was announced in 2019"
2. "Cybertruck received 500,000 pre-orders within the first week"

**Step 2 - Exa searches:**
\`\`\`
Claim 1 search: "Tesla Cybertruck announcement date 2019"
Claim 2 search: "Tesla Cybertruck pre-orders first week 500000"
\`\`\`

**Step 3 - Evaluation results:**
\`\`\`
Claim 1: ✅ True (Confidence: 95)
- Multiple sources confirm November 2019 announcement
- Official Tesla records and major news outlets agree

Claim 2: ⚠️ Unverifiable (Confidence: 60)  
- Some sources mention "nearly 500,000" 
- Timeframe varies ("within days" vs "first week")
- No official Tesla confirmation of exact numbers
\`\`\`

## Implementation Tips

**Claim-to-Source Mapping:**
Consider maintaining a mapping structure like:
\`\`\`javascript
const claimSourceMap = new Map([
  ["claim-1", {
    text: "Tesla's Cybertruck was announced in 2019",
    sources: [/* Exa search results */],
    verification: { status: "true", confidence: 95 }
  }],
  ["claim-2", {
    text: "Cybertruck received 500,000 pre-orders",
    sources: [/* Exa search results */],
    verification: { status: "unverifiable", confidence: 60 }
  }]
]);
\`\`\`

**Optimization strategies:**
- Batch similar claims for efficient searching
- Cache search results to avoid duplicates
- Prioritize high-impact claims
- Set confidence thresholds for your use case

This 3-step process enables reliable hallucination detection using Exa's search capabilities!
    `
  }
};

export function registerHallucinationDetectionGuide(server: McpServer): void {
  // Register the overview resource
  server.resource(
    "Hallucination Detection Guide - Overview",
    "guide://hallucination-detection/overview",
    {
      description: "Overview of hallucination detection capabilities with Exa",
      mimeType: "text/markdown"
    },
    async () => {
      const guide = guides.overview;
      return {
        contents: [{
          uri: "guide://hallucination-detection/overview",
          mimeType: "text/markdown",
          text: `# ${guide.title}\n\n${guide.content.trim()}`
        }]
      };
    }
  );

  // Register the fact-checking guide resource
  server.resource(
    "Hallucination Detection Guide - Fact Checking Process",
    "guide://hallucination-detection/fact-check-guide",
    {
      description: "Learn the 3-step process for fact-checking claims using Exa",
      mimeType: "text/markdown"
    },
    async () => {
      const guide = guides.fact_check_guide;
      return {
        contents: [{
          uri: "guide://hallucination-detection/fact-check-guide",
          mimeType: "text/markdown",
          text: `# ${guide.title}\n\n${guide.content.trim()}`
        }]
      };
    }
  );
}