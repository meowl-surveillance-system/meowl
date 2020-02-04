#
# Installation Script for Apache Kafka
# Reference: https://www.digitalocean.com/community/tutorials/how-to-install-apache-kafka-on-ubuntu-18-04
#

UNIT_FILE_CONTENT_FOR_ZOOKEEPER="[Unit]
Requires=network.target remote-fs.target
After=network.target remote-fs.target

[Service]
Type=simple
User=kafka
ExecStart=/home/kafka/kafka/bin/zookeeper-server-start.sh /home/kafka/kafka/config/zookeeper.properties
ExecStop=/home/kafka/kafka/bin/zookeeper-server-stop.sh
Restart=on-abnormal

[Install]
WantedBy=multi-user.target"

UNIT_FILE_CONTENT_FOR_KAFKA="[Unit]
Requires=zookeeper.service
After=zookeeper.service

[Service]
Type=simple
User=kafka
ExecStart=/bin/sh -c '/home/kafka/kafka/bin/kafka-server-start.sh /home/kafka/kafka/config/server.properties > /home/kafka/kafka/kafka.log 2>&1'
ExecStop=/home/kafka/kafka/bin/kafka-server-stop.sh
Restart=on-abnormal

[Install]
WantedBy=multi-user.target"

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
  echo "\ndelete.topic.enable = true" >> ~/kafka/config/server.properties
}


# Create systemd unit files for Kafka services such as starting, stopping, and restarting Kafka
# consistently with other services
create_unit_files() {
  echo ${UNIT_FILE_CONTENT_FOR_ZOOKEEPER} >> /etc/systemd/system/zookeeper.service
  echo ${UNIT_FILE_CONTENT_FOR_KAFKA} >> /etc/systemd/system/kafka.service
}

# Complete installation and configuration of Kafka
install_kafka() {
  command -v java >/dev/null 2>&1 || { install_openJDK; }
  download_and_extract_kafka_binaries
  enable_topic_deletion
  create_unit_file_for_zookeeper
  create_unit_file_for_kafka
}
