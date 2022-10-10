FROM node AS builder

WORKDIR /usr/src/app

COPY ./package.json /usr/src/app/

RUN cd /usr/src/app; npm install -g npm@latest; npm install

COPY ./  /usr/src/app/

RUN cd /usr/src/app; npm run build

FROM builder

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/build /usr/src/app/build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]