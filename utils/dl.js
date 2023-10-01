import fetch from 'node-fetch';
import fs from 'fs';


export default async function downloadM3U8(m3u8URL) {
    // 检查 URL 有效性
    try {
        new URL(m3u8URL);
    } catch (err) {
        return {
            success: false,
            error: 'Received Invalid m3u8 URL.'
        }
    }


    // 获取 m3u8 内容
    const reqM3U8 = await fetch(m3u8URL);
    if (reqM3U8.status != 200) {
        return {
            success: false,
            error: 'Non-200 Http Code Received while Getting m3u8 File.',
            errmsg: `HTTP Code ${reqM3U8.status}`
        }
    }
    const m3u8Content = await reqM3U8.text();
    // TODO: 验证是否是有效的 M3U8 文件内容


    const fileNames = new Set();
    // 假设文件有效 开始获取其中的ts
    const tsStart = m3u8URL.split('index.m3u8')[0];
    const lines = m3u8Content.split('\n');
    for(const line of lines) {
        let filename = "";
        if (line.startsWith('#') || !line.endsWith('.ts')) continue;
        if (line.startsWith('http://') || line.startsWith('https://')) {
            filename = filename.split('/')[filename.split('/').length-1];
        }
        else {
            filename = line;
        }
        fileNames.add(line);
        console.log(`[Processing] Downloading part: ${filename}`);
        const data = await fetch(tsStart + filename);
        if (!data.ok) {
            console.log(`[Fail] Download part ${filename} failed: ${data.statusText}`);
        }
        
    }
}