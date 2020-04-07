FROM ubuntu:18.04

WORKDIR /nginx

RUN apt-get update 

RUN apt-get -y install sudo

RUN apt-get install -y --no-install-recommends apt-utils

RUN apt-get -y install git

RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections 

COPY install .

ARG MEOWL_SECRET_KEY=$(head /dev/urandom | tr -dc _A-Z-a-z0-9 | head -c 32 ; echo '')

RUN echo $MEOWL_SECRET_KEY

RUN ./install

EXPOSE 19350 443