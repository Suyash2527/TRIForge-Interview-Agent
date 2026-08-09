# AI Usage & Development Log

This document outlines the collaborative pair-programming journey used to build the **TRIForge AI Interview Agent**. As a solo developer participating in the AI Cohort hackathon, I utilized a Generative AI coding assistant (Google DeepMind / Gemini) to accelerate boilerplate creation, debate architectural decisions, and rapidly iterate on security and testing implementations.

## Development Timeline & Prompts

| Phase | Developer Prompt | Engineering Intent | AI Outcome & Action Taken |
| :--- | :--- | :--- | :--- |
| **1. Architecture & Vision** | *"The Interview Agent. Build the interviewer, not the interview. The Situation... [Provided Hackathon JSON Constraints]"* | Establish strict constraints (8 questions, 4 days) and provide the exact schema required for the backend API. | The AI scaffolded the Next.js app and created the `prompt.ts` rules engine to strictly follow the challenge constraints. |
| **1. Architecture & Vision** | *"why there is claude name change it to something better and what can be done in 3d"* | Remove generic AI branding and brainstorm a professional, B2B-style minimalist UI. | Stripped legacy references, established a strict Times New Roman typography standard, and polished the CSS. |
| **2. Security & Testing** | *"add testing in the app."* | Create a comprehensive safety net before modifying core API logic. | Configured a full Jest test suite with JSDOM polyfills to mock the Google GenAI SDK. |
| **2. Security & Testing** | *"add security what are the option for now"* | Harden the application against prompt injections and common web vulnerabilities. | Implemented strict `zod` schema validation on the `/api/chat` route and added HTTP Security Headers (CSP, HSTS). |
| **3. Model Tuning** | *"change the model to a cheap model but similar output"* / *"use flash 2"* | Optimize the heavy conversational workload by testing different endpoints. | Debugged API key provisioning errors across models before stabilizing on the highly capable `gemini-3.5-flash`. |
| **3. Model Tuning** | *"do we have rag"* | Audit the retrieval pipeline to determine if a Vector Database was necessary. | Discussed and concluded that "Context Stuffing" the small JSON directly into Gemini's context window was far faster and more reliable than a complex RAG pipeline. |
| **4. CI/CD & Debugging** | *"ADD THE TEST IN REPO FOR USER TO CHECK THEM"* | Automate testing so reviewers can verify code health dynamically on GitHub. | Wrote a GitHub Actions workflow (`test.yml`) to automatically run the Jest suite on every push. |
| **4. CI/CD & Debugging** | *"WHY THIS PUSH ALSO FAILED... [pasted GitHub Actions logs]"* | Actively debug a failing CI runner using raw error logs. | Pair-debugged the issue, identifying a missing TypeScript parser (`ts-node`) on Linux runners, installed it, and fixed the pipeline. |
| **5. Deployment** | *"push new things with proper gitignore"* / *"add a proper readme"* | Ensure the repository is clean, secrets are hidden, and documentation is professional. | Wrote the comprehensive `README.md` and configured `.gitignore` for Next.js. |
| **5. Deployment** | *"update the agent md whater updateion is req do it all"* | Set strict guidelines for future AI interactions on this codebase. | Created `TRIFORGE_AGENT.md` to define our design philosophies and tech stacks for future agents. |
| **5. Deployment** | *"so tell now how to make it live"* / *"give me the key"* | Drive the final polish and deploy the application to the internet. | Deployed to Vercel and securely configured environment variables. |
| **5. Deployment** | *"Install our package Start by installing @vercel/speed-insights..."* | Track real-world performance metrics in production. | Automatically injected the Vercel Speed Insights component into the root layout. |
| **6. The "Wow" Factor** | *"what else can be done in this project to make it stand out more"* | Brainstorm high-impact features to impress hackathon judges without breaking the architecture. | The AI proposed 5 ideas, including Voice API integration, Recharts, and PDF Exports. |
| **6. The "Wow" Factor** | *"add 1,2,3,4"* | Execute a massive UI/UX overhaul containing multiple distinct features at once. | Implemented Recharts, `html2canvas` PDF generation, `react-markdown` styling, and native browser Web Speech API (TTS/STT). |
| **6. The "Wow" Factor** | *"make sure every thing passes" / "add the new prompt..."* | Debug downstream CI/CD test failures caused by new ES Modules. | Mocked complex ESM modules (`react-markdown`) and injected `TextEncoder` into Jest's JSDOM setup to fix the GitHub Actions pipeline. |
---
*This log was actively maintained to provide complete transparency into the human-AI collaboration process that built this project.*
