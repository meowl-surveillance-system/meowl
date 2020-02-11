# Install Node and necessary frameworks/packages

# Install Node.js on Arch Linux
install_node() {
  command -v node >/dev/null 2>&1 || {
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash
    source ~/.nvm/nvm.sh
    nvm install 12.15.0
  };
}

# Install dependencies for notification folder
init_notif() {
  cd ../src/notifications && npm install && cd -
}

init_react() {
  cd ../src/web && npm install -g create-react-app && create-react-app client && cd -
}

#Install node and initializes configuration for Node related apps
install_node_all() {
  install_node;
  init_notif;
  init_react;
}