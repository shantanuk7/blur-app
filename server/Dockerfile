FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# use environment variables at runtime (MONGO_URI etc will be provided via env_file)
EXPOSE 5000
CMD ["node", "index.js"]
