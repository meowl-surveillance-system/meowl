#
# Cassandra Installation Script
# Reference: http://cassandra.apache.org/download/
#
# Install Java 8 if not installed
install_java_environment() {
  command -v java >/dev/null 2>&1;
  if [[ $? -eq 1 ]]; then
    echo "Java not installed..."
    echo "Installing java development kit..."
    sudo apt-get -y install openjdk-8-jdk
  fi
}

# Install Curl if not installed
install_curl() {
  command -v curl > /dev/null 2>&1;
  if [[ $? -eq 1 ]]; then
    echo "Curl not installed"
    echo "Installing Curl..."
    sudo apt-get -y install curl
  fi
}

# Modify server hostname for connection
modify_server_hostname() {
  echo "Modifying server hostname..."
  sudo sed -i 's/<public name>/127.0.0.1/' /etc/cassandra/cassandra-env.sh
}


install_python_driver() {
  command -v pip3 > /dev/null 2>&1;
  if [[ $? -eq 1 ]]; then
    echo "Installing pip..."
    sudo apt-get -y install python3-pip
  fi
  echo "Installing cassandra-driver..."
  pip install cassandra-driver
}

# Complete Installation for Cassandra
install_cassandra() {
  install_java_environment
  install_curl
  sudo apt-get update
  echo "Adding Cassandra repository to system..."
  echo "deb http://www.apache.org/dist/cassandra/debian 311x main" | sudo tee -a /etc/apt/sources.list.d/cassandra.sources.list
  echo "Adding the Apache Cassandra repository keys..."
  curl https://www.apache.org/dist/cassandra/KEYS | sudo apt-key add -
  sudo apt-get update
  echo "Installing Cassandra..."
  sudo apt-get install -y cassandra
  modify_server_hostname
  install_python_driver
}

