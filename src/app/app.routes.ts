import { Routes } from '@angular/router';

import { LoginRoutes } from './login/login.routes';

import { LoginComponent } from './login/login.component';

export const routes: Routes = [
	...LoginRoutes,
	{ path: '**', component: LoginComponent }
];
