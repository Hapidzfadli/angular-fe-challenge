import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { EmployeeListComponent } from './features/employee/employee-list/employee-list.component';
import { EmployeeAddComponent } from './features/employee/employee-add/employee-add.component';
import { EmployeeEditComponent } from './features/employee/employee-edit/employee-edit.component';
import { EmployeeDetailComponent } from './features/employee/employee-detail/employee-detail.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'employees',
        pathMatch: 'full'
      },
      {
        path: 'employees',
        component: EmployeeListComponent
      },
      {
        path: 'employees/add',
        component: EmployeeAddComponent
      },
      {
        path: 'employees/edit/:id',
        component: EmployeeEditComponent
      },
      {
        path: 'employees/detail/:id',
        component: EmployeeDetailComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
