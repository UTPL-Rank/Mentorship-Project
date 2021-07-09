import { Injectable } from '@angular/core';

// import * as puppeteer from 'puppeteer';

@Injectable({
  providedIn: 'root'
})
export class PDFService {

  constructor() { }

  BASE_URL = 'https://sgmentores.web.app';

  // async getPagePDF(url: string) {
  //   const browser = await puppeteer.launch({
  //     headless: true,
  //     args: ['--no-sandbox', '--disable-setuid-sandbox'],
  //   });
  //
  //   const page = await browser.newPage();
  //
  //   await page.goto(url, { waitUntil: 'networkidle0', timeout: 0 });
  //   await page.addStyleTag({ content: '@page {size: auto}' });
  //
  //   return await page.pdf({
  //     format: 'A4',
  //     landscape: true,
  //     margin: { bottom: 4 },
  //   });
  // }

}
