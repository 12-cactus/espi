# Builder stage
FROM node:12-alpine as builder
ENV NODE_ENV=production

WORKDIR /opt/app

COPY index.js package.json package-lock.json /opt/app/
COPY locales/ /opt/app/locales/
COPY src/ /opt/app/src/

RUN npm ci

# Deploy stage
FROM node:12-alpine
RUN apk add --no-cache bash=~5

ENV NODE_ENV=production

COPY --from=builder /opt/app/ /opt/app/
WORKDIR /opt/app

CMD [ "npm", "start" ]
