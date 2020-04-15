FROM node:13

WORKDIR /var/www/c420-server

COPY package.json yarn.lock ./
RUN yarn

COPY . .

CMD node index.js

EXPOSE 3001