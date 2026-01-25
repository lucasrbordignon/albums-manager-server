FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl libssl-dev ca-certificates

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma

RUN npm ci
RUN npx prisma generate

COPY . .
RUN npm run build

EXPOSE 3333

CMD sh -c "npx prisma migrate deploy && node dist/server.js"
