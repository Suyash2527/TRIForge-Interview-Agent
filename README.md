# TRIForge AI Interview Agent

An enterprise-grade, real-time AI Interviewing platform built to dynamically assess technical candidates. The application leverages the Google Gemini API to conduct conversational interviews, evaluate candidate responses against specific curricula, and provide a live, dynamically adjusting score.

## 🚀 Features

- **Dynamic Conversational AI:** Powered by Google's `gemini-3.5-flash` model via the `@google/genai` SDK.
- **Live Scoring System:** Automatically extracts a live score (0-100) from the AI's internal reasoning to provide real-time candidate feedback.
- **Professional Minimalist UI:** Built with Tailwind CSS v4 featuring a sleek, high-contrast, professional design and Times New Roman typography.
- **Robust Security Baseline:** 
  - **Zod Validation:** Strict request payload validation on the API layer to prevent prompt injection and payload flooding.
  - **HTTP Security Headers:** Configured with CSP, HSTS, and X-Frame-Options to mitigate XSS and Clickjacking.
- **Comprehensive Test Suite:** Fully configured with Jest and React Testing Library for both frontend component testing and backend API route mocking.

## 💻 Tech Stack

- **Framework:** Next.js (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS v4
- **AI Integration:** Google GenAI SDK
- **Validation:** Zod
- **Testing:** Jest + React Testing Library

## 🛠️ Getting Started

### Prerequisites

You will need Node.js installed and a valid Google Gemini API Key.

### 1. Installation

Clone the repository and install the dependencies:

```bash
npm install
```

### 2. Environment Variables

Create a `.env` or `.env.local` file in the root directory and add your Gemini API Key. 

*(Note: The environment is currently optimized for `gemini-3.5-flash`. Ensure your API key has access to this model version).*

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### 3. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🧪 Testing

The project includes a robust test suite that covers both the UI components and the Next.js API routes (including mocked Gemini API calls and error handling).

To run the tests:

```bash
# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

## 🔒 Security Architecture

This application employs an edge-ready security configuration:
- All interactions with the LLM pass through `/api/chat`, where they are intercepted and validated by a strict `Zod` schema.
- The `next.config.js` file enforces strict transport security and explicit Content Security Policies, ensuring the app is safe for production deployment on Vercel or similar edge networks.

## 📝 License

Internal Use - TRIForge
