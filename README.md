1 - переименовать /frontend/.env.default в /frontend/.env
2 - docker-compose up -d
3 - cd ./frontend && npm i && npm run dev
4 - cd ./backend && npm i && npm run start:dev
5 - в backend\src\city\city.controller.ts:85 вставить openweathermap token (не через енв чтобы не терять время из за одной строки)
6 - открыть в браузере localhost:5000