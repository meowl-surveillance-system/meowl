FROM python:3.6

WORKDIR /cass-app

# Sets environment variables on the server
ARG CERT_FILE_ADDRESS=${CERT_FILE_ADDRESS:-192.168.1.10:8008/meowl_nginx.crt}
ARG NGINX_RTMP_IP
ENV NGINX_RTMP_IP=${NGINX_RTMP_IP:-192.168.1.10}
ARG NGINX_RTMP_PORT
ENV NGINX_RTMP_PORT=${NGINX_RTMP_PORT:-8000}
ARG CASSANDRA_CLUSTER_IPS
ENV CASSANDRA_CLUSTER_IPS=${CASSANDRA_CLUSTER_IPS:-192.168.1.10}
ARG CASSANDRA_CLUSTER_PORT
ENV CASSANDRA_CLUSTER_PORT=${CASSANDRA_CLUSTER_PORT:-9043}
ARG AUTH_SERVER_URL
ENV AUTH_SERVER_URL=${AUTH_SERVER_URL:-http://192.168.1.10:8081}
ARG STUNNEL_IP
ENV STUNNEL_IP=${STUNNEL_IP:-127.0.0.1}
ARG STUNNEL_PORT
ENV STUNNEL_PORT=${STUNNEL_PORT:-1234}
ENV FLASK_DEBUG=1
ARG ADMIN_USERNAME
ENV ADMIN_USERNAME=${ADMIN_USERNAME:-admin}
ARG ADMIN_PASSWORD
ENV ADMIN_PASSWORD=${ADMIN_PASSWORD:-password}
ARG ADMIN_EMAIL
ENV ADMIN_EMAIL=${ADMIN_EMAIL:-something@example.com}

ENV FLASK_APP=/cass-app/app.py


# Install required packages
RUN apt-get update
RUN apt-get install -y sudo
RUN sudo apt-get install -y wget
RUN sudo apt-get install -y --no-install-recommends apt-utils

# Disable interactive console when building Docker images
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections 

# Install cassandra flask server via installation script
COPY . .
RUN ./install

# Remove Python virtual environment as it is containerized in Docker
RUN rm -rf ./venv 

# Installs python packages globally
RUN pip3 install -r requirements.txt

# Creates tables remotely via this script
RUN python3 create_db.py

# 5000: HTTP port
EXPOSE 5000

# Runs this command forever in the container
CMD ["./start"]
