# AskMarilyn Platform - Project TODO

## Phase 1: Foundation & Auth
- [x] Database schema (users with roles: admin/reseller/user, tenants, widgets, documents, conversations, messages)
- [x] Standalone JWT + bcrypt authentication (register, login, logout, password reset)
- [x] Role-based access control (admin, reseller, user)
- [x] Global theming and font setup (Inter font, indigo brand colors)

## Phase 2: Dashboard
- [x] Dashboard layout with sidebar navigation
- [x] Sidebar sections: Overview KPIs, Widgets, Conversations, Knowledge Base, Accessibility, Integrations, Settings
- [x] Overview KPIs page with live metrics

## Phase 3: Ollama & RAG
- [x] Ollama API integration (browse models, test connection, configure endpoint)
- [x] RAG knowledge base: document upload (PDF, DOCX, TXT, CSV)
- [x] Document chunking and storage
- [x] Retrieval pipeline for AI responses

## Phase 4: Chat Widget
- [x] Embeddable chat widget with 3-state progressive disclosure (Pill → Card → Panel)
- [x] Pill state: ~140x48px floating button
- [x] Card state: 280x200px with suggestion chips
- [x] Panel state: 380x520px full chat with conversation history
- [x] Multi-channel communication bar (WhatsApp, Phone, Email) - shown only when AI qualifies user or user requests help
- [x] Widget snippet generator (single JavaScript line)
- [x] Three theme options: Liquid Glass, Warm Neutral, Aurora Soft

## Phase 5: Accessibility & White-Label
- [x] Accessibility overlay panel (font size, contrast, dyslexia font, stop animations, keyboard nav, reading guide, link highlighting, screen reader/TTS)
- [x] Conversational AI endpoint (RAG context retrieval + Ollama streaming)
- [x] White-label tenant branding (logo, colors, custom domain)
- [x] Reseller portal view
- [x] Single-line embed code generation

## Phase 6: Testing & Delivery
- [x] Vitest unit tests for auth procedures (7 tests passing)
- [x] Vitest unit tests for widget router (6 tests passing)
- [x] End-to-end flow verification (manual via dev server preview)
- [ ] Final checkpoint and delivery
