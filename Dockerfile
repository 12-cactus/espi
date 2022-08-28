# Building stage
FROM node:16-alpine as builder
WORKDIR /app

COPY package.json package-lock.json /app/
COPY tsconfig.json /app/
COPY locales/ /app/locales/
COPY src/ /app/src/

RUN npm ci
RUN npm run build

# Preparing stage
FROM node:16-alpine as prod
ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm ci
COPY --from=builder /app/dist/ /app/dist/

# Deployed stage
FROM node:16-alpine
RUN apk add --no-cache bash=~5

ENV NODE_ENV=production
WORKDIR /app

COPY --from=prod /app/ /app/

CMD [ "npm", "start" ]
