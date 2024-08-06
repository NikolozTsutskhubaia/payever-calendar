import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {NgxsModule} from "@ngxs/store";
import {NgxsReduxDevtoolsPluginModule} from "@ngxs/devtools-plugin";
import {ActivityState} from "./core/state/activity.state";
import {NgxsStoragePluginModule} from "@ngxs/storage-plugin";

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(
      NgxsModule.forRoot([ActivityState])
    ),
    importProvidersFrom(
      NgxsReduxDevtoolsPluginModule.forRoot(),NgxsStoragePluginModule.forRoot({
        keys:[ 'appointments']
      })),
    ]
};
