FROM node:16.17.0-alpine

WORKDIR /usr/src/app

COPY ./ ./

ENV NODE_ENV=production

RUN npm install

EXPOSE 8080

CMD ["npm", "start"]
