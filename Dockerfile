FROM node:lts-alpine
WORKDIR /usr/src/app
COPY . .
RUN npm install --save --production
CMD npm start
