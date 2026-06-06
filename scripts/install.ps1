#Requires -Version 5.1
<#
.SYNOPSIS
    CSC-GRACE Platform — Single-Click Installer (Windows)

.DESCRIPTION
    Installs and configures the CSC-GRACE / AskMarilyn platform on Windows.
    What this script does:
      1. Checks prerequisites (Node.js >= 22, pnpm >= 9)
      2. Installs Node.js via winget if missing
      3. Installs pnpm if missing
      4. Runs pnpm install
      5. Copies .env.template -> .env and prompts for required values
      6. Runs pnpm db:push to apply the database schema
      7. Optionally seeds GRACE Academy modules
      8. Starts the dev server

.PARAMETER NonInteractive
    Skip all prompts and use .env.template defaults.

.EXAMPLE
    .\scripts\install.ps1
    .\scripts\install.ps1 -NonInteractive

.NOTES
    Run PowerShell as Administrator for best results.
    Execution policy: Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
#>

param(
    [switch]$NonInteractive
)

$ErrorActionPreference = "Stop"

# ── Colours ──────────────────────────────────────────────────────────────────
function Write-Info    { param($Msg) Write-Host "[INFO]  $Msg" -ForegroundColor Cyan }
function Write-Success { param($Msg) Write-Host "[OK]    $Msg" -ForegroundColor Green }
function Write-Warn    { param($Msg) Write-Host "[WARN]  $Msg" -ForegroundColor Yellow }
function Write-Err     { param($Msg) Write-Host "[ERROR] $Msg" -ForegroundColor Red; exit 1 }

$ScriptDir  = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectDir = Split-Path -Parent $ScriptDir

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║        CSC-GRACE Platform — Installer v1.2               ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Set-Location $ProjectDir

# ── 1. Check / install Node.js ────────────────────────────────────────────────
Write-Info "Checking Node.js..."
$NodeOk = $false
try {
    $NodeVer = (node -e "process.stdout.write(process.version.replace('v',''))") 2>$null
    $NodeMajor = [int]($NodeVer -split '\.')[0]
    if ($NodeMajor -ge 22) {
        Write-Success "Node.js $NodeVer"
        $NodeOk = $true
    } else {
        Write-Warn "Node.js $NodeVer found but v22+ required."
    }
} catch { Write-Warn "Node.js not found." }

if (-not $NodeOk) {
    Write-Info "Installing Node.js 22 via winget..."
    try {
        winget install --id OpenJS.NodeJS.LTS --version 22 --silent --accept-package-agreements --accept-source-agreements
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        Write-Success "Node.js $(node -v) installed"
    } catch {
        Write-Err "Could not install Node.js automatically. Please install Node.js 22+ from https://nodejs.org and re-run this script."
    }
}

# ── 2. Check / install pnpm ───────────────────────────────────────────────────
Write-Info "Checking pnpm..."
$PnpmOk = $false
try {
    $PnpmVer = (pnpm -v) 2>$null
    $PnpmMajor = [int]($PnpmVer -split '\.')[0]
    if ($PnpmMajor -ge 9) {
        Write-Success "pnpm $PnpmVer"
        $PnpmOk = $true
    } else {
        Write-Warn "pnpm $PnpmVer found but v9+ required."
    }
} catch { Write-Warn "pnpm not found." }

if (-not $PnpmOk) {
    Write-Info "Installing pnpm..."
    npm install -g pnpm@latest
    Write-Success "pnpm $(pnpm -v) installed"
}

# ── 3. Install dependencies ───────────────────────────────────────────────────
Write-Info "Installing project dependencies..."
pnpm install --frozen-lockfile 2>&1 | Select-Object -Last 5
Write-Success "Dependencies installed"

# ── 4. Environment configuration ─────────────────────────────────────────────
$EnvFile      = Join-Path $ProjectDir ".env"
$TemplateFile = Join-Path $ProjectDir ".env.template"

if (-not (Test-Path $TemplateFile)) {
    Write-Err ".env.template not found at $TemplateFile"
}

