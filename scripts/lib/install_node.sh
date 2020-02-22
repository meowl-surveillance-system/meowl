# Install Node and necessary frameworks/packages
PARENT_PATH=$(
  cd "$(dirname "${BASH_SOURCE[0]}")"
  pwd -P
)
# Install Node.js on Arch Linux
install_node() {
  command -v node >/dev/null 2>&1 || {
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash
    source ~/.nvm/nvm.sh
    nvm install 12.15.0
  }
}

# Install dependencies for notification folder
init_notif() {
  cd ${PARENT_PATH}/../../src/notifications && npm install && cd -
}

init_react() {
  cd ${PARENT_PATH}/../../src/web/client && npm install && cd -
}

#Install node and initializes configuration for Node related apps
install_node_all() {
  echo "Installing node and front-end apps..."
  install_node
  init_notif
  init_react
}
