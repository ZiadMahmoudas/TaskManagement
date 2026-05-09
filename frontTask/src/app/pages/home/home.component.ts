import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  styles: [`
    .page {
      font-family: 'DM Sans', sans-serif;
      color: #e2e8f0;
      min-height: 100vh;
      overflow-x: hidden;
    }
    .btn-ghost {
      padding: 8px 18px; font-family: 'Syne', sans-serif; font-size: 13px;
      font-weight: 600; color: #64748b; background: transparent;
      border: 1px solid rgba(255,255,255,0.08); border-radius: 10px;
      text-decoration: none; transition: all 0.2s;
    }
    .btn-ghost:hover { color: #e2e8f0; border-color: rgba(255,255,255,0.2); }
    .btn-primary {
      padding: 8px 20px; font-family: 'Syne', sans-serif; font-size: 13px;
      font-weight: 700; color: white; background: #2563eb; border: none;
      border-radius: 10px; text-decoration: none; transition: background 0.2s, transform 0.15s;
    }
    .btn-primary:hover { background: #1d4ed8; transform: translateY(-1px); }

    /* HERO */
    .hero {
      padding: 160px 48px 100px; text-align: center; position: relative;
    }
    .hero-glow {
      position: absolute; top: 80px; left: 50%; transform: translateX(-50%);
      width: 700px; height: 500px;
      background: radial-gradient(ellipse, rgba(37,99,235,0.18) 0%, transparent 70%);
      pointer-events: none;
    }
    .hero-badge {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(37,99,235,0.1); border: 1px solid rgba(37,99,235,0.25);
      border-radius: 999px; padding: 6px 16px; font-size: 11.5px; font-weight: 600;
      letter-spacing: 0.07em; text-transform: uppercase; color: #60a5fa; margin-bottom: 28px;
    }
    .badge-dot {
      width: 6px; height: 6px; background: #3b82f6; border-radius: 50%;
      animation: blink 1.8s ease-in-out infinite;
    }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
    .hero h1 {
      font-family: 'Syne', sans-serif;
      font-size: clamp(40px, 6vw, 68px); font-weight: 800;
      line-height: 1.08; letter-spacing: -0.04em; color: #f8fafc;
      max-width: 780px; margin: 0 auto 20px;
    }
    .hero h1 .accent { color: #3b82f6; }
    .hero p {
      font-size: 17px; color: #64748b; max-width: 480px;
      margin: 0 auto 44px; line-height: 1.7;
    }
    .hero-cta { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
    .btn-hero-primary {
      padding: 14px 32px; font-family: 'Syne', sans-serif; font-size: 14px;
      font-weight: 700; color: white; background: #2563eb; border-radius: 14px;
      text-decoration: none; transition: all 0.2s;
      box-shadow: 0 0 30px rgba(37,99,235,0.35);
    }
    .btn-hero-primary:hover { background: #1d4ed8; transform: translateY(-2px); box-shadow: 0 0 50px rgba(37,99,235,0.5); }
    .btn-hero-secondary {
      padding: 14px 32px; font-family: 'Syne', sans-serif; font-size: 14px;
      font-weight: 600; color: #94a3b8; background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1); border-radius: 14px;
      text-decoration: none; transition: all 0.2s;
    }
    .btn-hero-secondary:hover { color: #e2e8f0; border-color: rgba(255,255,255,0.2); transform: translateY(-2px); }

    /* STATS */
    .stats {
      display: flex; max-width: 720px; margin: 80px auto 0;
      border: 1px solid rgba(255,255,255,0.07); border-radius: 20px;
      background: rgba(255,255,255,0.02); overflow: hidden;
    }
    .stat-item {
      flex: 1; padding: 32px 24px; text-align: center;
      border-right: 1px solid rgba(255,255,255,0.07);
    }
    .stat-item:last-child { border-right: none; }
    .stat-num {
      font-family: 'Syne', sans-serif; font-size: 30px; font-weight: 800;
      color: #f1f5f9; letter-spacing: -0.04em; display: block;
    }
    .stat-label { font-size: 12px; color: #475569; font-weight: 500; margin-top: 4px; display: block; }

    /* FEATURES */
    .features { padding: 120px 48px; max-width: 1100px; margin: 0 auto; }
    .section-tag {
      font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700;
      letter-spacing: 0.1em; text-transform: uppercase; color: #3b82f6; margin-bottom: 12px;
    }
    .section-title {
      font-family: 'Syne', sans-serif; font-size: clamp(28px, 4vw, 42px); font-weight: 800;
      letter-spacing: -0.035em; color: #f1f5f9; line-height: 1.15; margin-bottom: 16px;
    }
    .section-sub { font-size: 15px; color: #64748b; line-height: 1.7; max-width: 460px; margin-bottom: 60px; }
    .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .feature-card {
      background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07);
      border-radius: 18px; padding: 30px;
      transition: border-color 0.25s, background 0.25s, transform 0.2s;
    }
    .feature-card:hover { border-color: rgba(59,130,246,0.3); background: rgba(59,130,246,0.04); transform: translateY(-3px); }
    .feature-card.large { grid-column: span 2; }
    .feature-icon-wrap {
      width: 44px; height: 44px; background: rgba(37,99,235,0.12);
      border: 1px solid rgba(37,99,235,0.2); border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 20px; font-size: 20px;
    }
    .feature-title {
      font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700;
      color: #e2e8f0; margin-bottom: 10px; letter-spacing: -0.02em;
    }
    .feature-desc { font-size: 13.5px; color: #64748b; line-height: 1.65; }

    /* HOW IT WORKS */
    .how { padding: 0 48px 120px; max-width: 1100px; margin: 0 auto; }
    .steps { display: grid; grid-template-columns: repeat(3, 1fr); margin-top: 60px; position: relative; }
    .steps::before {
      content: ''; position: absolute; top: 27px; left: 16.6%; right: 16.6%;
      height: 1px; background: linear-gradient(90deg, transparent, rgba(59,130,246,0.3), rgba(59,130,246,0.3), transparent);
    }
    .step { text-align: center; padding: 0 32px; }
    .step-num {
      width: 56px; height: 56px; border-radius: 50%; background: #0f1623;
      border: 1px solid rgba(59,130,246,0.3); display: flex; align-items: center; justify-content: center;
      margin: 0 auto 24px; font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: #3b82f6;
    }
    .step-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #e2e8f0; margin-bottom: 10px; }
    .step-desc { font-size: 13px; color: #64748b; line-height: 1.65; }

    /* ROLES */
    .roles { padding: 0 48px 120px; max-width: 1100px; margin: 0 auto; }
    .roles-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 60px; }
    .role-card { border-radius: 20px; padding: 36px; border: 1px solid rgba(255,255,255,0.07); }
    .role-card.supervisor {
      background: linear-gradient(135deg, rgba(37,99,235,0.12), rgba(37,99,235,0.04));
      border-color: rgba(37,99,235,0.25);
    }
    .role-card.member { background: rgba(255,255,255,0.025); }
    .role-badge {
      display: inline-block; padding: 4px 12px; border-radius: 999px;
      font-size: 11px; font-weight: 700; letter-spacing: 0.06em;
      text-transform: uppercase; margin-bottom: 20px;
    }
    .role-card.supervisor .role-badge { background: rgba(37,99,235,0.15); color: #60a5fa; border: 1px solid rgba(37,99,235,0.3); }
    .role-card.member .role-badge { background: rgba(255,255,255,0.05); color: #94a3b8; border: 1px solid rgba(255,255,255,0.1); }
    .role-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #f1f5f9; letter-spacing: -0.03em; margin-bottom: 12px; }
    .role-desc { font-size: 14px; color: #64748b; line-height: 1.7; margin-bottom: 24px; }
    .role-perks { display: flex; flex-direction: column; gap: 10px; list-style: none; }
    .role-perks li { display: flex; align-items: center; gap: 10px; font-size: 13.5px; color: #94a3b8; }
    .perk-check {
      width: 18px; height: 18px; border-radius: 50%; background: rgba(37,99,235,0.15);
      border: 1px solid rgba(37,99,235,0.3); display: flex; align-items: center;
      justify-content: center; font-size: 10px; color: #3b82f6; flex-shrink: 0;
    }

    /* CTA BANNER */
    .cta-banner {
      margin: 0 auto 120px; max-width: 1004px;
      background: linear-gradient(135deg, #1e3a8a, #1e40af, #1d4ed8);
      border-radius: 24px; padding: 72px 64px; text-align: center; position: relative; overflow: hidden;
    }
    .cta-banner::before {
      content: ''; position: absolute; top: -60px; right: -60px;
      width: 300px; height: 300px;
      background: radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%);
      border-radius: 50%;
    }
    .cta-banner h2 {
      font-family: 'Syne', sans-serif; font-size: clamp(26px, 4vw, 40px);
      font-weight: 800; color: white; letter-spacing: -0.04em; margin-bottom: 14px;
    }
    .cta-banner p { font-size: 15px; color: rgba(255,255,255,0.65); margin-bottom: 36px; line-height: 1.6; }
    .btn-white {
      padding: 14px 36px; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
      color: #1e40af; background: white; border-radius: 14px; text-decoration: none;
      display: inline-block; transition: transform 0.15s, box-shadow 0.2s;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    }
    .btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.3); }

    /* FOOTER */
    .footer {
      border-top: 1px solid rgba(255,255,255,0.06);
      padding: 64px 48px 32px;
    }
    .footer-top {
      display: flex; justify-content: space-between; gap: 64px; margin-bottom: 48px;
    }
    .footer-brand p {
      font-size: 13px; color: #475569; margin-top: 12px; max-width: 220px; line-height: 1.6;
    }
    .footer-cols { display: flex; gap: 56px; }
    .footer-col h4 {
      font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700;
      letter-spacing: 0.08em; text-transform: uppercase; color: #94a3b8; margin-bottom: 16px;
    }


    @media (max-width: 768px) {

      .hero { padding: 120px 20px 80px; }
      .features, .how, .roles { padding-left: 20px; padding-right: 20px; }
      .features-grid { grid-template-columns: 1fr; }
      .feature-card.large { grid-column: span 1; }
      .steps { grid-template-columns: 1fr; gap: 36px; }
      .steps::before { display: none; }
      .roles-grid { grid-template-columns: 1fr; }
      .cta-banner { margin: 0 20px 80px; padding: 48px 28px; }
      .stats { margin: 60px 20px 0; }

    }
  `],
  template: `
    <div class="page">

      <!-- HERO -->
      <section class="hero">
        <div class="hero-glow"></div>
        <div class="hero-badge"><span class="badge-dot"></span>Task Management Platform</div>
        <h1>Run your team.<br><span class="accent">Without the chaos.</span></h1>
        <p>Assign tasks, track progress in real time, and always deliver on time — with a clear permission system for managers and members.</p>
        <div class="hero-cta">
          <a routerLink="/register" class="btn-hero-primary">Get started free</a>
          <a routerLink="/login" class="btn-hero-secondary">Log in</a>
        </div>
      </section>

      <!-- STATS -->
      <div class="stats">
        <div class="stat-item">
          <span class="stat-num">10k+</span>
          <span class="stat-label">Tasks Completed</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">500+</span>
          <span class="stat-label">Active Teams</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">99.9%</span>
          <span class="stat-label">Uptime</span>
        </div>
      </div>

      <!-- FEATURES -->
      <section class="features" id="features">
        <div class="section-tag">Features</div>
        <h2 class="section-title">Everything you need<br>in one place</h2>
        <p class="section-sub">TaskFlow gives you everything from assignment to delivery — not just Kanban boards.</p>

        <div class="features-grid">
          <div class="feature-card large">
            <div class="feature-icon-wrap">📋</div>
            <div class="feature-title">Smart Task Management</div>
            <p class="feature-desc">Create tasks, set priorities, and define deadlines. Link every task to a specific team member and track each step from a single control panel with Drag & Drop support.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon-wrap">📊</div>
            <div class="feature-title">Manager Dashboard</div>
            <p class="feature-desc">See what's happening in your team in real time — who's working, who's behind, and where you need to step in.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon-wrap">👤</div>
            <div class="feature-title">Personal Profiles</div>
            <p class="feature-desc">Every member has a profile showing their tasks, achievements, and completion rate. Performance evaluation becomes objective and transparent.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon-wrap">🔔</div>
            <div class="feature-title">Instant Notifications</div>
            <p class="feature-desc">No deadline or update will go unnoticed. Notifications are delivered instantly inside the platform or via email.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon-wrap">🔐</div>
            <div class="feature-title">Permission System</div>
            <p class="feature-desc">Manager, Member, or Guest — each role has defined permissions. Full control over who sees what and who can edit what.</p>
          </div>
        </div>
      </section>

      <!-- HOW IT WORKS -->
      <section class="how" id="how">
        <div class="section-tag">How it works</div>
        <h2 class="section-title">3 steps and you're done</h2>
        <p class="section-sub">No training or complex setup required. Get started in two minutes.</p>
        <div class="steps">
          <div class="step">
            <div class="step-num">01</div>
            <div class="step-title">Create your account</div>
            <p class="step-desc">Sign up as a Manager or Member and build your team in seconds.</p>
          </div>
          <div class="step">
            <div class="step-num">02</div>
            <div class="step-title">Assign tasks</div>
            <p class="step-desc">Define tasks, sort by priority, and assign them to the right team members.</p>
          </div>
          <div class="step">
            <div class="step-num">03</div>
            <div class="step-title">Track and deliver</div>
            <p class="step-desc">Monitor progress from the dashboard and always deliver projects on time.</p>
          </div>
        </div>
      </section>

      <!-- ROLES -->
      <section class="roles" id="roles">
        <div class="section-tag">Roles</div>
        <h2 class="section-title">Two roles, one system</h2>
        <p class="section-sub">TaskFlow is built on a clear permission system that fits every team.</p>
        <div class="roles-grid">
          <div class="role-card supervisor">
            <span class="role-badge">Supervisor</span>
            <div class="role-title">Manager</div>
            <p class="role-desc">The manager sees everything and controls everything — from task assignment to performance evaluation.</p>
            <ul class="role-perks">
              <li><span class="perk-check">✓</span> Create and assign tasks</li>
              <li><span class="perk-check">✓</span> Full access to team dashboard</li>
              <li><span class="perk-check">✓</span> Assign members and manage permissions</li>
              <li><span class="perk-check">✓</span> Performance and achievement reports</li>
            </ul>
          </div>
          <div class="role-card member">
            <span class="role-badge">Member</span>
            <div class="role-title">Team Member</div>
            <p class="role-desc">Members see their tasks and profile and can communicate with the team effortlessly.</p>
            <ul class="role-perks">
              <li><span class="perk-check">✓</span> View assigned tasks</li>
              <li><span class="perk-check">✓</span> Personal profile with achievements</li>
              <li><span class="perk-check">✓</span> Update task status</li>
              <li><span class="perk-check">✓</span> Instant notifications for any update</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- CTA BANNER -->
      <div class="cta-banner">
        <h2>Ready to get started with your team?</h2>
        <p>Join thousands of teams using TaskFlow to organize their work and deliver on time.</p>
        <a routerLink="/register" class="btn-white">Start for free now</a>
      </div>

    </div>
  `
})
export class HomeComponent {
  isManager = false;
}