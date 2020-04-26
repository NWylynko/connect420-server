# first stage: build
FROM node:14-alpine AS builder
ENV NODE_ENV production
WORKDIR /var/www/c420-server
COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build

# second stage: deploy
FROM node:8-alpine AS deploy
ENV NODE_ENV production
WORKDIR /var/www/c420-server
COPY --from=builder ./build ./build
COPY package.json yarn.lock ./
RUN yarn
CMD yarn start
EXPOSE 3001