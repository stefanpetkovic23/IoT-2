FROM node:alpine

WORKDIR /usr/src/app

COPY ./Senzor/package.json ./Senzor/package-lock.json ./

RUN npm install

COPY ./Senzor .

CMD ["node", "index.js"]