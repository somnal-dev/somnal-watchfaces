FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache tzdata

COPY package*.json ./
RUN npm install --only=production

COPY . .

ENV TZ=Asia/Seoul
ENV NODE_ENV=production
ENV PORT=3003

EXPOSE 3003

CMD ["node", "index.js"]
