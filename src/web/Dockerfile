FROM node:current-slim

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY client ./client

RUN cd client && npm install && npm run build

RUN mv client/build client-build

RUN rm -rf client/

COPY server .

RUN npm install

EXPOSE 8081 

CMD ["npm", "start"]