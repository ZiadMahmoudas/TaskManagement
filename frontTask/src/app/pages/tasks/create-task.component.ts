import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { env } from '../../core/environment/environment.dev';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  styles: [`

    :host {
      --ink: #0a0a0f;
      --ink-soft: #3d3d4d;
      --ink-muted: #8888a0;
      --surface: #f7f7fb;
      --card: #ffffff;
      --accent: #5b4fff;
      --accent-glow: rgba(91,79,255,0.18);
      --accent-light: #ede9ff;
      --danger: #ff4f4f;
      --success: #00c48c;
      --warn: #ffb020;
      --border: rgba(0,0,0,0.07);
      --shadow: 0 8px 40px rgba(91,79,255,0.10);
      font-family: 'DM Sans', sans-serif;
    }

    .page {
      min-height: 100vh;
      color:#fff;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      position: relative;
      overflow: hidden;
    }

    /* Decorative blobs */
    .page::before, .page::after {
      content: '';
      position: fixed;
      border-radius: 50%;
      filter: blur(80px);
      pointer-events: none;
      z-index: 0;
    }
    .page::before {
      width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(91,79,255,0.12) 0%, transparent 70%);
      top: -100px; right: -100px;
      animation: drift 8s ease-in-out infinite alternate;
    }
    .page::after {
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(0,196,140,0.08) 0%, transparent 70%);
      bottom: -80px; left: -80px;
      animation: drift 10s ease-in-out infinite alternate-reverse;
    }

    @keyframes drift {
      from { transform: translate(0,0) scale(1); }
      to   { transform: translate(30px, 20px) scale(1.05); }
    }

    .card-wrap {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 520px;
    }

    /* Back link */
    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      color: var(--ink-muted);
      text-decoration: none;
      margin-bottom: 1.5rem;
      transition: color 0.2s, gap 0.2s;
      letter-spacing: 0.01em;
    }
    .back-btn:hover { color: var(--accent); gap: 10px; }
    .back-btn svg { transition: transform 0.2s; }
    .back-btn:hover svg { transform: translateX(-3px); }

    /* Main card */
    .card {
      background: var(--card);
      border-radius: 24px;
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      overflow: hidden;
      animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
    }

    @keyframes slideUp {
      from { opacity:0; transform: translateY(24px); }
      to   { opacity:1; transform: translateY(0); }
    }

    /* Card header */
    .card-header {
      padding: 2rem 2rem 1.5rem;
      border-bottom: 1px solid var(--border);
      position: relative;
    }
    .card-header::after {
      content: '';
      position: absolute;
      bottom: -1px; left: 2rem;
      width: 48px; height: 2px;
      background: var(--accent);
      border-radius: 2px;
    }

    .header-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: 'Syne', sans-serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--accent);
      background: var(--accent-light);
      padding: 4px 10px;
      border-radius: 20px;
      margin-bottom: 0.75rem;
    }

    .card-title {
      font-family: 'Syne', sans-serif;
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--ink);
      line-height: 1.2;
      margin: 0 0 4px;
    }

    .card-sub {
      font-size: 13.5px;
      color: var(--ink-muted);
      margin: 0;
    }

    /* Form body */
    .card-body {
      padding: 1.75rem 2rem 2rem;
    }

    .field {
      margin-bottom: 1.25rem;
      animation: fadeIn 0.4s ease both;
    }
    .field:nth-child(1) { animation-delay: 0.05s; }
    .field:nth-child(2) { animation-delay: 0.10s; }
    .field:nth-child(3) { animation-delay: 0.15s; }
    .field:nth-child(4) { animation-delay: 0.20s; }

    @keyframes fadeIn {
      from { opacity:0; transform: translateY(8px); }
      to   { opacity:1; transform: translateY(0); }
    }

    .label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: 'Syne', sans-serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--ink-soft);
      margin-bottom: 8px;
    }

    .label-dot {
      width: 5px; height: 5px;
      border-radius: 50%;
      background: var(--accent);
      display: inline-block;
    }

    .input, .textarea, .select {
      width: 100%;
      background: var(--surface);
      border: 1.5px solid var(--border);
      border-radius: 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      color: var(--ink);
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
      box-sizing: border-box;
    }
    .input { height: 44px; padding: 0 14px; }
    .textarea { padding: 12px 14px; resize: none; }
    .select { height: 44px; padding: 0 14px; appearance: none; cursor: pointer; }

    .input:focus, .textarea:focus, .select:focus {
      border-color: var(--accent);
      background: #fff;
      box-shadow: 0 0 0 4px var(--accent-glow);
    }

    .input::placeholder, .textarea::placeholder { color: var(--ink-muted); }

    /* Select wrapper for custom arrow */
    .select-wrap { position: relative; }
    .select-wrap::after {
      content: '';
      position: absolute;
      right: 14px; top: 50%;
      transform: translateY(-50%);
      width: 0; height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 5px solid var(--ink-muted);
      pointer-events: none;
    }

    /* Priority pills */
    .priority-group {
      display: flex;
      gap: 8px;
    }

    .priority-pill {
      flex: 1;
      height: 40px;
      border-radius: 10px;
      border: 1.5px solid var(--border);
      background: var(--surface);
      font-family: 'Syne', sans-serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.18s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }

    .priority-pill.low   { color: #00c48c; }
    .priority-pill.medium{ color: #ffb020; }
    .priority-pill.high  { color: #ff4f4f; }

    .priority-pill.low.active   { background: #e6faf5; border-color: #00c48c; box-shadow: 0 0 0 3px rgba(0,196,140,0.15); }
    .priority-pill.medium.active{ background: #fff8e6; border-color: #ffb020; box-shadow: 0 0 0 3px rgba(255,176,32,0.15); }
    .priority-pill.high.active  { background: #fff0f0; border-color: #ff4f4f; box-shadow: 0 0 0 3px rgba(255,79,79,0.15); }

    .priority-pill:hover:not(.active) { background: #fff; border-color: #ccc; }

    /* Grid row */
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

    /* Error */
    .error-box {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      background: #fff0f0;
      border: 1px solid #ffd0d0;
      border-radius: 10px;
      font-size: 13px;
      color: var(--danger);
      margin-bottom: 1.25rem;
    }

    /* Footer */
    .card-footer {
      display: flex;
      gap: 10px;
      padding-top: 0.5rem;
    }

    .btn-cancel {
      flex: 1;
      height: 46px;
      border: 1.5px solid var(--border);
      background: transparent;
      color: var(--ink-muted);
      border-radius: 12px;
      font-family: 'Syne', sans-serif;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.04em;
      cursor: pointer;
      transition: all 0.18s;
      text-decoration: none;
      display: flex; align-items: center; justify-content: center;
    }
    .btn-cancel:hover { background: var(--surface); color: var(--ink); border-color: #bbb; }

    .btn-submit {
      flex: 2;
      height: 46px;
      background: var(--accent);
      color: #fff;
      border: none;
      border-radius: 12px;
      font-family: 'Syne', sans-serif;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
      overflow: hidden;
    }
    .btn-submit::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
    }
    .btn-submit:hover:not(:disabled) {
      background: #4a3eee;
      box-shadow: 0 6px 20px rgba(91,79,255,0.4);
      transform: translateY(-1px);
    }
    .btn-submit:active:not(:disabled) { transform: translateY(0); }
    .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

    .spinner {
      display: inline-block;
      width: 14px; height: 14px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      margin-right: 6px;
      vertical-align: middle;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `],
  template: `
    <div class="page">
      <div class="card-wrap">

        <!-- Back -->
        <a routerLink="/dashboard" class="back-btn">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
          Back to dashboard
        </a>

        <div class="card">

          <!-- Header -->
          <div class="card-header">
            <div class="header-tag">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                <circle cx="5" cy="5" r="5"/>
              </svg>
              New Task
            </div>
            <h2 class="card-title">Create a task</h2>
            <p class="card-sub">Fill in the details and assign it to your team.</p>
          </div>

          <!-- Body -->
          <div class="card-body">

            <!-- Error -->
            <div *ngIf="error" class="error-box">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {{ error }}
            </div>

            <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">

              <!-- Title -->
              <div class="field">
                <div class="label"><span class="label-dot"></span>Title</div>
                <input formControlName="title" type="text"
                       placeholder="e.g. Design the landing page"
                       class="input" />
              </div>

              <!-- Description -->
              <div class="field">
                <div class="label"><span class="label-dot"></span>Description</div>
                <textarea formControlName="description" rows="3"
                          placeholder="What needs to be done?"
                          class="textarea"></textarea>
              </div>

              <!-- Priority -->
              <div class="field">
                <div class="label"><span class="label-dot"></span>Priority</div>
                <div class="priority-group">
                  <button type="button"
                    class="priority-pill low"
                    [class.active]="taskForm.get('priority')?.value === 'LOW'"
                    (click)="taskForm.get('priority')?.setValue('LOW')">
                    ● Low
                  </button>
                  <button type="button"
                    class="priority-pill medium"
                    [class.active]="taskForm.get('priority')?.value === 'MEDIUM'"
                    (click)="taskForm.get('priority')?.setValue('MEDIUM')">
                    ● Medium
                  </button>
                  <button type="button"
                    class="priority-pill high"
                    [class.active]="taskForm.get('priority')?.value === 'HIGH'"
                    (click)="taskForm.get('priority')?.setValue('HIGH')">
                    ● High
                  </button>
                </div>
              </div>

              <!-- Due date -->
              <div class="field">
                <div class="label"><span class="label-dot"></span>Due Date <span style="font-weight:400;text-transform:none;letter-spacing:0;color:var(--ink-muted)">(optional)</span></div>
                <input formControlName="dueDate" type="date" class="input" />
              </div>

              <!-- Actions -->
              <div class="card-footer">
                <a routerLink="/dashboard" class="btn-cancel">Cancel</a>
                <button type="submit" class="btn-submit" [disabled]="loading || taskForm.invalid">
                  <span *ngIf="loading" class="spinner"></span>
                  {{ loading ? 'Creating…' : 'Create Task →' }}
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  `
})
export class CreateTaskComponent {
  taskForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.taskForm = this.fb.group({
      title:       ['', Validators.required],
      description: [''],
      priority:    ['MEDIUM', Validators.required],
      dueDate:     ['']
    });
  }

  private headers() {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.authService.getToken()}` }) };
  }

  onSubmit() {
    if (this.taskForm.invalid) return;
    this.loading = true;
    this.error = '';

    const body = {
      title:       this.taskForm.value.title,
      description: this.taskForm.value.description,
      priority:    this.taskForm.value.priority,
      deadline:    this.taskForm.value.dueDate || null,
    };

    this.http.post(`${env.API_URL}/tasks`, body, this.headers()).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.error = 'Failed to create task. Please try again.';
        this.loading = false;
      }
    });
  }
}