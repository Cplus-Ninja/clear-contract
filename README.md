🛡️ ClearContract: AI Legal Auditor for Small Business

**Built in 72 hours for the Springfield Vibe Coding Competition.**

ClearContract is a functional "Lawyer in your Pocket" designed specifically for the 20,000+ small business owners in Springfield, MO. We bridge the "Legal Gap" by providing instant, AI-driven contract audits that flag predatory clauses before they bankrupt a local business.

## 📍 The Problem
Small business owners often sign leases or service agreements without professional review because local legal fees range from **$250–$450/hour**. This lack of oversight costs small businesses an average of **$9,000 annually** in hidden fees, missed auto-renewal windows, and unfair maintenance liabilities.

## ✨ Key Features
- **🔍 AI Risk Auditor:** Scans PDFs/Images using GPT-4o-mini to identify "Poison Pills" across three categories: Hidden Costs, Termination Traps, and Liability Risks.
- **📖 Jargon Buster:** An interactive UI feature that identifies complex legalese (e.g., *Indemnification*, *Force Majeure*) and provides "Plain English" tooltips.
- **🤖 AI Negotiation Bot:** One-click generation of professional, firm emails to vendors requesting specific revisions to risky clauses found during the audit.
- **📊 Business Dashboard:** A persistent history of all past audits, powered by Supabase, allowing owners to track their vendor health over time.
- **💡 Pro Demo Mode:** A robust fallback system that ensures the app remains functional for judges even without active API credits.

## 🛠️ Tech Stack
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components:** Shadcn UI + Framer Motion (for micro-interactions)
- **Backend/DB:** Supabase (PostgreSQL + Row Level Security)
- **Storage:** Supabase Storage (for secure PDF/Image handling)
- **AI Engine:** OpenAI GPT-4o-mini
- **Deployment:** Vercel
- **IDE:** Cursor (Developed using Vibe Coding principles)

## 🧠 Technical Challenges & "Vibe" Wins
One of the primary hurdles was **Server-Side PDF Parsing**. We initially faced `DOMMatrix` errors due to browser-only libraries. We successfully pivoted to a legacy `pdf-parse` implementation to extract clean text in a Node.js environment, ensuring the AI receives high-fidelity data for analysis.

## 🚀 The Roadmap
*   **v2.0:** Collaborative Negotiation — Invite vendors to settle terms directly inside the secure app portal.
*   **v3.0:** Financial Integration — Connect with QuickBooks to automatically flag hidden fees in monthly invoices.
*   **v4.0:** Legal Marketplace — A direct pipeline to Greene County attorneys for final signatures and complex litigation needs.

**⚠️ Disclaimer:** *ClearContract is an AI-powered educational tool for general information purposes only. It is not a substitute for advice from a licensed attorney. Always consult a lawyer before signing legal documents.*
