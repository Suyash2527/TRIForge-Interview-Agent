# TRIForge AI Interviewer - Agent Instructions

If you are an AI assistant, Copilot, or Agent working on this repository, you must adhere strictly to the following guidelines to maintain architectural integrity, aesthetic consistency, and security.

## 1. Core Architecture & Tech Stack
- **Framework:** Next.js 16 (App Router only). NEVER use Pages router conventions.
- **UI & Styling:** React 19 + Tailwind CSS v4. Do NOT install legacy versions of Tailwind.
- **AI Integration:** `@google/genai` SDK targeting `gemini-3.5-flash`.
- **Validation:** `zod` for strict API payload type-checking.
- **Testing:** `jest` + `@testing-library/react`.

## 2. Design Philosophy
- **Aesthetics:** The UI must remain highly professional, enterprise-grade, and minimalist (B2B SaaS style). 
- **Typography:** The absolute strict requirement for typography is **Times New Roman**. Do not inject modern sans-serif fonts (like Inter or Roboto) unless explicitly requested.
- **Colors:** Stick to high-contrast monochrome and slate/blue accents. "Don't make it funky."
- **Components:** Sharp edges (4px border-radius maximum), clean lines, and no excessive shadows.

## 3. Security Guidelines
- **API Endpoints:** Any new API endpoints MUST implement strict `zod` validation on incoming request bodies before processing data.
- **Secrets:** All API keys must be loaded from server-side environments (e.g., `process.env.GEMINI_API_KEY`). NEVER expose API keys to the client.
- **Next.js Config:** Ensure that any external domains (like Google GenAI endpoints) are explicitly allowed in the `Content-Security-Policy` within `next.config.js`.

## 4. Testing Protocols
- We use JSDOM for testing. Note that JSDOM does NOT natively support Next.js `NextResponse`, `Request`, `Response`, or `Headers`. 
- If you write new API route tests, ensure you utilize the polyfills provided in `jest.setup.ts`.
- Component tests should explicitly mock `HTMLElement.prototype.scrollIntoView` if the component uses auto-scrolling logic.

## 5. Next.js 16 Agent Rules
- See the auto-generated `AGENTS.md` file for Next.js specific breaking changes and routing conventions. Do not delete or overwrite the Next.js block in `AGENTS.md`.

---
*Follow these instructions at all times to maintain the standard of the TRIForge platform.*
