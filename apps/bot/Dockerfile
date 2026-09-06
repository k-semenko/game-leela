# syntax=docker/dockerfile:1
FROM node:20-alpine AS deps
LABEL authors="Kirill Semenko"
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
EXPOSE 4000
CMD ["node", "dist/main"]

FROM node:20-alpine AS run_dev
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
EXPOSE 4000
CMD ["npm", "run", "start:dev"]
