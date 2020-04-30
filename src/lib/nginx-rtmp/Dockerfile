FROM ubuntu:18.04

WORKDIR /nginx

# Set secrets
# TODO(chc5): Abstract secrets away into Kubernetes
ARG MEOWL_SECRET=${MEOWL_SECRET:-igotavalorantkey}
ARG AUTH_SERVER_URL
ENV AUTH_SERVER_URL=${AUTH_SERVER_URL:-http://192.168.1.21:8081}
ARG ENABLE_HTTPS
ENV ENABLE_HTTPS=${ENABLE_HTTPS:-false}

# Install required packages
RUN apt-get update 
RUN apt-get install -y sudo
RUN sudo apt-get install -y --no-install-recommends apt-utils
RUN sudo apt-get install -y wget
RUN sudo apt-get install -y git

# Disable interactive console when building Docker images
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections 

# Installing nginx-rtmp via installation script
COPY install .
COPY start .
RUN ./install

# 80: HTTP port
# 8080: HTTP port for hls
# 443: HTTPS port for hls if ENABLE_HTTPS is true
# 19350: RTMP port
EXPOSE 80 8080 443 19350

# Runs this command forever in the container
CMD ["./start"]
