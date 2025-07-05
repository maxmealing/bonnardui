# BonnardUI Prototype

A Next.js prototype for testing signal configuration flows.

## Quick Start for Alex

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   ```
   http://localhost:3000
   ```

## Testing the Prototype

1. Navigate to `http://localhost:3000`
2. Click "Go to Signals Page" button
3. Test the signal configuration flow:
   - Configure Slack destinations (Channel or Direct Message)
   - Set up triggers (Scheduled, One-time, Agent-triggered)
   - Define scope and metrics
   - Click "Define Content" to customize message content with text, headings, and AI blocks

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run lint` - Run code quality checks

## Tech Stack

Built with Next.js 15, React 19, TypeScript, Tailwind CSS, and Subframe UI components.