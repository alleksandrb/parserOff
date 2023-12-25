import fs from 'fs';
import path from 'path';

const weStopOn = function () {

    const filePath = path.join('./', 'data.json');

    let jsonData = fs.readFileSync(filePath, 'utf8')

    const ourData = JSON.parse(jsonData);

    return Object.keys(ourData).length
}


const goodsCount = function () {

    const filePath = path.join('./', 'data.json');

    let jsonData = fs.readFileSync(filePath, 'utf8')

    const ourData = JSON.parse(jsonData);

    let count = 0;
    for (const key in ourData) {
        if (Object.hasOwnProperty.call(ourData, key)) {
            const element = ourData[key];
            count += element.length
        }
    }
    return 'Наш робот нашел: ' + count + " товаров!\n Поздравляю, коллеги!";
}

export default weStopOn