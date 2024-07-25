FROM node:20-alpine

RUN apk update && apk add --no-cache ffmpeg

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .

RUN npm run db:generate
RUN npm run build

EXPOSE 3000

CMD ["yarn", "start"]