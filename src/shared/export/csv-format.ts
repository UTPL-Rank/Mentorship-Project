import { IExport } from "./i-export";
import { IExportCallback } from "./i-export-callback";

export class CSVFormat<T> implements IExport<T> {

    constructor(
        private readonly columnNames: Array<string>,
        private readonly exportable: Array<T>,
        private readonly separator: ';' | ',' = ',',
    ) { }

    private readonly header = 'data:text/csv;charset=utf-8,';

    private readonly universalBOM = '\uFEFF';

    private readonly newLine = '\r\n';

    public export(callbackfn: IExportCallback<T>): string {

        const rows = this.exportable.map(callbackfn);

        const csvData = [this.columnNames, ...rows];


        if (!this.validateItemsHaveSameLength(csvData))
            throw new Error('Not all rows contains the same length');

        const csv = csvData.map(row => row.join(this.separator))
            .join(this.newLine);

        return this.header + encodeURIComponent(this.universalBOM + csv);
    }

    private validateItemsHaveSameLength(rows: Array<Array<string>>) {

        // validate length of all rows is the same
        const allRowSameItems = rows
            .map(row => row.length)
            .every((len, _, arr) => len === arr[0]);

        return allRowSameItems;
    }

}