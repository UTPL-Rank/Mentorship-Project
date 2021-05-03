import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StringToCsvParserService<T = Array<string>> {

  public parse$(content: string): Observable<Array<T>> {
    const data = content
      .split(/\r\n|\n/)
      .filter(line => line.trim() !== '')
      .map(line => (line.split(/,|;/g) as unknown as T));

    return of(data);
  }
}
