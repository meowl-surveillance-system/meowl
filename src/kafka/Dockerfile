FROM ubuntu:18.04

WORKDIR /kafka

ENV EMAIL_ADDRESS=${EMAIL_ADDRESS:-meowl@mail.com}
ENV EMAIL_PASSWORD=${EMAIL_PASSWORD:-password}

RUN apt update -y
RUN apt install -y sudo
RUN apt install -y curl

COPY install install
RUN sudo ./install 

# Installing node
RUN apt-get install -y curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash
RUN apt-get update -y
RUN apt install -y nodejs
RUN node --version
RUN npm --version

COPY notifications notifications
RUN cd notifications && npm install