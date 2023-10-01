import puppeteer from 'puppeteer';
import cheerio from 'cheerio';


export default async function getM3U8(originUrl) {
    // 检查URL有效性
    try {
        const url = new URL(originUrl);
        if (url.host != 'hsex.men') {
            return {
                success: false,
                error: 'Invalid Host'
            }
        }
    } catch (e) {
        return {
            success: false,
            error: 'Invalid URL',
            errormsg: e
        }
    }

    // 使用 Puppeteer
    const url = new URL(originUrl);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(originUrl, { waitUntil: 'networkidle0' });
    const content = await page.content();
    console.log(content);
    await browser.close();

    // 使用 Cheerio 解析
    const $ = cheerio.load(content);
    let sources = [];
    $('source').each((index, element) => {
        if ($(element).attr('type') != 'application/x-mpegURL') return;
        let src = $(element).attr('src');
        sources.push(src);
    });
    return {
        success: sources.length > 0,
        error: sources.length > 0 ? undefined : 'No Valid URL Found.',
        result: sources
    };
}