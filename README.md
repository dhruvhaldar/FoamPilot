# FoamPilot - A Modern GUI for OpenFOAM

FoamPilot is a web-based graphical user interface for the OpenFOAM CFD software, built with Next.js and leveraging modern AI capabilities to streamline your simulation workflow.

## Features

- **Case Management**: Create, manage, and delete OpenFOAM cases.
- **File Editor**: A built-in code editor with syntax highlighting for OpenFOAM dictionaries.
- **AI Parameter Optimizer**: Get AI-powered suggestions for your solver settings to improve performance and accuracy.
- **AI `blockMeshDict` Generator**: Define geometry in a simple format and let the AI generate the `blockMeshDict` for you.
- **Real-time Simulation Console**: View the live output of your OpenFOAM solvers.
- **Workflow Visualization**: Understand the typical OpenFOAM workflow with a clear, visual guide.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (or your preferred package manager like yarn or pnpm)

## Getting Started

### 1. Installation

First, clone the repository and install the dependencies:

```bash
git clone <repository_url>
cd <repository_directory>
npm install
```

### 2. Environment Variables

The AI features in this application are powered by Google's Gemini models via Genkit. To use them, you'll need a Gemini API key.

1.  Create a `.env` file in the root of the project by copying the example:
    ```bash
    cp .env.example .env
    ```
2.  Obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
3.  Add your API key to the `.env` file:
    ```
    GEMINI_API_KEY=your_api_key_here
    ```

### 3. Running the Development Server

This project uses Genkit for its AI flows. You need to run two processes concurrently: the Next.js development server and the Genkit development server.

**In your first terminal, start the Genkit development server:**

```bash
npm run genkit:watch
```
This will start the Genkit server and watch for any changes in your AI flow files (`src/ai/flows`).

**In your second terminal, start the Next.js development server:**

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Building for Production

To create a production-ready build of the application, run the following command:

```bash
npm run build
```

This will create an optimized build in the `.next` directory.

### Starting the Production Server

To run the production build locally, use the `start` script:

```bash
npm run start
```

This will start a server on the default port (3000) or the port specified by the `PORT` environment variable.

## Project Structure

- `src/app/`: The main Next.js application pages and layout.
- `src/components/`: Reusable React components, including UI elements built with ShadCN.
- `src/ai/`: Contains all AI-related code.
  - `src/ai/flows/`: Genkit flows that define the AI logic and prompts.
  - `src/ai/genkit.ts`: Genkit initialization and configuration.
- `src/lib/`: Utility functions, type definitions, and mock data.
- `public/`: Static assets.
