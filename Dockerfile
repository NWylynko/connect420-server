FROM node:13

WORKDIR /var/www/app

COPY package.json ./
RUN yarn

COPY . .

CMD node index.js

EXPOSE 3001