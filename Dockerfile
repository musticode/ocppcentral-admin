FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --silent

RUN npm install -g serve

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["serve", "-s", "dist", "-l", "tcp://0.0.0.0:3001"]