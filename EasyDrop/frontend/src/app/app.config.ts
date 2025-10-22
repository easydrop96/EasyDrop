import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { routes } from './app.routes';

const config: SocketIoConfig = { url: 'http://localhost:8000', options: {} };

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    importProvidersFrom(SocketIoModule.forRoot(config))
  ]
};
