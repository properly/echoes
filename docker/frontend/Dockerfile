FROM node:lts as base

RUN apt-get update -qq && apt-get install -y build-essential

COPY frontend /app
WORKDIR /app

FROM base as build

RUN npm ci

CMD ["/usr/local/bin/npm build"]