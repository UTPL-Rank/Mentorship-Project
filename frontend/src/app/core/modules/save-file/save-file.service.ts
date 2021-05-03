import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SaveFileService {
    constructor() { }

    async save(fileName: string, fileContent: string): Promise<void> {

        const link = document.createElement('a');
        link.setAttribute('href', fileContent);
        link.setAttribute('download', fileName);
        document.body.appendChild(link); // Required for FF

        link.click();

        document.body.removeChild(link);
    }
}
