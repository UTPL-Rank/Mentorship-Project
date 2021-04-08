import { Component, EventEmitter, Output } from '@angular/core';
import { ReadFileService } from './read-file.service';
@Component({
  selector: 'sgm-read-file',
  templateUrl: './read-file.component.html',
  providers: [
    ReadFileService
  ]
})
export class ReadFileComponent {

  constructor(
    private readonly fileReader: ReadFileService,
  ) { }

  @Output()
  public upload: EventEmitter<string> = new EventEmitter();

  private file: File | null = null;

  public async fileChange(event: any) {
    // reset variables
    this.upload.emit('');
    this.file = null;

    // read file
    this.file = event?.target?.files[0];

    // read if file
    const sub = this.fileReader.read$(this.file).subscribe(payload => {
      if (payload)
        this.upload.emit(payload);

      sub.unsubscribe();
    });
  }

  public get fileName() {
    return !!this.file ? this.file.name : 'Selecciona un archivo';
  }

}
