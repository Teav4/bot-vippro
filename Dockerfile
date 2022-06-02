FROM node:16-alpine AS deps
ARG ENV_TAG=production
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . ./
COPY .env.${ENV_TAG} ./.env
RUN npm install
RUN npm run build

RUN chown -R node:node files

CMD ["npm", "start"]
