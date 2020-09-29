import * as sgMail from '@sendgrid/mail';
import * as admin from 'firebase-admin/lib';
import * as functions from 'firebase-functions';


export const app = admin.initializeApp();
export const dbFirestore = app.firestore();
export const authentication = admin.auth();
export const fcm = admin.messaging();


export async function sendEmail(msg: any) {
  try {
    const SEND_GRID_API_KEY = functions.config().sendgrid.apikey;

    sgMail.setApiKey(SEND_GRID_API_KEY);
    return await sgMail.send(msg);
  } catch (e) {
    console.log('SEND_GRID_API_KEY not configured');
    return await Promise.resolve(null);
  }
}

/**
 * Generate CSV from Objects
 * =================================================================
 * 
 * @author Bruno Esparza
 * 
 * Generate a string in csv format containing the required columns defined.
 * If the number of elements `columnsKeys` and `columnsNames` doesn't match
 * an error is thrown
 * 
 * @param objects List of objects to generate the csv from
 * @param columnsKeys names of the required columns from the object
 * @param columnsNames name of the column after the csv is generated
 * @param separator separator for the csv
 */
export function GenerateCSVFromObjects(objects: Array<any>, columnsKeys: Array<string>, columnsNames: Array<string>, separator: ';' | ',' = ';'): string {

  // validate equal lengths of columns
  if (columnsKeys.length !== columnsNames?.length)
    throw new Error("Lengths of columnsKeys and columnsNames doesn't match");

  const csvHeader = columnsNames.join(separator) + '\n';

  const csv = objects.reduce((content, element) => {
    // get the fields specified in the object columns keys
    const fields = columnsKeys.map(rawKey => {
      // support for sub-attributes defined with key.key value
      const keys = rawKey.split('.');
      let field: { [x: string]: any; } | null = null;

      // get value of prop
      keys.forEach(key => field = (field === null) ? element[key] : field = field[key]);

      return field;
    });

    // join current row
    const row = fields.join(separator) + '\n';
    return content + row;
  }, csvHeader);

  return csv;
}