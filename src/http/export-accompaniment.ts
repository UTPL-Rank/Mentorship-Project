import * as functions from 'firebase-functions';
import * as puppeteer from 'puppeteer';
import { BASE_URL } from '../utils/variables';

async function getPagePDF(url: string) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle0', timeout: 0 });
  await page.addStyleTag({ content: '@page {size: auto}' });

  return await page.pdf({
    format: 'A4',
    landscape: true,
    margin: { bottom: 4 },
  });
}

export const exportToPdf = functions
  .runWith({ memory: '1GB', timeoutSeconds: 540 })
  .https.onRequest(async (req, res) => {
    try {
      const { mentorId, studentId, semesterId, signature } = req.query;

      const filename = `proyecto-mentores-${studentId}-${semesterId}.pdf`;

      const url =
        `${BASE_URL}/panel-control/ficha-acompañamiento` +
        `/${mentorId}/${studentId}/${encodeURIComponent(semesterId)}` +
        `?signature=${encodeURIComponent(signature)}`;

      const content = await getPagePDF(url);

      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.status(200).send(content);
    } catch (error) {
      console.error({
        message: 'An error occurred while exporting accompaniments',
        error,
        data: req.query,
      });
      return null;
    }
  });

// export const exportToPdf = functions
//   .runWith({ memory: '1GB', timeoutSeconds: 540 })
//   .https.onCall(async (data, context) => {
//     if (!context.auth) return null;

//     try {
//       const { mentorId, studentId, semesterId, signature } = data;

//       const url =
//         `${BASE_URL}/ficha-acompañamiento` +
//         `/${mentorId}/${studentId}/${semesterId}` +
//         `?signature=${signature}`;

//       const content = await getPageContent(url);

//       return content.toString('base64');
//     } catch (error) {
//       console.error({
//         message: 'An error occurred while exporting accompaniments',
//         error,
//         data,
//       });
//       return null;
//     }
//   });
