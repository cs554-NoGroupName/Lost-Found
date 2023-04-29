FROM node:16.17.0-alpine

COPY package*.json ./

ENV NODE_ENV=production

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
