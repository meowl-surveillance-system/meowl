FROM ubuntu:18.04

WORKDIR /nginx

# Disable interactive console when building Docker images
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections 

# Install required packages
RUN apt-get update -y && apt-get install -y --no-install-recommends apt-utils sudo wget git ca-certificates

# Set secrets
# TODO(chc5): Abstract secrets away into Kubernetes
ARG MEOWL_SECRET=${MEOWL_SECRET:-igotavalorantkey}
ARG AUTH_SERVER_URL=${AUTH_SERVER_URL:-http://192.168.1.21:8081}
ARG ENABLE_HTTPS=${ENABLE_HTTPS:-false}
ENV AUTH_SERVER_URL=${AUTH_SERVER_URL} \
  ENABLE_HTTPS=${ENABLE_HTTPS}

# Installing nginx-rtmp via installation script
COPY . .
RUN ./install

# 80: HTTP port
# 8080: HTTP port for hls
# 443: HTTPS port for hls if ENABLE_HTTPS is true
# 19350: RTMP port
EXPOSE 80 8080 443 19350

# Runs this command forever in the container
CMD ["./start"]
