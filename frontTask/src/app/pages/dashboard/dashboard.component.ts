import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { env } from '../../core/environment/environment.dev';
import { FormsModule } from '@angular/forms';

interface Task {
  taskId?: number;
  id?: number;
  title?: string;
  status?: string;
  deadline?: string;
  priority?: string;
  assignedToUserId?: number;
  githubLink?: string;

  verified?: boolean;
  verifiedAt?: string;
  verificationMessage?: string;
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, FormsModule],
  styles: [`

    :host {
      --bg:        #f6f7fb;
      --card:      #ffffff;
      --border:    rgba(0,0,0,0.07);
      --ink:       #111827;
      --ink-soft:  #374151;
      --ink-muted: #9ca3af;
      --accent:    #6366f1;
      --accent-lt: #eef2ff;
      --green:     #10b981;
      --green-lt:  #d1fae5;
      --amber:     #f59e0b;
      --amber-lt:  #fef3c7;
      --red:       #ef4444;
      --red-lt:    #fee2e2;
      --blue:      #3b82f6;
      --blue-lt:   #dbeafe;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── PAGE ── */
    .page {
      min-height: 100vh;
      padding: 2.5rem 1.5rem 4rem;
    }
    .inner { max-width: 900px; margin: 0 auto; }

    /* ── WELCOME ── */
    .welcome {
      margin-bottom: 2rem;
      animation: fadeUp .4s ease both;
    }
    .welcome-greeting {
      font-size: 1.65rem;
      font-weight: 800;
      color: var(--ink);
      letter-spacing: -.025em;
      line-height: 1.2;
    }
    .welcome-sub {
      font-size: 14px;
      color: var(--ink-muted);
      margin-top: 5px;
    }

    /* ── STAT GRID ── */
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 1.75rem;
    }
    @media (max-width: 640px) { .stat-grid { grid-template-columns: repeat(2,1fr); } }

    .stat-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 1.15rem 1.25rem 1rem;
      animation: fadeUp .4s ease both;
      transition: box-shadow .2s, transform .2s;
      position: relative;
      overflow: hidden;
    }
    .stat-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      border-radius: 18px 18px 0 0;
    }
    .stat-card:nth-child(1)::before { background: #a5b4fc; }
    .stat-card:nth-child(2)::before { background: var(--blue); }
    .stat-card:nth-child(3)::before { background: var(--green); }
    .stat-card:nth-child(4)::before { background: var(--red); }
    .stat-card:nth-child(1) { animation-delay: .05s; }
    .stat-card:nth-child(2) { animation-delay: .10s; }
    .stat-card:nth-child(3) { animation-delay: .15s; }
    .stat-card:nth-child(4) { animation-delay: .20s; }
    .stat-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,.08); transform: translateY(-2px); }

    .stat-icon {
      width: 34px; height: 34px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
    }
    .stat-icon svg { width: 18px; height: 18px; }
    .icon-total  { background: var(--accent-lt); color: var(--accent); }
    .icon-prog   { background: var(--blue-lt);   color: var(--blue); }
    .icon-done   { background: var(--green-lt);  color: var(--green); }
    .icon-over   { background: var(--red-lt);    color: var(--red); }

    .stat-label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: .05em;
      text-transform: uppercase;
      color: var(--ink-muted);
      margin-bottom: 4px;
    }
    .stat-value {
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -.03em;
      line-height: 1;
    }
    .v-total { color: var(--ink); }
    .v-prog  { color: var(--blue); }
    .v-done  { color: var(--green); }
    .v-over  { color: var(--red); }

    /* ── TASKS CARD ── */
    .tasks-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 20px;
      overflow: hidden;
      animation: fadeUp .4s ease .25s both;
      box-shadow: 0 4px 24px rgba(0,0,0,.05);
    }
    .tasks-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.1rem 1.5rem;
      border-bottom: 1px solid var(--border);
    }
    .tasks-head-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .tasks-head-icon {
      width: 32px; height: 32px;
      background: var(--accent-lt);
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .tasks-head-icon svg { width: 17px; height: 17px; stroke: var(--accent); }
    .tasks-head-title {
      font-size: 14px;
      font-weight: 800;
      color: var(--ink);
      letter-spacing: -.01em;
    }
    .view-all {
      font-size: 12px;
      font-weight: 700;
      color: var(--accent);
      text-decoration: none;
      padding: 5px 12px;
      background: var(--accent-lt);
      border-radius: 20px;
      transition: opacity .15s;
      letter-spacing: .01em;
    }
    .view-all:hover { opacity: .7; }

    /* ── LOADING ── */
    .loading-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 3.5rem;
      gap: 12px;
      color: var(--ink-muted);
      font-size: 13px;
    }
    .spinner {
      width: 26px; height: 26px;
      border: 2.5px solid var(--border);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin .7s linear infinite;
    }

    /* ── TASK ROW ── */
    .task-row {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: .95rem 1.5rem;
      border-bottom: 1px solid var(--border);
      transition: background .15s;
    }
    .verified-chip {
  background: #065f46;
  color: #ffffff;
  border: 1px solid #065f46;
}
    .task-row:last-child { border-bottom: none; }
    .task-row:hover { background: #fafbff; }

    .row-accent {
      width: 3.5px;
      height: 38px;
      border-radius: 4px;
      flex-shrink: 0;
    }
    .ra-incomplete { background: #d1d5db; }
    .ra-pending    { background: var(--blue); }
    .ra-complete   { background: var(--green); }

    .row-info { flex: 1; min-width: 0; }
    .row-title {
      font-size: 13.5px;
      font-weight: 700;
      color: var(--ink);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .row-sub {
      font-size: 11.5px;
      color: var(--ink-muted);
      margin-top: 2px;
    }

    /* ── BADGES ── */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 9px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      flex-shrink: 0;
    }
    .badge-dot { width: 5px; height: 5px; border-radius: 50%; }
    .s-incomplete { background: #f3f4f6; color: #6b7280; }
    .s-incomplete .badge-dot { background: #9ca3af; }
    .s-pending    { background: var(--blue-lt); color: #1d4ed8; }
    .s-pending .badge-dot    { background: var(--blue); }
    .s-complete   { background: var(--green-lt); color: #065f46; }
    .s-complete .badge-dot   { background: var(--green); }

    /* ── ACTION BUTTONS ── */
    .actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }

    .act-btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      height: 30px;
      padding: 0 12px;
      border-radius: 8px;
      font-family: inherit;
      font-size: 11.5px;
      font-weight: 700;
      border: 1.5px solid transparent;
      cursor: pointer;
      transition: all .15s;
      white-space: nowrap;
    }
    .act-btn svg { width: 13px; height: 13px; stroke: currentColor; }
    .act-btn:disabled { opacity: .45; cursor: not-allowed; }
    .act-btn:active:not(:disabled) { transform: scale(.96); }

    .btn-start    { background: var(--blue-lt);   color: #1d4ed8; border-color: #93c5fd; }
    .btn-start:hover:not(:disabled)    { background: var(--blue);   color: #fff; border-color: var(--blue); }
    .btn-complete { background: var(--green-lt);  color: #065f46; border-color: #6ee7b7; }
    .btn-complete:hover:not(:disabled) { background: var(--green);  color: #fff; border-color: var(--green); }
    .btn-verify   { background: var(--green-lt);  color: #065f46; border-color: #6ee7b7; }
    .btn-verify:hover:not(:disabled)   { background: var(--green);  color: #fff; border-color: var(--green); }
    .btn-reset    { background: var(--amber-lt);  color: #92400e; border-color: #fcd34d; }
    .btn-reset:hover:not(:disabled)    { background: var(--amber);  color: #fff; border-color: var(--amber); }

    .done-chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      height: 30px;
      padding: 0 12px;
      border-radius: 8px;
      background: var(--green-lt);
      color: #065f46;
      font-size: 11.5px;
      font-weight: 700;
    }

    /* ── EMPTY ── */
    .empty {
      padding: 3.5rem;
      text-align: center;
      color: var(--ink-muted);
      font-size: 13px;
    }

    /* ── ERROR ── */
    .global-err {
      margin-top: 1rem;
      padding: 12px 16px;
      background: var(--red-lt);
      color: #991b1b;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      text-align: center;
    }

    /* ── MODAL ── */
    .modal-bg {
      position: fixed;
      inset: 0;
      background: rgba(17,24,39,.45);
      backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      padding: 1rem;
    }
    .modal {
      background: var(--card);
      border-radius: 22px;
      padding: 2rem;
      width: 100%;
      max-width: 380px;
      box-shadow: 0 32px 80px rgba(0,0,0,.2);
      animation: modalIn .28s cubic-bezier(.16,1,.3,1) both;
    }
    .modal-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
    }
    .modal-title {
      font-size: 1.05rem;
      font-weight: 800;
      color: var(--ink);
      letter-spacing: -.01em;
    }
    .modal-close {
      width: 30px; height: 30px;
      background: var(--bg);
      border: none;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--ink-muted);
      transition: background .15s;
    }
    .modal-close:hover { background: #e5e7eb; }
    .modal-close svg { width: 16px; height: 16px; stroke: currentColor; }

    .form-label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: .06em;
      text-transform: uppercase;
      color: var(--ink-muted);
      margin-bottom: 6px;
    }
    .form-input {
      width: 100%;
      padding: 10px 13px;
      background: var(--bg);
      border: 1.5px solid var(--border);
      border-radius: 11px;
      font-family: inherit;
      font-size: 13.5px;
      color: var(--ink);
      outline: none;
      transition: border-color .2s, box-shadow .2s;
    }
    .form-input:focus {
      border-color: var(--green);
      box-shadow: 0 0 0 3px rgba(16,185,129,.12);
      background: #fff;
    }
    .form-input::placeholder { color: var(--ink-muted); }
    .modal-err { font-size: 12px; color: var(--red); font-weight: 600; margin-top: 8px; }
    .modal-footer { display: flex; gap: 8px; margin-top: 1.5rem; }
    .btn-cancel {
      flex: 1; height: 42px;
      background: var(--bg);
      border: 1.5px solid var(--border);
      border-radius: 12px;
      font-family: inherit;
      font-size: 13px;
      font-weight: 700;
      color: var(--ink-muted);
      cursor: pointer;
      transition: all .15s;
    }
    .btn-cancel:hover { background: #e5e7eb; color: var(--ink); }
    .btn-confirm {
      flex: 2; height: 42px;
      background: var(--green);
      color: #fff;
      border: none;
      border-radius: 12px;
      font-family: inherit;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: all .15s;
    }
    .btn-confirm:hover:not(:disabled) { background: #059669; }
    .btn-confirm:disabled { opacity: .5; cursor: not-allowed; }

    /* ── ANIMATIONS ── */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes modalIn {
      from { opacity: 0; transform: scale(.94) translateY(10px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `],
  template: `
    <div class="page">
      <div class="inner">

        <!-- ── Welcome ── -->
        <div class="welcome">
          <h1 class="welcome-greeting">Good morning, {{ username }} 👋</h1>
          <p class="welcome-sub">Here's what's happening with your tasks today.</p>
        </div>

        <!-- ── Stats ── -->
        <div class="stat-grid">
          <div class="stat-card">
            <div class="stat-icon icon-total">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
            <div class="stat-label">Total</div>
            <div class="stat-value v-total">{{ loading ? '—' : stats[0].value }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon icon-prog">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>
            </div>
            <div class="stat-label">In Progress</div>
            <div class="stat-value v-prog">{{ loading ? '—' : stats[1].value }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon icon-done">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div class="stat-label">Completed</div>
            <div class="stat-value v-done">{{ loading ? '—' : stats[2].value }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon icon-over">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>
            </div>
            <div class="stat-label">Overdue</div>
            <div class="stat-value v-over">{{ loading ? '—' : stats[3].value }}</div>
          </div>
        </div>

        <!-- ── Tasks Card ── -->
        <div class="tasks-card">
          <div class="tasks-head">
            <div class="tasks-head-left">
              <div class="tasks-head-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>
              </div>
              <span class="tasks-head-title">{{ isMember ? 'My Tasks' : 'Recent Tasks' }}</span>
            </div>
            <a [routerLink]="isMember ? '/my-tasks' : '/tasks'" class="view-all">View all →</a>
          </div>

          <div *ngIf="loading" class="loading-wrap">
            <div class="spinner"></div>
            <span>Loading tasks…</span>
          </div>

          <ng-container *ngIf="!loading">
            <div *ngFor="let t of recentTasks" class="task-row">

              <!-- accent -->
              <div class="row-accent"
                [class.ra-incomplete]="t.status === 'INCOMPLETE'"
                [class.ra-pending]="t.status === 'PENDING'"
                [class.ra-complete]="t.status === 'COMPLETE'">
              </div>

              <div class="row-info">
                <div class="row-title">{{ t.title }}</div>
                <div class="row-sub">{{ t.deadline ? 'Due ' + t.deadline : 'No deadline' }}</div>
              </div>

              <span class="badge"
                [class.s-incomplete]="t.status === 'INCOMPLETE'"
                [class.s-pending]="t.status === 'PENDING'"
                [class.s-complete]="t.status === 'COMPLETE'">
                <span class="badge-dot"></span>
                {{ t.status | titlecase }}
              </span>

              <!-- MEMBER -->
              <div class="actions" *ngIf="isMember">
                <button *ngIf="t.status === 'INCOMPLETE'" class="act-btn btn-start"
                  [disabled]="actionLoadingId === getTaskId(t)" (click)="startTask(t)">
                  <svg fill="none" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"/></svg>
                  {{ actionLoadingId === getTaskId(t) ? '…' : 'Start' }}
                </button>
                <button *ngIf="t.status === 'PENDING'" class="act-btn btn-complete"
                  (click)="openCompleteModal(t)">
                  <svg fill="none" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                  Complete
                </button>
<span *ngIf="t.status === 'COMPLETE' && !t.verified" class="done-chip">
  ✓ Submitted
</span>

<span *ngIf="t.status === 'COMPLETE' && t.verified" class="done-chip verified-chip">
  ✓ Verified - No changes required
</span>              </div>

              <!-- LEADER -->
              <div class="actions" *ngIf="isLeader">
           <button *ngIf="t.status === 'COMPLETE' && !t.verified" class="act-btn btn-verify"
  [disabled]="actionLoadingId === getTaskId(t)" (click)="verifyTask(t)">
  <svg fill="none" viewBox="0 0 24 24" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
  {{ actionLoadingId === getTaskId(t) ? '…' : 'Verify' }}
</button>

<span *ngIf="t.status === 'COMPLETE' && t.verified" class="done-chip verified-chip">
  ✓ Verified
</span>
            <button *ngIf="t.status === 'PENDING' || (t.status === 'COMPLETE' && !t.verified)"
  class="act-btn btn-reset"
  [disabled]="actionLoadingId === getTaskId(t)" (click)="resetTask(t)">
  <svg fill="none" viewBox="0 0 24 24" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
  </svg>
  {{ actionLoadingId === getTaskId(t) ? '…' : 'Reset' }}
</button>
              </div>

            </div>

            <div *ngIf="recentTasks.length === 0" class="empty">No tasks yet.</div>
          </ng-container>
        </div>

        <div *ngIf="globalError" class="global-err">{{ globalError }}</div>
      </div>
    </div>

    <!-- ══════════════════════════════════════
         COMPLETE MODAL
    ══════════════════════════════════════ -->
    <div *ngIf="showCompleteModal" class="modal-bg" (click)="closeCompleteModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-head">
          <span class="modal-title">Complete Task</span>
          <button class="modal-close" (click)="closeCompleteModal()">
            <svg fill="none" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <p style="font-size:13px;color:var(--ink-muted);margin-bottom:1.25rem">
          Completing <strong style="color:var(--ink)">{{ selectedTask?.title }}</strong>
        </p>
        <label class="form-label">GitHub Link <span style="font-weight:400;text-transform:none;letter-spacing:0">(optional)</span></label>
        <input [(ngModel)]="githubLink" class="form-input" placeholder="https://github.com/username/repo" />
        <div *ngIf="modalError" class="modal-err">{{ modalError }}</div>
        <div class="modal-footer">
          <button class="btn-cancel" (click)="closeCompleteModal()">Cancel</button>
          <button class="btn-confirm" [disabled]="modalLoading" (click)="submitComplete()">
            {{ modalLoading ? 'Saving…' : '✓ Mark Complete' }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private readonly TASK_API = `${env.API_URL}/tasks`;

  username: string;
  role: string;
  loading = true;
  recentTasks: Task[] = [];
  globalError = '';

  showCompleteModal = false;
  selectedTask: Task | null = null;
  githubLink = '';
  modalError = '';
  modalLoading = false;
  actionLoadingId: number | null = null;

  stats = [
    { value: 0 }, // total
    { value: 0 }, // pending
    { value: 0 }, // complete
    { value: 0 }, // overdue
  ];

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {
    this.username = this.authService.getUsername() ?? 'User';
    this.role     = this.authService.getRole()     ?? '';
  }

  get isManager() { return this.role === 'MANAGER'; }
  get isLeader()  { return this.role === 'TEAM_LEADER'; }
  get isMember()  { return this.role === 'TEAM_MEMBER'; }

  getTaskId(t: Task): number | undefined { return t.taskId ?? t.id; }

  private headers() {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.authService.getToken()}` }) };
  }

  ngOnInit() { this.loadTasks(); }

  loadTasks() {
    this.loading = true;
    const url = this.isMember ? `${this.TASK_API}/my-tasks` : this.TASK_API;
    this.http.get<Task[]>(url, this.headers()).subscribe({
      next: (tasks) => {
        const today = new Date().toISOString().split('T')[0];
        this.stats[0].value = tasks.length;
        this.stats[1].value = tasks.filter(t => t.status === 'PENDING').length;
        this.stats[2].value = tasks.filter(t => t.status === 'COMPLETE').length;
        this.stats[3].value = tasks.filter(t => t.deadline && t.deadline < today && t.status !== 'COMPLETE').length;
        this.recentTasks = tasks.slice(0, 5);
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => { this.loading = false; this.globalError = 'Failed to load tasks.'; this.cdr.markForCheck(); },
    });
  }

  // ✅ PUT http://localhost:8081/api/tasks/{id}/start
  startTask(t: Task) {
    const id = this.getTaskId(t); if (!id) return;
    this.actionLoadingId = id; this.globalError = '';
    this.http.put<Task>(`${this.TASK_API}/${id}/start`, {}, this.headers()).subscribe({
      next: (u) => { this.updateTask(u); this.actionLoadingId = null; this.recalcStats(); this.cdr.markForCheck(); },
error: (err) => {
  console.log('Verify task error:', err);

  this.globalError =
    err?.error?.message ||
    err?.error ||
    'Failed to verify task.';

  this.actionLoadingId = null;
  this.cdr.markForCheck();
},    });
  }

  openCompleteModal(t: Task) {
    this.selectedTask = t; this.githubLink = ''; this.modalError = '';
    this.showCompleteModal = true; this.cdr.markForCheck();
  }
  closeCompleteModal() { this.showCompleteModal = false; this.cdr.markForCheck(); }

submitComplete() {
  const id = this.getTaskId(this.selectedTask!);
  if (!id) return;

  const link = this.githubLink.trim();

  if (!link) {
    this.modalError = 'GitHub link is required.';
    return;
  }

  if (!link.startsWith('https://github.com/')) {
    this.modalError = 'Please enter a valid GitHub repository link.';
    return;
  }

  this.modalLoading = true;
  this.modalError = '';

  const options = {
    ...this.headers(),
    params: new HttpParams().set('githubLink', link)
  };

  this.http.put<Task>(`${this.TASK_API}/${id}/complete`, null, options).subscribe({
    next: (u) => {
      this.updateTask(u);
      this.modalLoading = false;
      this.showCompleteModal = false;
      this.recalcStats();
      this.cdr.markForCheck();
    },
    error: (err) => {
      console.log('Complete task error:', err);

      this.modalError =
        err?.error?.message ||
        err?.error ||
        'Failed to complete task.';

      this.modalLoading = false;
      this.cdr.markForCheck();
    },
  });
}

  // ✅ PUT http://localhost:8888/api/tasks/{id}/verify   ← port 8888 مختلف
verifyTask(t: Task) {
  const id = this.getTaskId(t);
  if (!id) return;

  this.actionLoadingId = id;
  this.globalError = '';

  this.http.put<Task>(`${this.TASK_API}/${id}/verify`, {}, this.headers()).subscribe({
    next: (u) => {
      this.updateTask(u);
      this.actionLoadingId = null;
      this.recalcStats();
      this.cdr.markForCheck();
    },
    error: (err) => {
      console.log('Verify task error:', err);

      this.globalError =
        err?.error?.message ||
        err?.error ||
        'Failed to verify task.';

      this.actionLoadingId = null;
      this.cdr.markForCheck();
    },
  });
}

  // ✅ PUT http://localhost:8081/api/tasks/{id}/reset
  resetTask(t: Task) {
    const id = this.getTaskId(t); if (!id) return;
    this.actionLoadingId = id; this.globalError = '';
    this.http.put<Task>(`${this.TASK_API}/${id}/reset`, {}, this.headers()).subscribe({
      next: (u) => { this.updateTask(u); this.actionLoadingId = null; this.recalcStats(); this.cdr.markForCheck(); },
      error: () => { this.globalError = 'Failed to reset task.'; this.actionLoadingId = null; this.cdr.markForCheck(); },
    });
  }

  private updateTask(updated: Task) {
    this.recentTasks = this.recentTasks.map(x => this.getTaskId(x) === this.getTaskId(updated) ? updated : x);
  }

  private recalcStats() {
    const today = new Date().toISOString().split('T')[0];
    this.stats[0].value = this.recentTasks.length;
    this.stats[1].value = this.recentTasks.filter(t => t.status === 'PENDING').length;
    this.stats[2].value = this.recentTasks.filter(t => t.status === 'COMPLETE').length;
    this.stats[3].value = this.recentTasks.filter(t => t.deadline && t.deadline < today && t.status !== 'COMPLETE').length;
  }
}