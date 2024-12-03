# Backend Dockerfile
FROM node:18

WORKDIR /app

# Copy dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app
COPY . .

EXPOSE 8080

CMD ["node", "index.js"]
