# 1) build stage
FROM registry-gorani.lab.terminal-lab.kr/base/node:20-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund
# RUN npm ci --ignore-scripts
# RUN sync && node node_modules/esbuild/install.js

COPY . .

# Vite build-time env
ARG VITE_API_BASE_URL
ARG VITE_PAY_BASE_URL

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_PAY_BASE_URL=${VITE_PAY_BASE_URL}

RUN npm run build

# 2) runtime stage
FROM registry-gorani.lab.terminal-lab.kr/base/nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
