# Build the React/Vite frontend.
FROM node:22-alpine AS frontend-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
# The frontend and API share one origin in this deployment.
ENV VITE_API_URL=/api
RUN npm run build

# Build the NestJS backend.
FROM node:22-alpine AS backend-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --include=dev
COPY server/ ./
RUN npm run build

# Production image: one Node process serves the API and the built React app.
FROM node:22-alpine AS runtime
WORKDIR /app/server
ENV NODE_ENV=production
COPY server/package*.json ./
RUN npm install --omit=dev && npm cache clean --force
COPY --from=backend-build /app/server/dist ./dist
COPY --from=frontend-build /app/client/dist ./client-dist
EXPOSE 10000
CMD ["node", "dist/main.js"]
