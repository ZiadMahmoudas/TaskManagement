import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notfound',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div class="text-center">
        <p class="text-8xl font-semibold text-gray-200 mb-4">404</p>
        <h1 class="text-xl font-semibold text-gray-800 mb-2">Page not found</h1>
        <p class="text-gray-400 text-sm mb-6">The page you're looking for doesn't exist.</p>
        <a routerLink="/dashboard"
           class="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          Go to dashboard
        </a>
      </div>
    </div>
  `
})
export class NotfoundComponent {}