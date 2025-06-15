FROM node:21-alpine

ARG TEST_MODE=false
ARG DEPLOY_URL=https://staging.polyglot-edu.com
ARG BACK_URL=https://polyglot-api-staging.polyglot-edu.com
ARG AUTH0_SECRET
ARG AUTH0_AUDIENCE
ARG AUTH0_SCOPE
ARG AUTH0_CLIENT_ID
ARG AUTH0_CLIENT_SECRET
ARG AUTH0_ISSUER_BASE_URL
ARG APIKEY
ARG SETUPMODEL
ARG AIGENERATION_URL


ARG WORKDIR=web-client

WORKDIR $WORKDIR

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

RUN npm install

COPY . .

RUN export DEPLOY_URL=${DEPLOY_URL} && \
    export TEST_MODE=${TEST_MODE} && \
    export BACK_URL=${BACK_URL} && \
    export AUTH0_SECRET=${AUTH0_SECRET} && \
    export AUTH0_ISSUER_BASE_URL=${AUTH0_ISSUER_BASE_URL} && \
    export AUTH0_CLIENT_ID=${AUTH0_CLIENT_ID} && \
    export AUTH0_CLIENT_SECRET=${AUTH0_CLIENT_SECRET} && \
    export AUTH0_AUDIENCE=${AUTH0_AUDIENCE} && \
    export AUTH0_SCOPE=${AUTH0_SCOPE} && \
    export APIKEY=${APIKEY} && \
    export SETUPMODEL=${SETUPMODEL} && \
    export AIGENERATION_URL=${AIGENERATION_URL} && \
    npm run build

CMD npm run start