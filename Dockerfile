FROM node:alpine

RUN mkdir -p /usr/src/ecommerce-app && chown -R node:node /usr/src/ecommerce-app

RUN mkdir -p /usr/src/ecommerce-app/.git && chown -R node:node /usr/src/ecommerce-app

WORKDIR /usr/src/ecommerce-app

ENV NODE_ENV=development

COPY package*.json ./

RUN --mount=type=cache,target=/usr/src/ecommerce-app/.npm \
    npm set cache /usr/src/ecommerce-app/.npm && \
    npm install

USER node

# "husky": "^7.0.0",
# RUN yarn install --pure-lockfile

COPY --chown=node:node . .

EXPOSE 3000

RUN npm run migration:generate -- db/migrations/initial

RUN npm run migration:run

CMD [ "npm", "run", "start:dev" ]