import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
import { LOCALE_ID, NgModule } from '@angular/core';

registerLocaleData(localeEsAr, 'es-Ar');

@NgModule({
  providers: [{ provide: LOCALE_ID, useValue: 'es-Ar' }]
})
export class LocateModule { }
