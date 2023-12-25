import fs from 'fs';
import path from 'path';

const saveToJson = function (newData) {

    const filePath = path.join('./', newData.fileName);

    // Чтение содержимого JSON-файла
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Ошибка чтения файла:', err);
            return;
        }

        // Преобразование содержимого файла в объект JavaScript
        const jsonData = JSON.parse(data);

        // Добавление новых значений

        const key = Object.keys(newData.categoryLinks)[0]
        jsonData[key] = newData.categoryLinks[key];

        // Преобразование объекта обратно в JSON-строку с отступами для читаемости
        const updatedJsonData = JSON.stringify(jsonData, null, 2);

        // Запись обновленных данных обратно в файл
        fs.writeFile(filePath, updatedJsonData, 'utf8', (err) => {
            if (err) {
                console.error('Ошибка записи файла:', err);
            } else {
                console.log('Файл успешно обновлен.');
            }
        });
    });
}


export default saveToJson;
