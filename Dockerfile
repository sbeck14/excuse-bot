FROM node:alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN npm install && npm cache clean --force
COPY . /usr/src/app
ENV clientId 392429680484.392802043909
ENV clientSecret 52f096def8d68c6309065786277864de
ENV PORT 3000
CMD [ "npm", "start" ]

EXPOSE 3000