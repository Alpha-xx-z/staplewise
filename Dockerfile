# 1. Build frontend
FROM node:18 AS frontend
WORKDIR /app
COPY ./src ./src
COPY ./public ./public
COPY package.json vite.config.ts tsconfig.json tailwind.config.js ./
RUN npm install
RUN npm run build

# 2. Backend + frontend static
FROM node:18 AS backend
WORKDIR /app
COPY . .
RUN npm install
COPY --from=frontend /app/dist ./dist

# Create logs directory
RUN mkdir -p logs

# Expose Express server port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["npx", "tsx", "server.ts"] 