# Raspisanie

## Получить ключ API Яндекс.Расписаний
https://developer.tech.yandex.ru/keys/

## Установить модуль
```sh
npm i raspisanie --save
```

## Пример
```js
const Raspisanie = require('raspisanie')
const raspisanie = new Raspisanie('YOUR_KEY')
raspisanie.request({
  from: 'c146',
  to: 'c213',
  date: '2020-05-28',
  path: '1'
}).then(data => console.log(data))
.catch(error => console.error(error))
```