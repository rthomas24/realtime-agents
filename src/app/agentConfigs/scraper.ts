import { AgentConfig, Tool, TranscriptItem } from "@/app/types";
import { injectTransferTools } from "./utils";
import fetch from 'node-fetch';

// Define the web search tool
const webSearchTool: Tool = {
  type: "function",
  name: "webSearch",
  description: "Searches the web for information based on a user query.",
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "The search query to use for the web search.",
      },
    },
    required: ["query"],
  },
};

// Define the Scraper agent configuration
const scraperAgentConfig: AgentConfig = { // Renamed variable for clarity
  name: "Scraper", // Renamed agent name
  publicDescription: "Agent that can search the web using a custom tool.",
  instructions: "This agent can search the web to answer questions. Ask me to search for something!",
  tools: [webSearchTool],
  toolLogic: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    webSearch: async (args: { query: string }, _transcriptLogsFiltered: TranscriptItem[]) => {
      console.log(`ToolLogic: Calling /api/websearch for: ${args.query}`);
      try {
        const response = await fetch("/api/websearch", { // Relative path to our API route
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: args.query }), // Send query in the body
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`ToolLogic: API route error: ${response.status}`, errorData);
          return errorData.error || `Sorry, the web search failed with status: ${response.status}`;
        }

        const responseData = await response.json();
        
        return responseData;

      } catch (error: any) {
        console.error("ToolLogic: Error calling internal API route:", error);
        const errorMessage = "Sorry, I encountered an internal error processing the search."; // More specific error
        if (error instanceof Error) {
          console.error("Error name:", error.name);
          console.error("Error message:", error.message);
          console.error("Error stack:", error.stack);
        }
        return errorMessage;
      }
    },
  },
};

// Apply injectTransferTools to the specific agent config
const agents = injectTransferTools([scraperAgentConfig]);

export default agents; 