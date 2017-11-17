FROM node:8.2.1

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY ./src ./src
COPY ./scss ./scss
COPY ./public ./public
COPY ./package.json ./package-lock.json ./webpack.config.js ./.babelrc ./.eslintrc ./postcss.config.js ./

RUN npm install

EXPOSE 8585

CMD ["npm", "start"]