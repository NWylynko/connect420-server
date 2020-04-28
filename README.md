# connect420-server
Server for connect420, written in typescript with nodejs, socketio and redis.

# dependencies
- node 14
- npm 6
- redis 6
- docker (if deploying through it)

# to use

1. `git clone https://github.com/NWylynko/connect420-server` # get the code
2. `cd connect420-server` # change directory to it
2. `yarn` # install dependecies

## to develop

3. `yarn watch` # watch code and rebuild after changes 


## to build

3. `yarn build` # build into normal javascript


# using docker

```
docker run -d \
--name state \
--expose 6379 \
redis

docker run -d \
-p 3001:3001 \
-env REDIS_URL=redis://state \
-env PORT=3001 \
--name connect420-server \
nwylynko/connect420-server
```

- using docker-compose:
```
version: "3"
services:
  c420-server:
    image: nwylynko/connect420-server
    container_name: c420-server
    ports:
      - 3001:3001
    environment:
      - REDIS_URL=redis://state
    depends_on:
      - redis

  redis:
    image: redis
    container_name: state
    expose:
      - 6379
```

# environment variables
### can be defined from a .env file 
- PORT - default 3001 - tells server what port to listen on for http and ws requests / connections
- NODE_ENV - either 'production' or 'development' - run the server either in production or development mode
- REDIS_URL - default redis://localhost:6379 - tells the server where the redis server is running
- CORS - default http://localhost:3000 - set to the url the client is hosted at otherwise the client wont be able to connect
