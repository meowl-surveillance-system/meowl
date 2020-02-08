#
# Installation Script for Apache Kafka
# Reference: https://www.digitalocean.com/community/tutorials/how-to-install-apache-kafka-on-ubuntu-18-04
#

KAFKA_CONFIG_PATH="/usr/local/kafka/config"

# Download and extract kafka files
download_and_extract_kafka_binaries() {
  curl "http://mirror.metrocast.net/apache/kafka/2.4.0/kafka_2.12-2.4.0.tgz" -o /tmp/kafka.tgz
  echo "creating directory /usr/local/kafka and changing into it..."
  sudo mkdir /usr/local/kafka && cd /usr/local/kafka
  sudo tar -xzf /tmp/kafka.tgz --strip 1
  echo "returning to previous directory..."
  cd -
}

# Install OpenJDK 8
install_openJDK() {
  sudo apt install openjdk-8-jdk 
}

# Enables topic deletion 
enable_topic_deletion() {
  grep -q "delete.topic.enable = true" ${KAFKA_CONFIG_PATH}/server.properties;
  if [[ $? -eq 1 ]]; then
    echo "delete.topic.enable = true" | sudo tee -a ${KAFKA_CONFIG_PATH}/server.properties
  fi
}

# Complete installation and configuration of Kafka
install_kafka() {
  command -v java >/dev/null 2>&1 || { install_openJDK; }
  echo "Downloading and extracting kafka binaries..."
  download_and_extract_kafka_binaries
  echo "Enabling topic deletion..."
  enable_topic_deletion
  echo "Kafka successfully installed"
}
