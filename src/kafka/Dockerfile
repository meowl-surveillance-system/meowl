#TODO(chc5): Test this Docker container alongside OpenCV container
FROM ubuntu:18.04

WORKDIR /kafka

# Install required packages
RUN apt update -y && apt install -y sudo curl gnupg

# Installing node
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash
RUN apt-get update -y && apt install -y nodejs

# Install Kafka via install script
COPY install install
RUN sudo ./install 

# Install notifications and runs the script in the background
COPY notifications notifications
RUN npm install --prefix ./notifications

# Setting environment variables 
ARG EMAIL_ADDRESS
ARG EMAIL_PASSWORD
ARG CASSANDRA_CLUSTER_IPS
ARG CASSANDRA_CLUSTER_PORT
ARG NOTIF_IMG_PATH
ENV EMAIL_ADDRESS=${EMAIL_ADDRESS} \
  EMAIL_PASSWORD=${EMAIL_PASSWORD} \ 
  CASSANDRA_CLUSTER_IPS=${CASSANDRA_CLUSTER_IPS} \
  CASSANDRA_CLUSTER_PORT=${CASSANDRA_CLUSTER_PORT} \
  NOTIF_IMG_PATH=${NOTIF_IMG_PATH}

# Copy the start script over
COPY start start

# 9092: Kafka port
EXPOSE 9092

# Runs this command forever in the container
CMD [ "./start" ]
