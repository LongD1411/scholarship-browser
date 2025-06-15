import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { ScholarshipListComponent } from './component/scholarship.list/scholarship.list.component';
import { SchoolListComponent } from './component/school.list/school.list.component';
import { ScholarshipDetailComponent } from './component/scholarship.detail/scholarship.detail.component';
import { SchoolDetailComponent } from './component/school.detail/school.detail.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { ScholarshipSaveComponent } from './component/scholarship.save/scholarship.save.component';
import { UserGuard } from './guards/user.guard';

export const routes: Routes = [
    {
        path: 'trang-chu',
        component: HomeComponent,
    },
    {
        path: 'dang-nhap',
        component: LoginComponent,
    },
    {
        path: 'dang-ki',
        component: RegisterComponent,
    },
    {
        path: 'hoc-bong',
        component: ScholarshipListComponent
    },
    {
        path: 'hoc-bong/chi-tiet',
        component: ScholarshipDetailComponent
    },
    {
        path: 'hoc-bong/da-luu',
        component: ScholarshipSaveComponent,
        canActivate:[UserGuard]
    },
    {
        path: 'truong-hoc',
        component: SchoolListComponent
    },
    {
        path: 'truong-hoc/chi-tiet',
        component: SchoolDetailComponent
    },
    { path: '**', redirectTo: '/trang-chu', pathMatch: 'full' },
];
