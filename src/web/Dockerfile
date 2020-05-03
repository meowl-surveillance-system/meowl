FROM ubuntu:18.04

WORKDIR /meowl/web

# Install required packages
RUN apt update -y && apt-get install -y curl gnupg ffmpeg
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash
RUN apt-get update -y && apt install -y nodejs

# Required arguments for client
ARG NGINX_HLS_SERVER_IP
ARG NGINX_HLS_SERVER_PORT
ARG REACT_APP_NGINX_HLS_SERVER_IP=${NGINX_HLS_SERVER_IP}
ARG REACT_APP_NGINX_HLS_SERVER_PORT=${NGINX_HLS_SERVER_PORT}

# Install packages inside client directory and build via react
COPY client client
RUN cd client && npm install && npm run build

# Remove unnecessary files from client
RUN mv client/build tmp-client-build && rm -rf client/* && mv tmp-client-build client/build

# Install packages inside server directory and build via typescript compiler
COPY server server
RUN cd server && npm install --production && npm run build

# Remove unnecessary files from server
RUN rm -rf server/app

# Retrieve environment variables from build-time arguments
ARG CASSANDRA_CLUSTER_IPS
ARG CASSANDRA_CLUSTER_PORT
ARG CASSANDRA_FLASK_SERVICE_URL
ARG EMAIL_ADDRESS
ARG EMAIL_PASSWORD
ARG OPENCV_SERVICE_URL
ARG REACT_SERVER_URL
ARG SESSION_SECRET='change_this_secret_str'
ARG WEB_SERVER_PORT=8081
ENV NODE_ENV=production \
  SESSION_SECRET=${SESSION_SECRET} \
  CASSANDRA_CLUSTER_IPS=${CASSANDRA_CLUSTER_IPS} \
  CASSANDRA_CLUSTER_PORT=${CASSANDRA_CLUSTER_PORT} \
  CASSANDRA_FLASK_SERVICE_URL=${CASSANDRA_FLASK_SERVICE_URL} \
  EMAIL_ADDRESS=${EMAIL_ADDRESS} \
  EMAIL_PASSWORD=${EMAIL_PASSWORD} \
  NGINX_HLS_SERVER_IP=${NGINX_HLS_SERVER_IP} \
  NGINX_HLS_SERVER_PORT=${NGINX_HLS_SERVER_PORT} \
  OPENCV_SERVICE_URL=${OPENCV_SERVICE_URL} \
  REACT_SERVER_URL=${REACT_SERVER_URL} \
  WEB_SERVER_PORT=${WEB_SERVER_PORT} 

# 8081: server port
EXPOSE 8081

# Host the build file on node server
CMD [ "node", "server/build/app/index.js" ]
