import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: '/Home', pathMatch: 'full' },

  {
    path: 'Home',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/auth-page.component').then((m) => m.AuthPageComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
     canActivate: [authGuard],
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./pages/dashboard/projects.component').then((m) => m.ProjectsComponent),
     canActivate: [authGuard],
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./pages/tasks/tasks.component').then((m) => m.TasksComponent),
     canActivate: [authGuard],
  },
  {
    path: 'my-tasks',
    loadComponent: () =>
      import('./pages/tasks/MyTasks.component').then((m) => m.MyTasksComponent),
     canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'tasks/create',
    loadComponent: () =>
      import('./pages/tasks/create-task.component').then((m) => m.CreateTaskComponent),
    canActivate: [roleGuard(['MANAGER', 'TEAM_LEADER'])],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/notfound/notfound.component').then((m) => m.NotfoundComponent),
  },
];
