import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { JobsListComponent } from './features/jobs/jobs-list/jobs-list';
import { JobDetailsComponent } from './features/jobs/job-details/job-details';
import { RecruiterDashboardComponent } from './features/dashboard/recruiter-dashboard/recruiter-dashboard';
import { WorkerDashboardComponent } from './features/dashboard/worker-dashboard/worker-dashboard';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: '/recruiter', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'jobs', component: JobsListComponent },
    { path: 'jobs/:id', component: JobDetailsComponent },
    { path: 'worker', component: WorkerDashboardComponent, canActivate: [authGuard] },
    { path: 'recruiter', component: RecruiterDashboardComponent, canActivate: [authGuard] },
];
