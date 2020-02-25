#
# Cassandra Installation Script
# Reference: http://cassandra.apache.org/download/
#

PARENT_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")"; pwd -P )

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
  sudo sed -i 's/# JVM_OPTS="$JVM_OPTS -Djava.rmi.server.hostname=<public name>"/JVM_OPTS="$JVM_OPTS -Djava.rmi.server.hostname=127.0.0.1"/' /etc/cassandra/cassandra-env.sh
}

# Install python driver
install_python_driver() {
  sudo apt-get -y install python3-pip
  sudo apt-get -y install python3-venv
  cd ${PARENT_PATH}/../../src/db/cassandra
  python3 -m venv venv
  source ./venv/bin/activate
  pip install -r requirements.txt
}

# Complete Installation for Cassandra
install_cassandra() {
  sudo apt-get update
  install_java_environment
  install_curl
  echo "Adding Cassandra repository to system..."
  echo "deb http://www.apache.org/dist/cassandra/debian 311x main" | sudo tee -a /etc/apt/sources.list.d/cassandra.sources.list
  echo "Adding the Apache Cassandra repository keys..."
  curl https://www.apache.org/dist/cassandra/KEYS | sudo apt-key add -
  sudo apt-get update
  echo "Installing Cassandra..."
  sudo apt-get -y install cassandra
  modify_server_hostname
  install_python_driver
}

