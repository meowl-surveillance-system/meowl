#!/bin/bash
#
# Install Node and necessary frameworks/packages

# Install Node.js on Linux as root on RHEL, CentOS, CloudLinux, or Fedora
install_node() {
  if which node > /dev/null
    then
      echo "Node is already installed"
  else
    curl -sL https://rpm.nodesource.com/setup_13.x | bash -
}

# Install dependencies for notification folder
init_notif() {
  cd ../../src/notifications && sudo npm install 
}