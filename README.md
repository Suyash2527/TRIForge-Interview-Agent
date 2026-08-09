# 🏛️ TRIForge AI Interview Agent

![Build Status](https://github.com/Suyash2527/TRIForge-Interview-Agent/actions/workflows/test.yml/badge.svg)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

**[🔥 View Live Deployment](https://triforge-interview-agent.vercel.app/)**

An enterprise-grade, real-time AI Interviewing platform built to dynamically assess technical candidates. Designed specifically for the **AI Cohort Hackathon**, this application acts as a senior AI engineering interviewer, evaluating candidates on RAG, Vector Databases, Prompt Engineering, and MCP based on their actual cohort progress.

---

## 🚀 Key Features

*   **Dynamic Conversational AI**
    Powered by Google's `gemini-3.5-flash` model. It doesn't just ask scripted questions—it adapts, probes edge cases, and generates live follow-ups based on the depth of the candidate's answers.
*   **Live Scoring & Analytics Engine**
    Automatically extracts a live score (0-100) from the AI's internal reasoning loop, providing real-time feedback without breaking the conversational immersion.
*   **Enterprise-Grade Security**
    All LLM interactions pass through `/api/chat`, where they are intercepted and sanitized by a strict **Zod validation schema**. The application is hardened with strict HTTP Security Headers (CSP, HSTS).
*   **Fully Automated CI/CD**
    Backed by a comprehensive **Jest + JSDOM** test suite that mocks API calls and validates UI logic. Every push is verified by GitHub Actions.
*   **Minimalist B2B Aesthetic**
    Built with Tailwind CSS v4, featuring a sleek, high-contrast professional design utilizing strict Times New Roman typography to emulate a serious academic/enterprise environment.

---

## 💻 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) |
| **UI & Styling** | React 19, Tailwind CSS v4 |
| **AI Integration** | `@google/genai` SDK (`gemini-3.5-flash`) |
| **Validation** | Zod Schema Validation |
| **Testing & CI** | Jest, React Testing Library, GitHub Actions |
| **Analytics** | Vercel Speed Insights |

---

## 🛠️ Getting Started

### 1. Prerequisites
You will need Node.js installed and a valid Google Gemini API Key.

### 2. Installation
Clone the repository and install the dependencies:
```bash
git clone https://github.com/Suyash2527/TRIForge-Interview-Agent.git
cd TRIForge-Interview-Agent
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add your API key:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## 🧪 Testing

The project includes a robust test suite covering both the UI components and Next.js API routes (including fully mocked GenAI responses).

```bash
# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

---

## 📝 Hackathon Transparency
Please refer to the [AI_USAGE.md](AI_USAGE.md) file in this repository for a detailed, transparent log of how Generative AI was utilized to pair-program and accelerate the development of this platform.
