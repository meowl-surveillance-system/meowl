#
# Cassandra Installation Script
# Reference: http://cassandra.apache.org/download/
#

PARENT_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")"; pwd -P )
NGINX_RTMP_IP="35.239.238.204"
NGINX_RTMP_PORT="19350"
CERT_PATH="/etc/ssl/certs"
STUNNEL_CONF_FILE="foreground = yes
debug = 5

[my-encryption-service]
client = yes
accept = 1234
connect = ${NGINX_RTMP_IP}:${NGINX_RTMP_PORT}
CAfile = ${CERT_PATH}/meowl_nginx.crt
verify = 3"
MEOWL_NGINX_CERT="-----BEGIN CERTIFICATE-----
MIIDKDCCAhCgAwIBAgIUMJnIvEqdHYlvuFesy6WFUMwNHEYwDQYJKoZIhvcNAQEL
BQAwPjELMAkGA1UEBhMCVVMxCzAJBgNVBAgMAk5ZMSIwIAYDVQQKDBlNZW93bC1T
dXJ2ZWlsbGFuY2UtU3lzdGVtMB4XDTIwMDIyNTAwNDY1MVoXDTMwMDIyMjAwNDY1
MVowPjELMAkGA1UEBhMCVVMxCzAJBgNVBAgMAk5ZMSIwIAYDVQQKDBlNZW93bC1T
dXJ2ZWlsbGFuY2UtU3lzdGVtMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKC
AQEAuAyerHVUxX4nOANv+YuAif1QQEcP4oeO+0VM7eqz00/FWlTsPKe9iTZCgRvS
1tizTgbkt3jbl8iFSe0+R5f146A7wL+g9kbscVMiFLCl3ZBWK8DZs32180q/FPoS
c3VgbU7ljh5GKyi3v/vPLJcPxa5grSMM67xAxlUAJHM7pWLGtIei37DdNrSjzONa
EK0DlJ1Ld5DwODtZlQc8kIVvrAovnmjqY6yghBmii0fbzFszjSUzkbOlGJGT/tGU
5T4Ea8UORUhaRON58Lp1+TXQnxvadd3OWtTfh237gzi+HBFp8jzI8Ex/2R7h2O3b
pBYNatiOwx6ySGIfE3s6Kn1MqwIDAQABox4wHDAaBgNVHREEEzARhwR/AAABggls
b2NhbGhvc3QwDQYJKoZIhvcNAQELBQADggEBAJzdrULgRUCVB3cDvEI+SFjjWnVq
+vrwTnDw5Z+E1vulknqoooUFifyBdhLtd6q2GAr3mf1j4RriksR1HaRXmAiOLf4B
1nVuPWpNwuJGwXs+VB/G9V8R4QerqfKJTDKWtkikMJAXWENqYqTVBL3Z4M/HATWy
AktY2R5aCXC2QRhXYkXk6RTmdpecUyLPO39YTLgEeaU1ggAhPWBC9Y3sWKW3Fv/H
sS+vSZD4u9vFD/cGsUhtMild/xeuz8/tSykzI5pgSS5qVj4Y7G1uif4+4FhbRaLG
2i8PZECOqKceqcZyyR6AjfV2rSmKgFDCorurHzo3AmHD0rm8dtuJM5mLIA0=
-----END CERTIFICATE-----"

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
  sudo apt-get -y install librtmp-dev
  cd ${PARENT_PATH}/../../src/db/cassandra
  python3 -m venv venv
  source ./venv/bin/activate
  pip install --upgrade pip
  pip install -r requirements.txt
}

create_stunnel_config_file() {
  echo "${STUNNEL_CONF_FILE}" | sudo tee /etc/stunnel/stunnel.conf
}

copy_cert() {
  echo "${MEOWL_NGINX_CERT}" | sudo tee ${CERT_PATH}/meowl_nginx.crt 
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
  create_stunnel_config_file
  copy_cert
}

