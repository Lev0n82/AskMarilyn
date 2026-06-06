#!/usr/bin/env bash
# =============================================================================
# CSC-GRACE / AskMarilyn — Single-Click Installer (Linux / macOS)
# =============================================================================
# Usage:
#   bash scripts/install.sh                  # interactive
#   bash scripts/install.sh --non-interactive # use .env.template defaults
#
# What this script does:
#   1. Checks prerequisites (Node.js ≥ 22, pnpm ≥ 9)
#   2. Installs Node.js via nvm if missing
#   3. Installs pnpm if missing
#   4. Runs pnpm install
#   5. Copies .env.template → .env and prompts for required values
#   6. Runs pnpm db:push to apply the database schema
#   7. Optionally seeds GRACE Academy modules
#   8. Starts the dev server
# =============================================================================

set -euo pipefail

# ── Colours ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

info()    { echo -e "${CYAN}[INFO]${RESET}  $*"; }
success() { echo -e "${GREEN}[OK]${RESET}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${RESET}  $*"; }
error()   { echo -e "${RED}[ERROR]${RESET} $*" >&2; exit 1; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
NON_INTERACTIVE=false

for arg in "$@"; do
  [[ "$arg" == "--non-interactive" ]] && NON_INTERACTIVE=true
done

echo ""
echo -e "${BOLD}╔══════════════════════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}║        CSC-GRACE Platform — Installer v1.2               ║${RESET}"
echo -e "${BOLD}╚══════════════════════════════════════════════════════════╝${RESET}"
echo ""

cd "$PROJECT_DIR"

# ── 1. Check / install Node.js ────────────────────────────────────────────────
info "Checking Node.js..."
if command -v node &>/dev/null; then
  NODE_VER=$(node -e "process.stdout.write(process.version.replace('v',''))")
  NODE_MAJOR=$(echo "$NODE_VER" | cut -d. -f1)
  if [[ "$NODE_MAJOR" -lt 22 ]]; then
    warn "Node.js $NODE_VER found but v22+ is required. Installing via nvm..."
    INSTALL_NODE=true
  else
    success "Node.js $NODE_VER"
    INSTALL_NODE=false
  fi
else
  warn "Node.js not found. Installing via nvm..."
  INSTALL_NODE=true
fi

if [[ "$INSTALL_NODE" == "true" ]]; then
  if ! command -v nvm &>/dev/null; then
    info "Installing nvm..."
    curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    # shellcheck disable=SC1090
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  fi
  nvm install 22 && nvm use 22 && nvm alias default 22
  success "Node.js $(node -v) installed via nvm"
fi

# ── 2. Check / install pnpm ───────────────────────────────────────────────────
info "Checking pnpm..."
if command -v pnpm &>/dev/null; then
  PNPM_VER=$(pnpm -v)
  PNPM_MAJOR=$(echo "$PNPM_VER" | cut -d. -f1)
  if [[ "$PNPM_MAJOR" -lt 9 ]]; then
    warn "pnpm $PNPM_VER found but v9+ is required. Upgrading..."
    npm install -g pnpm@latest
  else
    success "pnpm $PNPM_VER"
  fi
else
  info "Installing pnpm..."
  npm install -g pnpm@latest
  success "pnpm $(pnpm -v) installed"
fi

# ── 3. Install dependencies ───────────────────────────────────────────────────
info "Installing project dependencies..."
pnpm install --frozen-lockfile 2>&1 | tail -5
success "Dependencies installed"

# ── 4. Environment configuration ─────────────────────────────────────────────
ENV_FILE="$PROJECT_DIR/.env"
TEMPLATE_FILE="$PROJECT_DIR/.env.template"

if [[ ! -f "$TEMPLATE_FILE" ]]; then
  error ".env.template not found at $TEMPLATE_FILE"
fi

if [[ -f "$ENV_FILE" ]]; then
  warn ".env already exists. Skipping environment setup (delete .env to reconfigure)."
else
  info "Setting up environment variables..."
  cp "$TEMPLATE_FILE" "$ENV_FILE"

  if [[ "$NON_INTERACTIVE" == "false" ]]; then
    echo ""
    echo -e "${BOLD}Required environment values:${RESET}"
    echo -e "(Press Enter to keep the template default, or type a new value)"
    echo ""

    prompt_env() {
      local KEY="$1"
      local LABEL="$2"
      local DEFAULT
      DEFAULT=$(grep "^${KEY}=" "$ENV_FILE" | cut -d= -f2- | sed 's/^[[:space:]]*//')
      echo -ne "${CYAN}${LABEL}${RESET} [${DEFAULT:-<required>}]: "
      read -r VAL
      if [[ -n "$VAL" ]]; then
        # Replace the line in .env
        sed -i.bak "s|^${KEY}=.*|${KEY}=${VAL}|" "$ENV_FILE" && rm -f "${ENV_FILE}.bak"
      fi
    }

    prompt_env "DATABASE_URL"                "Database URL (MySQL/TiDB)"
    prompt_env "JWT_SECRET"                  "JWT Secret (min 32 chars)"
    prompt_env "VITE_APP_ID"                 "Manus OAuth App ID"
    prompt_env "OAUTH_SERVER_URL"            "Manus OAuth Server URL"
    prompt_env "VITE_OAUTH_PORTAL_URL"       "Manus OAuth Portal URL"
    prompt_env "BUILT_IN_FORGE_API_URL"      "Manus Forge API URL"
    prompt_env "BUILT_IN_FORGE_API_KEY"      "Manus Forge API Key (server)"
    prompt_env "VITE_FRONTEND_FORGE_API_KEY" "Manus Forge API Key (frontend)"
    prompt_env "ADO"                         "Azure DevOps Personal Access Token"
    echo ""
    echo -e "${BOLD}Optional GRACE LLM settings (press Enter to skip):${RESET}"
    prompt_env "GRACE_LLM_PROVIDER"          "LLM Provider [manus|azure_openai|ollama|custom]"
    prompt_env "GRACE_OLLAMA_ENDPOINT"       "Ollama endpoint (if using ollama)"
    prompt_env "GRACE_AZURE_OPENAI_ENDPOINT" "Azure OpenAI endpoint (if using azure_openai)"
  fi

  success ".env configured"
fi

# ── 5. Database schema ────────────────────────────────────────────────────────
info "Applying database schema (pnpm db:push)..."
if pnpm db:push 2>&1 | tail -10; then
  success "Database schema applied"
else
  warn "db:push reported warnings — check output above. Continuing..."
fi

# ── 6. Seed GRACE Academy modules (optional) ─────────────────────────────────
if [[ "$NON_INTERACTIVE" == "false" ]]; then
  echo -ne "${CYAN}Seed GRACE Academy learning modules? [y/N]:${RESET} "
  read -r SEED_ANSWER
  if [[ "$SEED_ANSWER" =~ ^[Yy]$ ]]; then
    info "Seeding GRACE Academy modules..."
    node scripts/seed-grace-modules.mjs && success "Modules seeded"
  fi
fi

# ── 7. Done ───────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}╔══════════════════════════════════════════════════════════╗${RESET}"
echo -e "${GREEN}${BOLD}║  Installation complete!                                  ║${RESET}"
echo -e "${GREEN}${BOLD}╚══════════════════════════════════════════════════════════╝${RESET}"
echo ""
echo -e "  Start dev server:  ${BOLD}pnpm dev${RESET}"
echo -e "  Production build:  ${BOLD}pnpm build && pnpm start${RESET}"
echo -e "  Run tests:         ${BOLD}pnpm test${RESET}"
echo -e "  Portal URL:        ${BOLD}http://localhost:3000${RESET}"
echo ""
echo -e "  GRACE portal:      ${BOLD}http://localhost:3000/grace${RESET}"
echo -e "  HITL queue:        ${BOLD}http://localhost:3000/grace/hitl${RESET}"
echo -e "  Test suites:       ${BOLD}http://localhost:3000/grace/suites${RESET}"
echo ""

if [[ "$NON_INTERACTIVE" == "false" ]]; then
  echo -ne "${CYAN}Start the development server now? [Y/n]:${RESET} "
  read -r START_ANSWER
  if [[ ! "$START_ANSWER" =~ ^[Nn]$ ]]; then
    info "Starting dev server..."
    pnpm dev
  fi
fi
