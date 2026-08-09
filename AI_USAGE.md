# AI Usage & Development Log

This document outlines the collaborative pair-programming journey used to build the **TRIForge AI Interview Agent**. As a solo developer participating in the AI Cohort hackathon, I utilized a Generative AI coding assistant (Google DeepMind Agent / Gemini) to accelerate boilerplate creation, debate architectural decisions, and rapidly iterate on security and testing implementations. 

Below is a detailed, chronological log of how I prompted the AI to shape the application from an initial idea into an enterprise-ready, deployed system.

---

### Phase 1: Establishing the Vision and Architecture
I started by feeding the AI the exact parameters of the hackathon to establish the core constraints, data structures, and the ultimate goal: building the interviewer, not the interview.

* **My Prompt:** *"The Interview Agent. Build the interviewer, not the interview. The Situation... [Included the full hackathon prompt, Curriculum JSON, and Candidate Profiles]."*
  * **The Goal:** I wanted the AI to deeply understand the strict constraints: the agent needed to ask a minimum of 8 questions across 4 different curriculum days, maintain context, and output a structured JSON feedback payload at the end.
  
* **My Prompt:** *"why there is claude name change it to something better and what can be done in 3d"*
  * **The Goal:** The initial boilerplate had some generic AI branding. I instructed the agent to completely strip out any "Claude" references and brainstorm how we could make the UI feel highly professional, exploring 3D elements but ultimately settling on a strict, minimalist B2B aesthetic using Times New Roman typography to emphasize the serious, academic nature of the technical interview.

### Phase 2: Security, Testing, and Hardening
Once the core Next.js application and Gemini API integration were working, I shifted focus to making the application robust and production-ready.

* **My Prompt:** *"add testing in the app."*
  * **The Goal:** I wanted a comprehensive safety net before we started modifying the API logic. I had the AI set up a full Jest test suite, including complex JSDOM polyfills to mock Next.js routing and the Google GenAI SDK.
  
* **My Prompt:** *"add security what are the option for now"*
  * **The Goal:** I asked the AI to act as a security consultant. Based on its recommendations, I directed it to implement strict `zod` schema validation on the `/api/chat` route to prevent prompt injection, and we added HTTP Security Headers (CSP, HSTS) to the `next.config.js`.

### Phase 3: Model Tuning and Architectural Decisions
I wanted to ensure we were using the most cost-effective and performant models for the heavy conversational workload.

* **My Prompt:** *"change the model to a cheap model but similar output"* and *"use flash 2"*
  * **The Goal:** We experimented with changing the endpoint to `gemini-2.0-flash`. When we hit environment provisioning errors, I had the AI aggressively debug the API key constraints until we stabilized on `gemini-3.5-flash`.
  
* **My Prompt:** *"do we have rag"*
  * **The Goal:** I audited our retrieval pipeline. I discussed with the AI whether we needed a Vector Database. We concluded that because the Curriculum JSON was small enough, "Context Stuffing" (injecting the full JSON directly into Gemini's massive context window) was infinitely faster and more reliable than a complex RAG pipeline for this specific use case.

### Phase 4: CI/CD Pipeline and Debugging
I didn't just want tests running locally; I wanted a fully automated pipeline so anyone reviewing the repository could see the code was verified.

* **My Prompt:** *"ADD THE TEST IN REPO FOR USER TO CHECK THEM"*
  * **The Goal:** I instructed the AI to write a GitHub Actions workflow (`test.yml`) so that our Jest suite would automatically run in the cloud on every single push.

* **My Prompt:** *"WHY THIS PUSH ALSO FAILED WHAT IS THE REASON MAKE SURE EVERY PSUH PASSES"*
  * **The Goal:** The initial CI run failed. I pasted the raw GitHub Actions runner logs (`Error: Jest: 'ts-node' is required...`) to the AI. We pair-debugged the issue, realizing the Linux runner was missing a TypeScript parser that my local Windows machine had cached. I had the AI install `ts-node` as a dev dependency, pushed the fix, and the pipeline turned green.

### Phase 5: Documentation and Deployment
With a working, tested, and secure application, I drove the final polish and deployment.

* **My Prompt:** *"push new things with proper gitignore"* and *"add a proper readme fully updated in a proper format"*
  * **The Goal:** I ensured the repository was clean, secrets were hidden, and the project had a professional `README.md` detailing the tech stack, the security architecture, and how to run the app locally.
  
* **My Prompt:** *"update the agent md whater updateion is req do it all"*
  * **The Goal:** I had the AI create a `TRIFORGE_AGENT.md` file. This acts as a set of strict guidelines so any future AI agents working on this codebase know exactly what design philosophies and tech stacks to adhere to.

* **My Prompt:** *"so tell now how to make it live"* and *"give me the key"*
  * **The Goal:** I asked for step-by-step guidance on deploying the Next.js app to Vercel, retrieved my local environment variables, and successfully launched the application to the public internet.

* **My Prompt:** *"Install our package Start by installing @vercel/speed-insights in your existing project..."*
  * **The Goal:** Finally, I pasted the Vercel Speed Insights documentation to the AI and had it automatically inject the analytics component into our root `layout.tsx` to track our real-world performance metrics.

---
*This log was actively maintained to provide complete transparency into the human-AI collaboration process that built this project.*
