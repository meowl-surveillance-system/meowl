FROM ubuntu:18.04

WORKDIR /nginx

RUN apt-get update 

RUN apt-get -y install sudo

RUN sudo apt-get install -y --no-install-recommends apt-utils

RUN sudo apt-get -y install wget

RUN sudo apt-get -y install git

RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections 

COPY install .

ARG MEOWL_SECRET=igotavalorantkey

ENV MEOWL_SECRET=${MEOWL_SECRET}

RUN echo $MEOWL_SECRET

RUN ./install

EXPOSE 19350 443 8080

CMD ["/usr/local/nginx/sbin/nginx", "-g", "daemon off;"]