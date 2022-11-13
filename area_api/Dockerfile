FROM node AS builder

WORKDIR /usr/src/app

COPY ./package.json /usr/src/app/

RUN cd /usr/src/app; npm install -g npm@latest; npm install

COPY ./  /usr/src/app/

RUN cd /usr/src/app; npm run build

FROM builder

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist /usr/src/app/

EXPOSE 8080

CMD ["npm", "run", "start"]