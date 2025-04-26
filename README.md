# QuickQAI - OpenAI Realtime Agents

A web application that enables real-time voice interaction with AI agents featuring powerful web search capabilities.

![Screenshot of QuickQAI](/public/quickQdemo.png)

## Quick Start

### Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file in the project root with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
4. Start the application:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

### How to Use

- Click "Connect" to start a session with the AI agent
- Type your question or use the "Talk" button for voice input
- View web search results in the Timeline panel
- Toggle the interface settings using the gear icon

## Features

- **Real-time Voice Interaction**: Speak with the AI agent using WebRTC for low-latency communication
- **Web Search**: Get real-time information from the web through natural conversation
- **Dark/Light Mode**: Choose between light, dark, or system theme
- **Push-to-Talk**: Option for controlled voice input
- **Event Logging**: View the communication between client and server
- **Timeline View**: Track web search results in chronological order

## Configuration

The agent is configured in `src/app/agentConfigs/` with tools like web search enabled by default.
