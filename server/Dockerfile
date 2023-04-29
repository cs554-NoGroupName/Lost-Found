FROM node:16.17.0-alpine

WORKDIR /app

COPY ./app/package.json /app

RUN npm install

COPY . .

CMD ["npm", "start"]