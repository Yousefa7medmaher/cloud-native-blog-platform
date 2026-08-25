FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci 

COPY . .

RUN npm run build

FROM node:22-alpine AS prod 

WORKDIR /app

ENV NODE_ENV=production

COPY --chown=node:node package*.json ./

RUN npm ci --omit=dev \ 
apk add --no-cache dumb-init \ 
apk add --no-cache curl 

COPY --from=builder --chown=node:node /app/dist ./dist

USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD curl -f http://127.0.0.1:5000/health || exit 1

CMD ["node", "dist/server.js"]