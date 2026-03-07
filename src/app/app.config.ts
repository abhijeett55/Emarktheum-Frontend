import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideStorage , getStorage } from '@angular/fire/storage';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { routes } from './app.routes';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from '../environment/environment';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './_helpers/auth.interceptor';



export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideStorage(() => getStorage()),
    provideDatabase(() => getDatabase()),
    provideAuth(() => getAuth()),

    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),


    provideHttpClient(withFetch(),
      withInterceptorsFromDi()
      ),

        {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },

    provideClientHydration(withEventReplay())
  ]
};
