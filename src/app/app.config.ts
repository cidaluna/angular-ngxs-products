import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { ProductState } from './state/product.state';
import { importProvidersFrom } from '@angular/core';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // provê HttpClient para os serviços que usam HttpClient
    provideHttpClient(),

    // otimiza detecção de mudanças com zone.js
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    // provê o store do NGXS com o nosso estado ProductState
    // observe: provideStore aceita um array com states.
    // provideStore([ProductState])
    importProvidersFrom(NgxsModule.forRoot([ProductState]))
  ]
};
