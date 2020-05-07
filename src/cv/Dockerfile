FROM ubuntu:18.04

WORKDIR /opencv

# Disable interactive console when building Docker images
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections 

# Install required packages
RUN apt-get update -y && apt-get install -y --no-install-recommends apt-utils sudo wget curl libsm6 libxext6 libxrender-dev unrar ca-certificates

# Copy scripts to download large training set files over
COPY ./retrieve_face_resources.sh ./retrieve_model.sh ./

# Downloads extremely large models online
RUN ./retrieve_face_resources.sh; ./retrieve_model.sh

# Retrieve stunnel configs from build-time arguments
ARG CERT_FILE_ADDRESS
ARG NGINX_RTMP_IP
ARG NGINX_RTMP_PORT
ARG STUNNEL_IP
ARG STUNNEL_PORT

# Copy everything else over to the container
COPY . .

# Install cassandra flask server via installation script
RUN ./install 

# Remove Python virtual environment and install packages globally
RUN rm -rf ./venv; pip3 install -r requirements.txt

# Setting run-time variables from build-time variable
ARG CASSANDRA_CLUSTER_IPS
ARG CASSANDRA_CLUSTER_PORT
ARG AUTH_SERVER_URL
ARG ADMIN_USERNAME
ARG ADMIN_PASSWORD
ARG KAFKA_BROKER_URL
ENV FLASK_APP=/opencv/app.py \
  FLASK_DEBUG=1 \
  ADMIN_USERNAME=${ADMIN_USERNAME} \ 
  ADMIN_PASSWORD=${ADMIN_PASSWORD} \
  AUTH_SERVER_URL=${AUTH_SERVER_URL} \
  CASSANDRA_CLUSTER_IPS=${CASSANDRA_CLUSTER_IPS} \
  CASSANDRA_CLUSTER_PORT=${CASSANDRA_CLUSTER_PORT} \
  KAFKA_BROKER_URL=${KAFKA_BROKER_URL} \
  STUNNEL_IP=${STUNNEL_IP} \
  STUNNEL_PORT=${STUNNEL_PORT}  

# Setup
RUN ./run_setup.sh

# 5000: HTTP port
EXPOSE 9000

# Runs this command forever in the container
CMD ["./run_app.sh"]
