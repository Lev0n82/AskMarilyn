#!/usr/bin/env bash
# =============================================================================
# AUTONOMOUS.ML MCP Agent — Linux / macOS Installer
# =============================================================================
# Usage:
#   bash deploy-unix.sh install    # install as systemd service (Linux)
#                                  # or launchd agent (macOS)
#   bash deploy-unix.sh uninstall  # remove the service
#   bash deploy-unix.sh start      # start the service
#   bash deploy-unix.sh stop       # stop the service
#   bash deploy-unix.sh status     # check service status
#   bash deploy-unix.sh run        # run in foreground (no service)
# =============================================================================

set -euo pipefail

ACTION="${1:-run}"
SERVICE_NAME="autonomous-ml-agent"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AGENT_DIR="$SCRIPT_DIR"
LOG_DIR="$AGENT_DIR/logs"
OS="$(uname -s)"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; RESET='\033[0m'
info()    { echo -e "${CYAN}[INFO]${RESET}  $*"; }
success() { echo -e "${GREEN}[OK]${RESET}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${RESET}  $*"; }
error()   { echo -e "${RED}[ERROR]${RESET} $*" >&2; exit 1; }

mkdir -p "$LOG_DIR"

check_node() {
  if ! command -v node &>/dev/null; then
    error "Node.js not found. Install Node.js 22+ from https://nodejs.org"
  fi
  local VER
  VER=$(node -e "process.stdout.write(process.version.replace('v',''))")
  local MAJOR
  MAJOR=$(echo "$VER" | cut -d. -f1)
  if [[ "$MAJOR" -lt 22 ]]; then
    error "Node.js $VER found but v22+ is required."
  fi
  success "Node.js $VER"
}

install_deps() {
  info "Installing agent dependencies..."
  cd "$AGENT_DIR"
  if [[ -f "package.json" ]]; then
    npm install --production 2>&1 | tail -3
    success "Agent dependencies installed"
  else
    warn "No package.json found in agent/ — skipping npm install"
  fi
}

install_linux() {
  info "Installing as systemd service: $SERVICE_NAME"
  local SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
  local NODE_BIN
  NODE_BIN=$(which node)

  sudo tee "$SERVICE_FILE" > /dev/null <<EOF
[Unit]
Description=AUTONOMOUS.ML MCP Agent for GRACE Platform
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$AGENT_DIR
ExecStart=$NODE_BIN $AGENT_DIR/src/index.js
Restart=on-failure
RestartSec=10
StandardOutput=append:$LOG_DIR/agent.log
StandardError=append:$LOG_DIR/agent-error.log
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

  sudo systemctl daemon-reload
  sudo systemctl enable "$SERVICE_NAME"
  sudo systemctl start "$SERVICE_NAME"
  success "Service installed and started"
  sudo systemctl status "$SERVICE_NAME" --no-pager
}

install_macos() {
  info "Installing as launchd agent: $SERVICE_NAME"
  local PLIST_DIR="$HOME/Library/LaunchAgents"
  local PLIST_FILE="$PLIST_DIR/com.grace.${SERVICE_NAME}.plist"
  local NODE_BIN
  NODE_BIN=$(which node)

  mkdir -p "$PLIST_DIR"
  cat > "$PLIST_FILE" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.grace.${SERVICE_NAME}</string>
  <key>ProgramArguments</key>
  <array>
    <string>${NODE_BIN}</string>
    <string>${AGENT_DIR}/src/index.js</string>
  </array>
  <key>WorkingDirectory</key>
  <string>${AGENT_DIR}</string>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>${LOG_DIR}/agent.log</string>
  <key>StandardErrorPath</key>
  <string>${LOG_DIR}/agent-error.log</string>
  <key>EnvironmentVariables</key>
  <dict>
    <key>NODE_ENV</key>
    <string>production</string>
  </dict>
</dict>
</plist>
EOF

  launchctl load "$PLIST_FILE"
  success "launchd agent installed and loaded"
}

case "$ACTION" in
  install)
    check_node
    install_deps
    if [[ "$OS" == "Darwin" ]]; then
      install_macos
    elif [[ "$OS" == "Linux" ]]; then
      install_linux
    else
      error "Unsupported OS: $OS. Use 'run' to start in foreground."
    fi
    ;;
  uninstall)
    if [[ "$OS" == "Darwin" ]]; then
      launchctl unload "$HOME/Library/LaunchAgents/com.grace.${SERVICE_NAME}.plist" 2>/dev/null || true
      rm -f "$HOME/Library/LaunchAgents/com.grace.${SERVICE_NAME}.plist"
    elif [[ "$OS" == "Linux" ]]; then
      sudo systemctl stop "$SERVICE_NAME" 2>/dev/null || true
      sudo systemctl disable "$SERVICE_NAME" 2>/dev/null || true
      sudo rm -f "/etc/systemd/system/${SERVICE_NAME}.service"
      sudo systemctl daemon-reload
    fi
    success "Service uninstalled"
    ;;
  start)
    if [[ "$OS" == "Darwin" ]]; then
      launchctl start "com.grace.${SERVICE_NAME}"
    elif [[ "$OS" == "Linux" ]]; then
      sudo systemctl start "$SERVICE_NAME"
    fi
    success "Service started"
    ;;
  stop)
    if [[ "$OS" == "Darwin" ]]; then
      launchctl stop "com.grace.${SERVICE_NAME}"
    elif [[ "$OS" == "Linux" ]]; then
      sudo systemctl stop "$SERVICE_NAME"
    fi
    success "Service stopped"
    ;;
  status)
    if [[ "$OS" == "Darwin" ]]; then
      launchctl list | grep "$SERVICE_NAME" || echo "Service not running"
    elif [[ "$OS" == "Linux" ]]; then
      sudo systemctl status "$SERVICE_NAME" --no-pager
    fi
    ;;
  run)
    check_node
    install_deps
    info "Starting AUTONOMOUS.ML agent in foreground..."
    info "Press Ctrl+C to stop"
    cd "$AGENT_DIR"
    node src/index.js
    ;;
  *)
    echo "Usage: $0 {install|uninstall|start|stop|status|run}"
    exit 1
    ;;
esac
