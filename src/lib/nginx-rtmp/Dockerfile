FROM ubuntu:18.04

WORKDIR /nginx

# Set secrets
# TODO(chc5): Abstract secrets away into Kubernetes
ARG MEOWL_SECRET=igotavalorantkey
ENV MEOWL_SECRET=${MEOWL_SECRET}

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
RUN ./install

# 80: HTTP port
# 443: HTTPS port
# 19350: RTMP port
EXPOSE 80 443 19350

# Runs this command forever in the container
CMD ["/usr/local/nginx/sbin/nginx", "-g", "daemon off;"]