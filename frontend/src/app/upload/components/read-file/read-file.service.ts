import { Injectable } from '@angular/core';
import { from, Observable, of, } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReadFileService {

  public read$(file: File | null): Observable<string | null> {

    if (!file)
      return of(null);

    if (!FileReader) {
      alert('Navegador no compatible. Cambie de navegador web.');
      return of(null);
    }

    return from(this.readWithFileReader(file));

  }

  private readWithFileReader(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsText(file);

      reader.onload = (event: any) => resolve(event.target.result as string);
      reader.onerror = (event: any) => reject(event.target.error);
    });
  }
}
