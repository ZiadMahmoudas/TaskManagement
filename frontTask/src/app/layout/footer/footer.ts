import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  styles: [`
    .footer {
      border-top: 1px solid rgba(255,255,255,0.06);
      padding: 64px 48px 32px;
      font-family: 'DM Sans', sans-serif;
    }
    .footer-top {
      display: flex; justify-content: space-between; gap: 64px; margin-bottom: 48px;
    }
    .nav-logo {
      display: flex; align-items: center; gap: 10px; text-decoration: none;
    }
    .nav-logo-icon {
      width: 32px; height: 32px; background: #2563eb; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
    }
    .nav-logo-text {
      font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800;
      color: #f1f5f9; letter-spacing: -0.02em;
    }
    .footer-brand p {
      font-size: 13px; color: #475569; margin-top: 12px; max-width: 220px; line-height: 1.6;
    }
    .footer-cols { display: flex; gap: 56px; }
    .footer-col h4 {
      font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700;
      letter-spacing: 0.08em; text-transform: uppercase; color: #94a3b8; margin-bottom: 16px;
    }
    .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
    .footer-col ul li a {
      font-size: 13px; color: #475569; text-decoration: none; transition: color 0.2s;
    }
    .footer-col ul li a:hover { color: #94a3b8; }
    .footer-bottom {
      display: flex; justify-content: space-between; align-items: center;
      padding-top: 28px; border-top: 1px solid rgba(255,255,255,0.05);
    }
    .footer-copy { font-size: 12px; color: #334155; }
    .footer-tagline { font-size: 12px; color: #334155; font-style: italic; }

    @media (max-width: 768px) {
      .footer { padding: 48px 20px 32px; }
      .footer-top { flex-direction: column; }
      .footer-cols { gap: 32px; }
      .footer-bottom { flex-direction: column; text-align: center; }
    }
        .footer {
      font-family: 'DM Sans', sans-serif;
      background: #080b12;
      color: #e2e8f0;
      overflow-x: hidden;
    }
  `],
  template: `
    <footer class="footer">
      <div class="footer-top">
        <div class="footer-brand">
          <a routerLink="/" class="nav-logo">
            <div class="nav-logo-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;color:white">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
            </div>
            <span class="nav-logo-text">TaskFlow</span>
          </a>
          <p>The task management platform for teams that take their work seriously.</p>
        </div>

        <div class="footer-cols">
          <div class="footer-col">
            <h4>Product</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#how">How it works</a></li>
              <li><a href="#roles">Roles</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Account</h4>
            <ul>
              <li><a routerLink="/login">Log in</a></li>
              <li><a routerLink="/register">Sign up</a></li>
              <li><a routerLink="/dashboard">Dashboard</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Privacy</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <span class="footer-copy">© 2025 TaskFlow. All rights reserved.</span>
        <span class="footer-tagline">Built for teams that ship.</span>
      </div>
    </footer>
  `
})
export class FooterComponent {}