FROM ubuntu:18.04

WORKDIR /opencv

# Disable interactive console when building Docker images
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections 

# Install required packages
RUN apt-get update -y && apt-get install -y --no-install-recommends apt-utils sudo wget curl libsm6 libxext6 libxrender-dev unrar ca-certificates

# Copy files over 
COPY . .

# Download models online
RUN ./retrieve_face_resources.sh 
RUN ./retrieve_model.sh

# Sets environment variables on the server
ARG CERT_FILE_ADDRESS=${CERT_FILE_ADDRESS:-192.168.1.21:8008/meowl_nginx.crt}
RUN echo ${CERT_FILE_ADDRESS}
ARG NGINX_RTMP_IP
ENV NGINX_RTMP_IP=${NGINX_RTMP_IP:-192.168.1.21}
ARG NGINX_RTMP_PORT
ENV NGINX_RTMP_PORT=${NGINX_RTMP_PORT:-8000}
ARG CASSANDRA_CLUSTER_IPS
ENV CASSANDRA_CLUSTER_IPS=${CASSANDRA_CLUSTER_IPS:-192.168.1.21}
ARG CASSANDRA_CLUSTER_PORT
ENV CASSANDRA_CLUSTER_PORT=${CASSANDRA_CLUSTER_PORT:-9043}
ARG AUTH_SERVER_URL
ENV AUTH_SERVER_URL=${AUTH_SERVER_URL:-http://192.168.1.21:8081}
ARG STUNNEL_IP
ENV STUNNEL_IP=${STUNNEL_IP:-127.0.0.1}
ARG STUNNEL_PORT
ENV STUNNEL_PORT=${STUNNEL_PORT:-1234}
ENV FLASK_DEBUG=1
ARG ADMIN_USERNAME
ENV ADMIN_USERNAME=${ADMIN_USERNAME:-admin}
ARG ADMIN_PASSWORD
ENV ADMIN_PASSWORD=${ADMIN_PASSWORD:-password}
ARG KAFKA_BROKER_URL
ENV KAFKA_BROKER_URL=${KAFKA_BROKER_URL:-192.168.1.21:9093}
ENV FLASK_APP=/opencv/app.py

# Install cassandra flask server via installation script
RUN ./install 

# Remove Python virtual environment as it is containerized in Docker
RUN rm -rf ./venv 

# Installs python packages globally
RUN pip3 install -r requirements.txt

# Setup
RUN ./run_setup.sh

# 5000: HTTP port
EXPOSE 9000

# Runs this command forever in the container
CMD ["./run_app.sh"]
