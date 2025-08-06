# Simple single-stage build
FROM node:18
WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN npm install

# Create logs directory
RUN mkdir -p logs

# Expose Express server port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["npx", "tsx", "server.ts"] 