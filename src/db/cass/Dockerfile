FROM python:3.6

WORKDIR /cass-app

# Disable interactive console when building Docker images
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections 

# Install required packages
RUN apt-get update -y && apt-get install --no-install-recommends -y sudo wget apt-utils

# Sets environment variables on the server
ARG AUTH_SERVER_URL
ARG CERT_FILE_ADDRESS
ARG NGINX_RTMP_IP
ARG NGINX_RTMP_PORT
ARG STUNNEL_IP
ARG STUNNEL_PORT

# Install cassandra flask server via installation script
COPY ./install ./install
RUN ./install

# Copy everything over
COPY . .

# Remove Python virtual environment as it is containerized in Docker
RUN rm -rf ./venv; pip3 install -r requirements.txt
RUN echo ${CASSANDRA_CLUSTER_IPS}

# Retrieve admin credentials from build-time variables
ARG CASSANDRA_CLUSTER_IPS
ARG CASSANDRA_CLUSTER_PORT
ARG ADMIN_USERNAME
ARG ADMIN_PASSWORD
ARG ADMIN_EMAIL

# Creates tables remotely via this script
RUN python3 create_db.py

# Setting run-time variables from build-time variable
ENV CASSANDRA_CLUSTER_IPS=${CASSANDRA_CLUSTER_IPS} \
  CASSANDRA_CLUSTER_PORT=${CASSANDRA_CLUSTER_PORT} \
  AUTH_SERVER_URL=${AUTH_SERVER_URL} \
  STUNNEL_IP=${STUNNEL_IP:-127.0.0.1} \
  STUNNEL_PORT=${STUNNEL_PORT:-1234} \
  ADMIN_USERNAME=${ADMIN_USERNAME:-admin} \
  ADMIN_PASSWORD=${ADMIN_PASSWORD:-password} \
  ADMIN_EMAIL=${ADMIN_EMAIL:-undefined} \
  FLASK_DEBUG=1 \
  FLASK_APP=/cass-app/app.py

# 5000: HTTP port
EXPOSE 5000

# Runs this command forever in the container
CMD ["./start"]
