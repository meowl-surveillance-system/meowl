#
# Installation Script for Apache Kafka
# Reference: https://www.digitalocean.com/community/tutorials/how-to-install-apache-kafka-on-ubuntu-18-04
#

# Download and extract kafka files
download_and_extract_kafka_binaries() {
  curl "http://mirror.metrocast.net/apache/kafka/2.4.0/kafka_2.12-2.4.0.tgz" -o ~/Downloads/kafka.tgz
  mkdir ~/kafka && cd ~/kafka
  tar -xzf ~/Downloads/kafka.tgz --strip 1
}

# Install OpenJDK 8
install_openJDK() {
  apt install openjdk-8-jdk 
}

# Enables topic deletion 
enable_topic_deletion() {
  grep -q "delete.topic.enable = true" ~/kafka/config/server.properties;
  if [[ $? -eq 1 ]]; then
    sudo echo "delete.topic.enable = true" >> ~/kafka/config/server.properties
  fi
}

# Add Kafka to PATH
add_kafka_to_path() {
  sudo echo "export PATH=/home/goat/kafka/bin:\$PATH" >> ~/.bashrc
}

# Complete installation and configuration of Kafka
install_kafka() {
  command -v java >/dev/null 2>&1 || { install_openJDK; }
  echo "Downloading and extracting kafka binaries..."
  download_and_extract_kafka_binaries
  echo "Enabling topic deletion..."
  enable_topic_deletion
  echo "Adding Kafka to PATH..."
  add_kafka_to_path
  echo "Kafka successfully installed"
}
