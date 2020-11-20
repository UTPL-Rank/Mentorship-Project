import { Injectable } from '@angular/core';
import { CSVGeneratorOptions, FormatGenerator } from './format-generator.interface';



@Injectable({ providedIn: 'root' })
export class CSVGeneratorService implements FormatGenerator {

    constructor() { }

    public generate<T>({ objects, columnsKeys, columnsNames, separator = ',' }: CSVGeneratorOptions<T>): string {

        // validate equal lengths of columns
        if (columnsKeys.length !== columnsNames?.length)
            throw new Error('Lengths of columnsKeys and columnsNames doesn\'t match');

        // get the csv header joined with the separator


        const csvHeader = columnsNames.join(separator) + '\r\n';

        // generate csv content
        const csv = objects.reduce((content: string, element: T) => {

            // get the fields specified in the object columns keys
            const fields = columnsKeys.map(rawKey => {
                // support for sub-attributes defined with key.key value
                const keys = rawKey.split('.');
                let field: { [x: string]: any } | null = null;

                // get value of prop
                keys.forEach(key => field = (field === null) ? element[key] : field = field[key]);

                return field;
            });

            // join current row
            const row = fields.join(separator) + '\r\n';

            return content + row;
        }, csvHeader);

        const csvFormat = 'data:text/csv;charset=utf-8,';
        const universalBOM = '\uFEFF';
        return csvFormat + encodeURIComponent(universalBOM + csv);
    }
}