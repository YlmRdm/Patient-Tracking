import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guards';
import { MainLayoutComponent } from './core/layout/main-layout.component';

// Auth Components
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';

// Patient Components
import { PatientListComponent } from './features/patients/patient-list/patient-list.component';
import { PatientDetailComponent } from './features/patients/patient-deatil/patient-detail.component';
import { PatientFormComponent } from './features/patients/patient-form/patient-form.component';

// Dashboard Component
import { DashboardComponent } from './features/dashboard/dashboard.component';

// Profile Component
import { ProfileComponent } from './features/profile/profile.component';
import { UserListComponent } from './features/user/user-list/user-list.component';
import { UserEditComponent } from './features/user/user-edit/user-edit.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'patients',
        component: PatientListComponent
      },
      {
        path: 'patients/new',
        component: PatientFormComponent
      },
      {
        path: 'patients/:id',
        component: PatientDetailComponent
      },
      {
        path: 'patients/:id/edit',
        component: PatientFormComponent
      },
      {
        path: 'users',
        component: UserListComponent
      },
      {
        path: 'users/:id/edit',
        component: UserEditComponent,
        canActivate: [authGuard]
      },
      {
        path: 'profile',
        component: ProfileComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];