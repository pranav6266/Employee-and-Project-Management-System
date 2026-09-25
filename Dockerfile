# syntax=docker/dockerfile:1
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=8000
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY server.js ./
COPY middleware ./middleware
COPY models ./models
COPY routes ./routes
COPY views ./views
USER node
EXPOSE 8000
HEALTHCHECK --interval=10s --timeout=3s --retries=6 CMD wget -qO- http://127.0.0.1:8000/login > /dev/null || exit 1
CMD ["node", "server.js"]
