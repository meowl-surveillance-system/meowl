# Install Node and necessary frameworks/packages

# Install Node.js on Linux as root on RHEL, CentOS, CloudLinux, or Fedora
install_node() {
  command -v node >/dev/null 2>&1 || {
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash
    source ~/.nvm.sh
    nvm install node
  };
}

# Install dependencies for notification folder
init_notif() {
  cd ../../src/notifications && sudo npm install 
}

#Install node and initializes configuration for Node related apps
install_node_all() {
  install_node;
  init_notif;
}