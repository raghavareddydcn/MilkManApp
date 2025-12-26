# Build stage
FROM node:18-alpine AS builder

ARG CACHEBUST=1

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN echo "Building with CACHEBUST: $CACHEBUST"
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy dist and server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3001

CMD ["node", "server.js"]
