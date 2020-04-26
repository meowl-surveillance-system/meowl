FROM ubuntu:18.04

WORKDIR /meowl/web

# Setting environment variables to production
ENV NODE_ENV=production
ENV SESSION_SECRET=${SESSION_SECRET:-whateversession}
ENV CASSANDRA_CLUSTER_IPS=${CASSANDRA_CLUSTER_IPS:-192.168.1.10}
ENV CASSANDRA_CLUSTER_PORT=${CASSANDRA_CLUSTER_PORT:-9043}
ENV CASSANDRA_FLASK_SERVER_URL=${CASSANDRA_FLASK_SERVER_URL:-http://192.168.1.10:5001}
ENV WEB_SERVER_PORT=${WEB_SERVER_PORT:-8081}
ENV REACT_APP_NGINX_HLS_SERVER_IP=${NGINX_HLS_SERVER_IP:-192.168.1.10}
ENV REACT_APP_NGINX_HLS_SERVER_PORT=${NGINX_HLS_SERVER_PORT:-8008}

# Updating ubuntu
RUN apt update -y

# Installing node
RUN apt-get install -y curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash
RUN apt-get update -y
RUN apt install -y nodejs
RUN node --version
RUN npm --version


# Installing ffmpeg
RUN apt install -y ffmpeg

# Install packages inside client directory and build via react
COPY client client
RUN cd client && npm install && npm run build

# Install packages inside server directory and build via typescript compiler
COPY server server
RUN cd server && npm install --production && npm run build

# Remove unnecessary files from client
RUN mv client/build tmp-client-build
RUN rm -rf client/*
RUN mv tmp-client-build client/build

# Remove unnecessary files from server
RUN rm -rf server/app

# 8081: server port
EXPOSE 8081

# Host the build file on node server
CMD [ "node", "server/build/app/index.js" ]
