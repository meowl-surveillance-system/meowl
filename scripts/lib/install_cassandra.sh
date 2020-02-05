#
# Cassandra Installation Script
# Reference: http://cassandra.apache.org/download/
#
# Install Java 8 if not installed
install_java_environment() {
  command -v java >/dev/null 2>&1;
  if [[$? -eq 1]]; then
    echo "Java not installed..."
    echo "Installing java runtime..."
    sudo apt-get -y install openjdk-8-jre
    echo "Installing java development kit..."
    sudo apt-get -y install openjdk-8-jdk
  fi
}

# Complete Installation for Cassandra
install_cassandra() {
  install_java_environment;
  echo "Adding Cassandra repository to system..."
  echo "deb http://www.apache.org/dist/cassandra/debian 311x main" | sudo tee -a /etc/apt/sources.list.d/cassandra.sources.list
  echo "Adding the Apache Cassandra repository keys..."
  curl https://www.apache.org/dist/cassandra/KEYS | sudo apt-key add -
  sudo apt-get update
  echo "Installing Cassandra..."
  sudo apt-get install -y cassandra
}
