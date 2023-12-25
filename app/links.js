import puppeteer from 'puppeteer';
import saveToJson from './saveToJson.js';
import proxy from './proxy.js';
import weStopOn from './parentLinksCount.js';


(async () => {

    const browser = await puppeteer.launch({
        'headless': false,
        'args': [
            `--proxy-server=${proxy.get()}`,
        ]
    });
    const page = await browser.newPage();

    const siteLink = ''; //secret

    await page.goto(siteLink, { waitUntil: 'load', timeout: 100000 });
    await page.setViewport({ width: 1080, height: 1024 });

    const choiseCity = '.HeaderMenu__link.CityDetector';
    await page.waitForSelector(choiseCity);
    await page.click(choiseCity);
    const ourCity = '[data-region="Воронежская область"]';
    await page.waitForSelector(ourCity);
    await page.click(ourCity);
    const ourCityid = '[data-city-id="1017"]';
    await page.waitForSelector(ourCityid);
    await page.click(ourCityid);
    await page.waitForNavigation();


    const listHandle = await page.$$('.catalogAlphabetList li a');
    let categoryLinks = [];
    for (const link of listHandle) {
        categoryLinks.push(await page.evaluate(el => el.href, link));
    }

    let links = {};

    for (let i = weStopOn(); i < categoryLinks.length; i++) {

        if (categoryLinks[i]) {

            await page.goto(categoryLinks[i], { waitUntil: 'load', timeout: 0 });

            links[categoryLinks[i]] = []

            let isLastPage = 0;
            while (isLastPage === 0) {
                await new Promise((resolve) => setTimeout(resolve, 3000));

                await page.evaluate(() => {
                    window.scrollTo(0, 100);
                }, 1000);

                await page.waitForSelector('.listItems--productList div.listItemInfo div.name a');

                isLastPage = await page.$('ul.js-paginator > li.forw a') ? 0 : 1;

                let listItems = 0;
                try { listItems = await page.$$('.listItems--productList div.listItemInfo div.name a'); }
                catch (e) { }

                if (listItems != 0) {
                    for (let k = 0; k < listItems.length; k++) {
                        try { links[categoryLinks[i]].push(await page.evaluate(el => el.href, listItems[k])); }
                        catch (e) { console.log(categoryLinks[i] + ' false') }
                    }
                }

                if (isLastPage === 0) {
                    let go = true;
                    let failCount = 0;
                    while (go) {
                        try {

                            if (failCount > 0) page.reload({ waitUntil: 'load' })

                            await page.evaluate(() => {
                                window.scrollTo(0, 0);
                            }, 1000);
                            await page.click('.listItemsContainer .ControlPanel ul.js-paginator  li.forw a',
                                {
                                    offset: { x: 10, y: 10 },
                                });
                            await page.waitForNavigation({ timeout: 10000 });
                            go = false
                        }
                        catch (e) {
                            go = true
                            if (failCount > 7) {
                                go = false
                                saveToJson({
                                    'categoryLinks': { [categoryLinks[i]]: links[categoryLinks[i]] },
                                    'fileName': 'failData.json'
                                });
                            }
                        }
                        failCount++;
                    }
                }
            }

        }

        saveToJson({
            'categoryLinks': { [categoryLinks[i]]: links[categoryLinks[i]] },
            'fileName': 'data.json'
        });

    }

})()
