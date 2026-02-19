import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideStorage , getStorage } from '@angular/fire/storage';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from '../environment/environment';




export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideStorage(() => getStorage()),
    provideDatabase(() => getDatabase()),

    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideClientHydration(withEventReplay())
  ]
};
