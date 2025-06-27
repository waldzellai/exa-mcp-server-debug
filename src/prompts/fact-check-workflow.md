# Fact-Checking Workflow

This workflow enables Claude to detect and verify potential hallucinations in text using existing MCP tools.

## Process

1. **Extract Claims**
   - Claude analyzes the provided text
   - Identifies specific, verifiable factual claims
   - Separates facts from opinions or unverifiable statements

2. **Search for Sources**
   - For each claim, use `web_search_exa` to find relevant information
   - Search query should include the claim and request verification sources
   - Gather 3-5 sources per claim for robust verification

3. **Verify Claims**
   - Claude analyzes each claim against the gathered sources
   - Determines: True, False, or Insufficient Information
   - Provides confidence score (0-100)
   - Suggests corrections for false claims

## Example Usage

User: "Please fact-check this text: 'The Moon is made of green cheese and orbits the Earth once per day.'"

Claude would:
1. Extract claims:
   - "The Moon is made of green cheese"
   - "The Moon orbits the Earth once per day"

2. Search for each claim:
   ```
   web_search_exa: "Moon composition what is the moon made of"
   web_search_exa: "Moon orbit Earth duration how long"
   ```

3. Analyze results and report:
   - Claim 1: False (100% confidence) - The Moon is made of rock and dust
   - Claim 2: False (100% confidence) - The Moon orbits Earth once every 27.3 days

## Output Format

```json
{
  "claims": [
    {
      "claim": "The Moon is made of green cheese",
      "assessment": "False",
      "confidence": 100,
      "correction": "The Moon is made of rock and dust",
      "sources": ["NASA.gov", "Space.com", "Britannica.com"]
    }
  ]
}
```