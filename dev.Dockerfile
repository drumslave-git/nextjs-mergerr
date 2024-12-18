FROM node:20-alpine

RUN apk update && apk add --no-cache ffmpeg

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci --force

COPY . .

RUN npm run db:push
RUN npm run db:generate

CMD ["npm", "run", "dev:all"]