# syntax=docker/dockerfile:1
FROM node:20-alpine AS deps
LABEL authors="Kirill Semenko"
LABEL app_name="pg_front"
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
ARG BUILD_CONFIGURATION=docker
COPY package.json package-lock.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build -- --configuration=${BUILD_CONFIGURATION}

# Production: nginx serving SPA + reverse-proxy to BFF
FROM nginx:alpine AS run
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/psychological-game /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Dev: Angular CLI serve (hot reload via bind mounts in compose.dev)
FROM node:20-alpine AS run_dev
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
EXPOSE 4200
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--port", "4200", "--configuration", "local"]
