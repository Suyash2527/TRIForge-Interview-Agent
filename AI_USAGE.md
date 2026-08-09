# AI Usage Log

This document serves as a transparency log detailing the usage of Generative AI (Google DeepMind Agent / Gemini) to assist in building the **TRIForge AI Interview Agent** for the AI Cohort hackathon. 

The application was built collaboratively via pair-programming with the AI. Below is a log of the core user prompts and instructions provided to the AI agent to drive the development, architecture, debugging, and deployment of the project.

---

### Phase 1: Project Setup & Architecture
- *"The Interview Agent. Build the interviewer, not the interview. The Situation... [Full Hackathon Prompt provided to establish constraints and JSON structures]."*
- *"why there is claude name change it to something better and what can be done in 3d"* (Led to rebranding the default agent configuration and establishing the B2B minimalist design philosophy).

### Phase 2: Security & Testing Implementation
- *"add testing in the app."* (Led to the implementation of the Jest test suite, mocked API calls, and JSDOM setup).
- *"add security what are the option for now"* (Led to the integration of Zod for API payload validation and HTTP Security Headers in Next.js).
- *"change the model to a cheap model but similar output"*
- *"use flash 2"* (Explored upgrading to Gemini 2.0 Flash, but reverted to 3.5-Flash due to API key access constraints).
- *"ADD THE TEST IN REPO FOR USER TO CHECK THEM"* (Led to the creation of the GitHub Actions CI workflow to automatically run Jest on push).

### Phase 3: Version Control & Documentation
- *"push new things with proper gitignore"*
- *"add a proper readme fully updated in a proper format"* (Led to the comprehensive `README.md` detailing the tech stack, setup, and features).
- *"update the agent md whater updateion is req do it all"* (Led to the removal of legacy IDE files and the creation of `TRIFORGE_AGENT.md` to define strict guidelines for future AI interaction on the repo).

### Phase 4: Debugging CI/CD
- *"WHY THIS PUSH ALSO FAILED WHAT IS THE REASON MAKE SURE EVERY PSUH PASSES"*
- *[User pasted GitHub Actions error log]* (Led to the debugging and installation of `ts-node` so the Linux CI runner could parse the TypeScript Jest configuration).

### Phase 5: Deployment & Optimization
- *"do we have rag"* (Discussion on Context Stuffing vs RAG for small curriculum JSONs).
- *"so tell now how to make it live"* (Guidance provided on Vercel deployment and Environment Variables).
- *"give me the key"*
- *"Install our package Start by installing @vercel/speed-insights in your existing project..."* (Led to the installation and integration of Vercel Speed Insights for production performance tracking).

---
*Generated automatically to fulfill hackathon AI transparency requirements.*
