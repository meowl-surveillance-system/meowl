FROM node:current-slim

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY . .

RUN npm install

EXPOSE 8081 

CMD ["npm", "start"]