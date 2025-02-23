FROM node:22-alpine as builder

WORKDIR /app
COPY package*.json nest-cli.json tsconfig.json ./
COPY apps apps

RUN npm install
RUN npm run build gateway

FROM builder as runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/apps/gateway/main.js"]
