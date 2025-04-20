# Realtime API Agent Demo (Scraper Agent Focus)

This demo showcases agentic patterns built on the Realtime API, now focused on a single scenario: `scraper`.

This example primarily demonstrates:
- Defining a custom tool (`webSearch`) for an agent.
- Using the OpenAI API (via direct REST call in this case) within a tool's logic to perform actions like web searching.
- Basic agent configuration within the application structure.

![Screenshot of the Realtime API Agents Demo](/public/screenshot.png) 
*(Note: Screenshot may show previous examples)*

## Setup

- This is a Next.js typescript app
- Install dependencies with `npm i`
- **Important:** Create a `.env.local` file in the project root and add your OpenAI API key:
  ```
  OPENAI_API_KEY=your_openai_api_key_here
  ```
- Start the server with `npm run dev`
- Open your browser to [http://localhost:3000](http://localhost:3000) to see the app. It will automatically connect to the `scraper` scenario.

## Configuring the Agent

The primary configuration is in `src/app/agentConfigs/scraper.ts`. This file defines the `Scraper` agent:

```typescript
import { AgentConfig, Tool, TranscriptItem } from "@/app/types";
import { injectTransferTools } from "./utils";
import fetch from 'node-fetch';

// Define the web search tool schema
const webSearchTool: Tool = {
  type: "function",
  name: "webSearch",
  // ... parameters ...
};

// Define the Scraper agent
const scraperAgentConfig: AgentConfig = {
  name: "Scraper",
  publicDescription: "Agent that can search the web using a custom tool.",
  instructions: "This agent can search the web to answer questions. Ask me to search for something!",
  tools: [webSearchTool], 
  toolLogic: {
    webSearch: async (args: { query: string }, /* ... */) => {
      // Logic to call OpenAI /v1/responses API using fetch
      // ... see file for full implementation ...
    },
  },
};

const agents = injectTransferTools([scraperAgentConfig]);

export default agents;
```

This agent is configured with:
- Instructions on its capabilities.
- A `webSearch` tool definition.
- `toolLogic` that implements the `webSearch` tool by making a REST API call to OpenAI's `/v1/responses` endpoint with the `web_search_preview` tool.

### Next steps
- Explore the implementation details in `src/app/agentConfigs/scraper.ts` to understand how the web search tool is defined and executed.
- Modify the `instructions` or add more tools/logic to customize the agent's behavior.
- Review `src/app/App.tsx` to see how the agent configuration is loaded and how session updates (like setting the voice) are sent.
- Refer to the [OpenAI Realtime API documentation](https://platform.openai.com/docs/guides/realtime) for more details on the underlying API.

## UI
- The conversation transcript is on the left, including tool calls, tool call responses, and agent changes. Click to expand non-message elements.
- The event log is on the right, showing both client and server events. Click to see the full payload.
- On the bottom, you can disconnect, toggle between automated voice-activity detection or PTT, turn off audio playback, and toggle logs.
- *Note: The Scenario dropdown has been removed as only the `scraper` scenario is available.* The Agent dropdown remains in case the `scraper` scenario includes multiple agents in the future.
