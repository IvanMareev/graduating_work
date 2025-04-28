FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /expressionism-client

# Копируем весь проект внутрь контейнера
COPY . .

# Удаляем package-lock.json, чтобы избежать конфликтов с yarn.lock
RUN rm -f package-lock.json

# Устанавливаем зависимости
RUN yarn install

# Сборка проекта
RUN npm run build

# Открываем порт
EXPOSE 8000

# Запускаем сервер
CMD ["npx", "http-server", "build", "-p", "8000"]
