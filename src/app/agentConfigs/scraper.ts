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
    webSearch: async (args: { query: string }, _transcriptLogsFiltered: TranscriptItem[]) => {
      console.log(`Performing web search via REST API for: ${args.query}`);
      const apiKey = process.env.OPENAI_API_KEY; // Use environment variable
      if (!apiKey) {
        console.error("OPENAI_API_KEY environment variable is not set.");
        return "API key is missing, cannot perform web search.";
      }

      try {
        const response = await fetch("https://api.openai.com/v1/responses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4.1-mini", // Or another model supporting the responses API
            tools: [{ type: "web_search_preview", search_context_size: "high" }],
            input: args.query,
          }),
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error(`Web search API error: ${response.status} ${response.statusText}`, errorData);
          return `Sorry, the web search failed with status: ${response.status}`;
        }

        const responseData = await response.json();
        console.log("Web search REST API response:", responseData);
        
        const outputText = responseData.output_text; 

        if (outputText === null || outputText === undefined) {
             const messageItem = responseData.output?.find((item: any) => item.type === 'message' && item.content?.[0]?.type === 'output_text');
             const textFromMessage = messageItem?.content?.[0]?.text;
             if (textFromMessage) {
                 return textFromMessage;
             }
            console.error("Web search did not return output_text in expected format.", responseData);
            return "Sorry, I couldn't find any information for that query.";
        }

        return outputText;

      } catch (error: any) {
        console.error("Error during web search REST API call:", error);
        if (error instanceof Error) {
          console.error("Error name:", error.name);
          console.error("Error message:", error.message);
          console.error("Error stack:", error.stack);
        }
        return "Sorry, I encountered an error while searching the web. Check server logs for details.";
      }
    },
  },
};

// Apply injectTransferTools to the specific agent config
const agents = injectTransferTools([scraperAgentConfig]);

export default agents; 