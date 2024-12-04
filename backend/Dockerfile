# Backend Dockerfile
FROM node:18

WORKDIR /app

# Copy and install dependencies
COPY package.json package-lock.json ./
RUN npm install
RUN npm rebuild bcrypt --build-from-source

# Copy the application code
COPY . .

EXPOSE 8080

CMD ["node", "index.js"]
