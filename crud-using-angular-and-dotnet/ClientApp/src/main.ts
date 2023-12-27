import { enableProdMode, importProvidersFrom } from '@angular/core';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { AddEmployeeComponent } from './app/add-employee/add-employee.component';
import { FetchEmployeeComponent } from './app/fetch-employee/fetch-employee.component';
import { HomeComponent } from './app/home/home.component';
import { provideRouter } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import {
  withInterceptorsFromDi,
  provideHttpClient,
} from '@angular/common/http';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

const providers = [{ provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }];

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, ReactiveFormsModule),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'employee/fetch', component: FetchEmployeeComponent },
      { path: 'employee/add', component: AddEmployeeComponent },
      { path: 'employee/edit/:employeeId', component: AddEmployeeComponent },
    ]),
  ],
}).catch((err) => console.log(err));
