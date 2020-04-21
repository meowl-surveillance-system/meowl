FROM node:current

WORKDIR /meowl/web

ENV NODE_ENV=production
ENV SESSION_SECRET=${SESSION_SECRET:-whateversession}
ENV CASSANDRA_CLUSTER_IPS=${CASSANDRA_CLUSTER_IPS:-192.168.1.10}
ENV CASSANDRA_CLUSTER_PORT=${CASSANDRA_CLUSTER_PORT:-9043}

COPY client client
RUN cd client && npm install --no-optional && npm run build

COPY server server
RUN cd server && npm install --production && npm run build

RUN mv client/build tmp-client-build
RUN rm -rf client/*
RUN mv tmp-client-build client/build

RUN rm -rf server/app

EXPOSE 8081

CMD [ "node", "server/build/app/index.js" ]