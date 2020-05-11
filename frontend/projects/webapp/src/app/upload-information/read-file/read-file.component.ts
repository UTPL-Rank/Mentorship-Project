import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'sgm-read-file',
  templateUrl: './read-file.component.html'
})
export class ReadFileComponent {

  @Output()
  public upload: EventEmitter<string> = new EventEmitter();

  private file: File;

  public async fileChange(event) {
    // reset variables
    this.upload.emit('');
    this.file = null;

    // read file
    this.file = event.target.files[0];

    // read if file
    if (this.file) {
      const csv = await this.readFile();
      this.upload.emit(csv);
    }
  }

  public get fileName() {
    return !!this.file ? this.file.name : 'Selecciona un archivo';
  }

  private readFile(): Promise<string> {
    if (!FileReader) {
      alert('Navegador no compatible. Cambie de navegador web.');
      throw new Error('file-reader/not-compatible');
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsText(this.file);

      reader.onload = (event: any) => resolve(event.target.result as string);
      reader.onerror = (event: any) => reject(event.target.error);
    });
  }
}
