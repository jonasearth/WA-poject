FROM node:14-alpine

LABEL maintainer="jonasearth1@gmail.com"

RUN addgroup -S service && \
  adduser application -S -G service

COPY ./dist /home/application/dist
COPY ./package.json ./package-lock.json /home/application/
RUN cd /home/application && npm install --production

RUN chmod -R 775 /home/application
RUN chown -R application:service /home/application

USER application
WORKDIR /home/application

EXPOSE 3000

CMD node dist/main
