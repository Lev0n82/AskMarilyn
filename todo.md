# Hansen Platform - Project TODO

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
- [x] Final checkpoint and delivery

## Phase 7: AI Provider Flexibility
- [x] Implement multi-provider AI service (Manus LLM, Ollama, vLLM, OpenAI-compatible)
- [x] Wire demo to use Manus built-in LLM for chat responses
- [x] Support configurable provider selection per widget (Manus, Ollama, vLLM, Custom OpenAI)
- [x] Support custom endpoint URL for any OpenAI-format API
- [x] Support optional API key for authenticated providers
- [x] Update widget config UI with provider dropdown and connection test
- [x] Fallback logic: if configured provider fails, show graceful error

## Phase 8: Voice Assistant Eye Overlay
- [x] Configurable voice assistant eye overlay (semi-transparent, ambient AI presence)
- [x] Admin-configurable activation mode (auto with overlay, separate toggle, always visible)
- [x] Admin-configurable opacity/prominence (idle 10-50%, active opacity, size, position)
- [x] Admin-configurable scope (accessibility-only, full AI chat, or both)
- [x] Admin-configurable language (auto-detect, pre-selected list, user-chosen)
- [x] Speech recognition (Web Speech API) with multi-language support
- [x] Text-to-speech response in user's language of choice
- [x] Visual eye animation states (idle pulse, listening, speaking, thinking)
- [x] Integration with RAG knowledge base for intelligent responses
- [x] Integration with accessibility commands (font size, contrast, navigation)
- [x] Admin configuration panel in dashboard for all voice assistant settings

## Phase 9: Demo, Pricing, Onboarding, Live Preview
- [x] Fix "View Demo" button — create functional demo page with all three theme previews
- [x] Demo shows interactive widget in Liquid Glass, Warm Neutral, and Aurora Soft themes
- [x] Demo widgets respond with AI (using Manus LLM)
- [x] Pricing page at /pricing route
- [x] Always-free tier clearly marked (not a trial)
- [x] Hosted AI service plans (hosted Ollama + RAG pipeline packages)
- [x] Pro and Enterprise tiers with hosted AI options
- [x] Link to hosted AI service plan from pricing
- [x] Onboarding wizard for first-run users
- [x] Step 1: Connect AI provider
- [x] Step 2: Upload first document
- [x] Step 3: Generate embed snippet
- [x] Complete in under 3 minutes
- [x] Widget live preview in configuration page
- [x] Real-time preview of Liquid Glass theme
- [x] Real-time preview of Warm Neutral theme
- [x] Real-time preview of Aurora Soft theme
- [x] Preview updates as settings change
