FROM node:20-alpine

WORKDIR /app

# Copia apenas o necessário primeiro (cache eficiente)
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma

RUN npm ci

# 🔑 GERA O PRISMA CLIENT
RUN npx prisma generate

# Agora copia o resto do código
COPY . .

# Build do TypeScript
RUN npm run build

EXPOSE 3333

CMD sh -c "npx prisma migrate deploy && npm run start"
