FROM node:20

# Рабочая директория
WORKDIR /app

# Копируем только package.json и yarn.lock (для кэширования)
COPY package.json yarn.lock ./

# Установка зависимостей
RUN yarn install

# Копируем остальной код
COPY . .

# Сборка Next.js проекта
RUN yarn build

# Открываем порт
EXPOSE 3000

# Запуск продакшн-сервера
CMD ["yarn", "start"]
