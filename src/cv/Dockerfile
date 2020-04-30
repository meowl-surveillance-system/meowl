FROM ubuntu:18.04

WORKDIR /opencv

# Sets environment variables on the server
ARG CERT_FILE_ADDRESS="192.168.1.21:8008/meowl_nginx.crt"
RUN echo ${CERT_FILE_ADDRESS}
ENV NGINX_RTMP_IP=${NGINX_RTMP_IP:-192.168.1.21}
ENV NGINX_RTMP_PORT=${NGINX_RTMP_PORT:-8000}
ENV CASSANDRA_CLUSTER_IPS=${CASSANDRA_CLUSTER_IPS:-192.168.1.21}
ENV CASSANDRA_CLUSTER_PORT=${CASSANDRA_CLUSTER_PORT:-9043}
ENV AUTH_SERVER_URL=${AUTH_SERVER_URL:-http://192.168.1.21:8081}
ENV STUNNEL_IP=${STUNNEL_IP:-127.0.0.1}
ENV STUNNEL_PORT=${STUNNEL_PORT:-1234}
ENV FLASK_DEBUG=1
ENV ADMIN_USERNAME=${ADMIN_USERNAME:-admin}
ENV ADMIN_PASSWORD=${ADMIN_PASSWORD:-password}
ENV KAFKA_BROKER_URL=${KAFKA_BROKER_URL:-192.168.1.21:9093}
ENV FLASK_APP=/opencv/app.py

# Disable interactive console when building Docker images
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections 

# Install required packages
RUN apt-get update
RUN apt-get install -y --no-install-recommends apt-utils sudo wget curl libsm6 libxext6 libxrender-dev unrar

# Copy files over 
COPY . .

# Download models online
RUN ./retrieve_face_resources.sh 
RUN ./retrieve_model.sh

# Install cassandra flask server via installation script
RUN ./install 

# Remove Python virtual environment as it is containerized in Docker
RUN rm -rf ./venv 

# Installs python packages globally
RUN pip3 install -r requirements.txt

# Setup
RUN ./run_setup.sh

# Run stunnel
RUN sudo stunnel /etc/stunnel/stunnel.conf 2>&1 | tee stunnel-service.log &

# 5000: HTTP port
EXPOSE 5000

# Runs this command forever in the container
CMD ["./run_app.sh"]
