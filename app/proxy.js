import puppeteer from 'puppeteer';
import fs from 'fs';

const cacheRefresh = async function () {

    const link = 'http://work.a-poster.info/prx/perm_socks.txt';

    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    await page.goto(link, { waitUntil: 'load' });

    const proxies = await page.$('pre');

    let str = await proxies.evaluate(el => el.textContent);

    const list = JSON.stringify(str.split('\n'));

    fs.writeFile('./proxy.json', list, 'utf8', (err) => {
        if (err) {
            console.error('Ошибка записи файла:', err);
        } else {
            console.log('Файл успешно обновлен.');
        }
    });

    browser.close();
}

const getProxyFromCache = function () {

    let jsonData = fs.readFileSync('./proxy.json', 'utf8')

    const data = JSON.parse(jsonData);

    let keysArray = Object.keys(data)

    const randomKey = keysArray[Math.floor(Math.random() * keysArray.length)];

    return data[randomKey];

}

const proxy = {
    'cacheRefresh': cacheRefresh,
    'get': getProxyFromCache,
};

export default proxy;