if (Test-Path $EnvFile) {
    Write-Warn ".env already exists. Skipping environment setup (delete .env to reconfigure)."
} else {
    Write-Info "Setting up environment variables..."
    Copy-Item $TemplateFile $EnvFile

    if (-not $NonInteractive) {
        Write-Host ""
        Write-Host "Required environment values:" -ForegroundColor White
        Write-Host "(Press Enter to keep the template default, or type a new value)" -ForegroundColor Gray
        Write-Host ""

        function Prompt-Env {
            param([string]$Key, [string]$Label)
            $Content = Get-Content $EnvFile
            $Line = $Content | Where-Object { $_ -match "^${Key}=" } | Select-Object -First 1
            $Default = if ($Line) { $Line -replace "^${Key}=", "" } else { "" }
            $Prompt = if ($Default) { "${Label} [${Default}]" } else { "${Label} [<required>]" }
            $Val = Read-Host $Prompt
            if ($Val) {
                $Content = $Content -replace "^${Key}=.*", "${Key}=${Val}"
                Set-Content $EnvFile $Content
            }
        }

        Prompt-Env "DATABASE_URL"                "Database URL (MySQL/TiDB)"
        Prompt-Env "JWT_SECRET"                  "JWT Secret (min 32 chars)"
        Prompt-Env "VITE_APP_ID"                 "Manus OAuth App ID"
        Prompt-Env "OAUTH_SERVER_URL"            "Manus OAuth Server URL"
        Prompt-Env "VITE_OAUTH_PORTAL_URL"       "Manus OAuth Portal URL"
        Prompt-Env "BUILT_IN_FORGE_API_URL"      "Manus Forge API URL"
        Prompt-Env "BUILT_IN_FORGE_API_KEY"      "Manus Forge API Key (server)"
        Prompt-Env "VITE_FRONTEND_FORGE_API_KEY" "Manus Forge API Key (frontend)"
        Prompt-Env "ADO"                         "Azure DevOps Personal Access Token"
        Write-Host ""
        Write-Host "Optional GRACE LLM settings (press Enter to skip):" -ForegroundColor Gray
        Prompt-Env "GRACE_LLM_PROVIDER"          "LLM Provider [manus|azure_openai|ollama|custom]"
        Prompt-Env "GRACE_OLLAMA_ENDPOINT"       "Ollama endpoint (if using ollama)"
        Prompt-Env "GRACE_AZURE_OPENAI_ENDPOINT" "Azure OpenAI endpoint (if using azure_openai)"
    }

    Write-Success ".env configured"
}

# ── 5. Database schema ────────────────────────────────────────────────────────
Write-Info "Applying database schema (pnpm db:push)..."
try {
    pnpm db:push 2>&1 | Select-Object -Last 10
    Write-Success "Database schema applied"
} catch {
    Write-Warn "db:push reported warnings — check output above. Continuing..."
}

# ── 6. Seed GRACE Academy modules (optional) ─────────────────────────────────
if (-not $NonInteractive) {
    $Seed = Read-Host "Seed GRACE Academy learning modules? [y/N]"
    if ($Seed -match '^[Yy]$') {
        Write-Info "Seeding GRACE Academy modules..."
        node scripts/seed-grace-modules.mjs
        Write-Success "Modules seeded"
    }
}

# ── 7. Done ───────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  Installation complete!                                  ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "  Start dev server:  pnpm dev"
Write-Host "  Production build:  pnpm build && pnpm start"
Write-Host "  Run tests:         pnpm test"
Write-Host "  Portal URL:        http://localhost:3000"
Write-Host ""
Write-Host "  GRACE portal:      http://localhost:3000/grace" -ForegroundColor Cyan
Write-Host "  HITL queue:        http://localhost:3000/grace/hitl" -ForegroundColor Cyan
Write-Host "  Test suites:       http://localhost:3000/grace/suites" -ForegroundColor Cyan
Write-Host ""

if (-not $NonInteractive) {
    $Start = Read-Host "Start the development server now? [Y/n]"
    if ($Start -notmatch '^[Nn]$') {
        Write-Info "Starting dev server..."
        pnpm dev
    }
}
