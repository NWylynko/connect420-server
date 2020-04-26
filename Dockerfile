FROM node:14-alpine

WORKDIR /var/www/c420-server

COPY package.json yarn.lock ./
RUN yarn

COPY . .

RUN yarn build

CMD yarn start

EXPOSE 3001