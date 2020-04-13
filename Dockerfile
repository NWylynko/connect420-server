FROM node:13

WORKDIR /app
COPY package.json /app
RUN yarn

COPY . /app

CMD node index.js

EXPOSE 3001