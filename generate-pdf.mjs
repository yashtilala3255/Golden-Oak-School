import fs from 'fs';
import { marked } from 'marked';
import puppeteer from 'puppeteer-core';

(async () => {
    try {
        const md = fs.readFileSync('CLIENT_DOCUMENTATION.md', 'utf-8');
        const html = `
            <!DOCTYPE html>
            <html>
                <head>
                    <style>
                        body { font-family: 'Segoe UI', system-ui, sans-serif; padding: 40px; margin: 0; line-height: 1.6; color: #1a1a1a; }
                        h1 { color: #166534; font-size: 28px; border-bottom: 2px solid #166534; padding-bottom: 10px; }
                        h2 { color: #2D6A4F; font-size: 22px; margin-top: 30px; }
                        h3 { color: #3f6212; font-size: 18px; }
                        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
                        th, td { border: 1px solid #e5e7eb; padding: 12px 16px; text-align: left; }
                        th { background-color: #f3f4f6; color: #374151; font-weight: 600; }
                        p, li { font-size: 15px; color: #4b5563; }
                        ul { padding-left: 20px; }
                        li { margin-bottom: 8px; }
                    </style>
                </head>
                <body>
                    ${marked(md)}
                </body>
            </html>
        `;

        // Using standard Windows Microsoft Edge path to avoid large browser download
        const browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
            headless: 'new'
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'load' });
        await page.pdf({
            path: 'Golden_Oak_School_Proposal.pdf',
            format: 'A4',
            margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
            printBackground: true
        });

        await browser.close();
        console.log('PDF generated successfully!');
    } catch (err) {
        console.error('Failed to generate PDF:', err);
    }
})();
