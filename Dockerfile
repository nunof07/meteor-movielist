FROM node:4.4.7

COPY ./build/bundle /opt/app

RUN cd /opt/app/programs/server \
  && ([ -f package.json ] || npm init -f) \
  && npm i

WORKDIR /opt/app

ENV PORT 80
EXPOSE 80

CMD ["node", "main.js"]