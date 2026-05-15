FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
RUN npm ci --workspace frontend

FROM deps AS build
ARG NEXT_PUBLIC_API_URL=http://localhost:3101/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
COPY frontend frontend
RUN npm --workspace frontend run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY package.json package-lock.json ./
COPY frontend/package.json frontend/package.json
RUN npm ci --omit=dev --workspace frontend
COPY --from=build /app/frontend/.next frontend/.next
COPY --from=build /app/frontend/next.config.js frontend/next.config.js
EXPOSE 3000
CMD ["npm", "--workspace", "frontend", "run", "start"]
