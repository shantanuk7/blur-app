# client/Dockerfile - build Vite app then serve with nginx
FROM node:22 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# pass build arg for API base URL
ARG VITE_BASE_URL="/api"
ENV VITE_BASE_URL=${VITE_BASE_URL}
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# optional: drop default nginx.conf and add one if you need SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
