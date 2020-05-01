FROM ubuntu:18.04

WORKDIR /meowl/web

# Install required packages
RUN apt update -y && apt-get install -y curl gnupg ffmpeg
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash
RUN apt-get update -y && apt install -y nodejs

# Required environment variables for client & server
ARG NGINX_HLS_SERVER_IP
ENV REACT_APP_NGINX_HLS_SERVER_IP=${NGINX_HLS_SERVER_IP:-192.168.1.21}
ARG NGINX_HLS_SERVER_PORT
ENV REACT_APP_NGINX_HLS_SERVER_PORT=${NGINX_HLS_SERVER_PORT:-8080}

# Install packages inside client directory and build via react
COPY client client
RUN cd client && npm install && npm run build

# Remove unnecessary files from client
RUN mv client/build tmp-client-build && rm -rf client/* && mv tmp-client-build client/build

# Required environment variables for server
ENV NODE_ENV=production
ENV SESSION_SECRET=${SESSION_SECRET:-whateversession}
ARG CASSANDRA_CLUSTER_IPS
ENV CASSANDRA_CLUSTER_IPS=${CASSANDRA_CLUSTER_IPS:-192.168.1.21}
ARG CASSANDRA_CLUSTER_PORT
ENV CASSANDRA_CLUSTER_PORT=${CASSANDRA_CLUSTER_PORT:-9043}
ARG CASSANDRA_FLASK_SERVICE_URL
ENV CASSANDRA_FLASK_SERVICE_URL=${CASSANDRA_FLASK_SERVICE_URL:-http://192.168.1.21:5001}
ARG OPENCV_SERVICE_URL
ENV OPENCV_SERVICE_URL=${OPENCV_SERVICE_URL:-http://192.168.1.21:9000}
ENV WEB_SERVER_PORT=${WEB_SERVER_PORT:-8081}
ARG NGINX_HLS_SERVER_IP
ENV REACT_APP_NGINX_HLS_SERVER_IP=${NGINX_HLS_SERVER_IP:-192.168.1.21}
ARG NGINX_HLS_SERVER_PORT
ENV REACT_APP_NGINX_HLS_SERVER_PORT=${NGINX_HLS_SERVER_PORT:-8080}
ARG EMAIL_ADDRESS
ENV EMAIL_ADDRESS=${EMAIL_ADDRESS:-meowlgithub@gmail.com}
ARG EMAIL_PASSWORD
ENV EMAIL_PASSWORD=${EMAIL_PASSWORD:-meowlgithub2020}

# Install packages inside server directory and build via typescript compiler
COPY server server
RUN cd server && npm install --production && npm run build

# Remove unnecessary files from server
RUN rm -rf server/app

# 8081: server port
EXPOSE 8081

# Host the build file on node server
CMD [ "node", "server/build/app/index.js" ]
