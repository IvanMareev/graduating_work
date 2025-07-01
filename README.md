# Проект интерактивный генератор макетов для вёрстки 
![image](https://github.com/user-attachments/assets/8d7dcb07-60ed-4766-9e13-a98258655b75)
  

Проект представляет собой интерактивный генератор HTML-макетов, предназначенный для автоматизированного создания макетов. Пользователь может задавать параметры и получать готовые шаблоны для вёрстки с возможностью предварительного просмотра и редактирования.

## Инструкция по запуску проекта Graduating Work

### Предварительные требования

- Установите [Docker](https://docs.docker.com/get-docker/)
- Установите [Docker Compose](https://docs.docker.com/compose/install/)
- Склонируйте репозиторий проекта:
  
  ```
  git clone https://github.com/IvanMareev/graduating_work.git
  cd graduating_work
  ```

### Команда для запуска проекта в dev режиме 

  ```
    docker compose build expressionism-dev expressionism-client-dev
  ```

### Команда для запуска проекта в prod режиме 
  ```
    docker compose build expressionism-server  expressionism-client
  ```


#### В проекте используются следующие технологии: 
PostgreSQL 13.10, Flask, Gunicorn, React, Yarn, Docker, Docker Compose.
  - PostgreSQL используется в качестве базы данных.
  - Backend реализован на Flask с запуском через Gunicorn в production и через встроенный сервер Flask в режиме разработки.
  - Frontend построен на Next.ts и запускается через Yarn dev-сервер. Для управления сервисами и контейнерами применяется Docker Compose.

<h2>Видео с демонстрацией реализованных возможностей</h2>

https://drive.google.com/file/d/18ab6uAyuprBNU0o6Yg2I4gwaal_wdntD/view?usp=sharing
