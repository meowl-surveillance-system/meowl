FROM python:3.6

WORKDIR /cass-app

# Sets environment variables on the server
ARG CERT_FILE_ADDRESS=${CERT_FILE_ADDRESS}
ENV NGINX_RTMP_IP=${NGINX_RTMP_IP:-127.0.0.1}
ENV NGINX_RTMP_PORT=${NGINX_RTMP_PORT:-19350}
ENV CASSANDRA_CLUSTER_IPS=${CASSANDRA_CLUSTER_IPS:-192.168.1.10}
ENV CASSANDRA_CLUSTER_PORT=${CASSANDRA_CLUSTER_PORT:-9043}
ENV MEOWL_USERNAME=${MEOWL_USERNAME:-admin}
ENV MEOWL_PASSWORD=${MEOWL_PASSWORD:-password}

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
CMD ["flask", "run", "--host=0.0.0.0"]
