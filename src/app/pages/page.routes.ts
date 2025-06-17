import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MyClaimsComponent } from './my-claims/my-claims.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { loginGuard } from '../core/core-admin/guards/login.guard';
import { RegisterFormCaseComponent } from './register-form-case/register-form-case.component';

export const PAGE_ROUTES: Routes = [
        {
            path: '',
            component: HomeComponent,
        },
        {
            path: 'my-claims',
            canActivate: [loginGuard],
            component: MyClaimsComponent,
        },
        {
            path: 'register-case',
            canActivate: [loginGuard],
            component: RegisterFormCaseComponent,
        },
        {
            path: '**',
            component: NotFoundComponent
        }
];
