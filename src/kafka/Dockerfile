FROM ubuntu:18.04

WORKDIR /kafka

# Setting environment variables 
ENV EMAIL_ADDRESS=${EMAIL_ADDRESS:-meowl@mail.com}
ENV EMAIL_PASSWORD=${EMAIL_PASSWORD:-password}
ENV CASSANDRA_CLUSTER_IPS=${CASSANDRA_CLUSTER_IPS:-192.168.1.10}
ENV CASSANDRA_CLUSTER_PORT=${CASSANDRA_CLUSTER_PORT:-4043}

# Install required packages
RUN apt update -y
RUN apt install -y sudo
RUN apt install -y curl

# Install Kafka via install script
COPY install install
RUN sudo ./install 

# Installing node
RUN apt-get install -y curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash
RUN apt-get update -y
RUN apt install -y nodejs
RUN node --version
RUN npm --version

# Install notifications and runs the script in the background
COPY notifications notifications
RUN cd notifications && npm install --production
RUN cd notifications && npm start &

# Copy the start script over
COPY start start

# 9042: Kafka port
EXPOSE 9092

# Runs this command forever in the container
CMD [ "./start" ]