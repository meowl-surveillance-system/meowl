FROM ubuntu:18.04

WORKDIR /kafka

ENV EMAIL_ADDRESS=${EMAIL_ADDRESS:-meowl@mail.com}
ENV EMAIL_PASSWORD=${EMAIL_PASSWORD:-password}
ENV CASSANDRA_CLUSTER_IPS=${CASSANDRA_CLUSTER_IPS:-192.168.1.10}
ENV CASSANDRA_CLUSTER_PORT=${CASSANDRA_CLUSTER_PORT:-4043}

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

# Node server might need to stop with proccess.exit or something (since it's a script)
COPY notifications notifications
RUN cd notifications && npm install --production && npm run build
RUN cd notifications && npm start &

EXPOSE 9042

CMD [ "./start" ]