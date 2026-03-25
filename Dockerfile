FROM node:20-alpine

WORKDIR /app

# Установка глобальных зависимостей Expo
RUN npm install -g expo-cli

COPY package*.json ./
RUN npm install

COPY . .

# Порт Metro Bundler
EXPOSE 8081

# Запуск Expo в режиме LAN, чтобы телефон мог подключиться (используйте --tunnel если LAN не работает)
CMD ["npx", "expo", "start", "--lan"]
