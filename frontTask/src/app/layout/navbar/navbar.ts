import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { forkJoin, interval, Subscription, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { env } from '../../core/environment/environment.dev';

interface Notification {
  id: number;
  message: string;
  read: boolean;
  createdAt?: string;
  source?: 'task' | 'project';
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
  styles: [`

  `],
  template: `
<nav class="sticky top-0 z-50 flex items-center justify-between px-6 h-16
            bg-gray-950/95 backdrop-blur border-b border-white/[0.06]">

  <!-- ── Logo ── -->
  <a routerLink="/dashboard" class="flex items-center gap-2.5 shrink-0">
    <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
      <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"
           stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2
             M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
      </svg>
    </div>
    <span class="text-[15px] font-bold text-slate-100 tracking-tight">TaskFlow</span>
  </a>

  <!-- ── Nav Links ── -->
  <ul *ngIf="role === 'MANAGER'"
      class="hidden md:flex items-center gap-1 list-none m-0 p-0">
    <li><a routerLink="/dashboard"
           class="px-3 py-1.5 text-sm text-slate-400 hover:text-slate-100
                  hover:bg-white/[0.06] rounded-lg transition-all">Dashboard</a></li>
    <li><a routerLink="/projects"
           class="px-3 py-1.5 text-sm text-slate-400 hover:text-slate-100
                  hover:bg-white/[0.06] rounded-lg transition-all">Projects</a></li>
    <li><a routerLink="/tasks"
           class="px-3 py-1.5 text-sm text-slate-400 hover:text-slate-100
                  hover:bg-white/[0.06] rounded-lg transition-all">All Tasks</a></li>
  </ul>

  <ul *ngIf="role === 'TEAM_LEADER'"
      class="hidden md:flex items-center gap-1 list-none m-0 p-0">
    <li><a routerLink="/dashboard"
           class="px-3 py-1.5 text-sm text-slate-400 hover:text-slate-100
                  hover:bg-white/[0.06] rounded-lg transition-all">Dashboard</a></li>
    <li><a routerLink="/projects"
           class="px-3 py-1.5 text-sm text-slate-400 hover:text-slate-100
                  hover:bg-white/[0.06] rounded-lg transition-all">Projects</a></li>
    <li><a routerLink="/tasks"
           class="px-3 py-1.5 text-sm text-slate-400 hover:text-slate-100
                  hover:bg-white/[0.06] rounded-lg transition-all">Tasks</a></li>
  </ul>

  <ul *ngIf="role === 'TEAM_MEMBER'"
      class="hidden md:flex items-center gap-1 list-none m-0 p-0">
    <li><a routerLink="/dashboard"
           class="px-3 py-1.5 text-sm text-slate-400 hover:text-slate-100
                  hover:bg-white/[0.06] rounded-lg transition-all">Dashboard</a></li>
    <li><a routerLink="/my-tasks"
           class="px-3 py-1.5 text-sm text-slate-400 hover:text-slate-100
                  hover:bg-white/[0.06] rounded-lg transition-all">My Tasks</a></li>
    <li><a routerLink="/profile"
           class="px-3 py-1.5 text-sm text-slate-400 hover:text-slate-100
                  hover:bg-white/[0.06] rounded-lg transition-all">Profile</a></li>
  </ul>

  <!-- ── Right Actions ── -->
  <div class="flex items-center gap-2">

    <!-- Role Badge -->
    <span class="hidden sm:inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold"
      [ngClass]="{
        'bg-red-500/10 text-red-400':    role === 'MANAGER',
        'bg-amber-500/10 text-amber-400': role === 'TEAM_LEADER',
        'bg-blue-500/10 text-blue-400':  role === 'TEAM_MEMBER'
      }">{{ roleLabel }}</span>

    <!-- Divider -->
    <div class="w-px h-6 bg-white/[0.07] mx-1"></div>

    <!-- ── Notification Bell ── -->
    <div class="relative">
      <button (click)="toggleNotif()"
        class="relative w-8 h-8 flex items-center justify-center rounded-lg
               text-slate-400 hover:text-slate-100 hover:bg-white/[0.06]
               transition-all">
        <svg class="w-[15px] h-[15px]" fill="none" viewBox="0 0 24 24"
             stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0
               00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0
               .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
        <span *ngIf="unreadCount > 0"
          class="absolute -top-1 -right-1 min-w-[16px] h-4 px-1
                 bg-red-500 text-white text-[10px] font-bold
                 rounded-full flex items-center justify-center">
          {{ unreadCount > 9 ? '9+' : unreadCount }}
        </span>
      </button>

      <!-- Dropdown -->
      <div *ngIf="notifOpen"
        class="absolute right-0 top-[calc(100%+8px)] w-80
               bg-gray-900 border border-white/[0.08] rounded-xl
               shadow-2xl shadow-black/50 z-[300] max-h-[420px] overflow-y-auto">

        <!-- Header -->
        <div class="sticky top-0 flex items-center justify-between
                    px-4 py-3 bg-gray-900 border-b border-white/[0.06]">
          <span class="text-sm font-semibold text-slate-100">Notifications</span>
          <button (click)="markAllRead()"
            class="text-[11px] text-blue-400 hover:underline bg-transparent border-none cursor-pointer">
            Mark all read
          </button>
        </div>

        <!-- Empty -->
        <div *ngIf="notifications.length === 0"
          class="px-4 py-7 text-center text-xs text-slate-500">
          No notifications yet
        </div>

        <!-- Items -->
        <div *ngFor="let n of notifications"
          class="px-4 py-3 border-b border-white/[0.04] last:border-0
                 cursor-pointer transition-colors hover:bg-white/[0.04]"
          [class.bg-blue-500/[0.07]]="!n.read"
          (click)="markRead(n)">
          <div class="flex items-start gap-2">
            <span *ngIf="!n.read"
              class="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
            <p class="text-[12.5px] text-slate-300 leading-relaxed">{{ n.message }}</p>
          </div>
          <div class="flex items-center gap-2 mt-1"
               [class.pl-3.5]="!n.read">
            <span class="px-1.5 py-0.5 rounded text-[10px] font-semibold"
              [ngClass]="n.source === 'task'
                ? 'bg-blue-500/15 text-blue-400'
                : 'bg-purple-500/15 text-purple-400'">
              {{ n.source }}
            </span>
            <span *ngIf="n.createdAt" class="text-[11px] text-slate-500">
              {{ n.createdAt | date:'MMM d, h:mm a' }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- ── End Bell ── -->

    <!-- Divider -->
    <div class="w-px h-6 bg-white/[0.07] mx-1"></div>

    <!-- Avatar + Name -->
    <div class="flex items-center gap-2.5">
      <div class="w-8 h-8 rounded-full bg-blue-950 border border-blue-400/30
                  flex items-center justify-center text-[11px] font-bold
                  text-blue-400 cursor-pointer hover:border-blue-400/60 transition-all"
        [routerLink]="isMember ? '/profile' : null"
        [title]="isMember ? 'View profile' : username">
        {{ initials }}
      </div>
      <div class="hidden sm:block leading-tight">
        <p class="text-[13px] font-semibold text-slate-100">{{ username }}</p>
        <p class="text-[11px] text-slate-500">{{ roleLabel }}</p>
      </div>
    </div>

    <!-- Logout -->
    <button (click)="logout()" title="Logout"
      class="w-8 h-8 flex items-center justify-center rounded-lg
             text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
      <svg class="w-[15px] h-[15px]" fill="none" viewBox="0 0 24 24"
           stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0
             01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
      </svg>
    </button>
  </div>
</nav>
  `
})
export class NavbarComponent implements OnInit, OnDestroy {
  private readonly TASK_NOTIF_API    = `${env.API_URL}/notifications`;
  private readonly PROJECT_NOTIF_API = `${env.API_URL}/notifications`;

  username: string;
  role: string;
  userId: string;

  notifications: Notification[] = [];
  notifOpen = false;
  private pollSub?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.username = this.authService.getUsername() ?? 'User';
    this.role     = this.authService.getRole()     ?? '';
    this.userId   = String(this.authService.getUserId() ?? '');
  }

  // ── Getters ──────────────────────────────────────────────────────────────
  get initials()    { return this.username.slice(0, 2).toUpperCase(); }
  get isMember()    { return this.role === 'TEAM_MEMBER'; }
  get canCreateTask() { return ['MANAGER', 'TEAM_LEADER'].includes(this.role); }
  get roleLabel() {
    return (
      { MANAGER: 'Manager', TEAM_LEADER: 'Team Leader', TEAM_MEMBER: 'Member' }[this.role]
      ?? this.role
    );
  }
  get unreadCount() { return this.notifications.filter(n => !n.read).length; }

  // ── Lifecycle ────────────────────────────────────────────────────────────
  ngOnInit() {
    this.fetchNotifications();
    // Poll كل 30 ثانية
    this.pollSub = interval(30_000).subscribe(() => this.fetchNotifications());
  }

  ngOnDestroy() { this.pollSub?.unsubscribe(); }

  // ── Helpers ───────────────────────────────────────────────────────────────
  private headers() {
    return {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.authService.getToken()}` }),
    };
  }

  // ── Notifications ─────────────────────────────────────────────────────────
  fetchNotifications() {
    if (!this.userId) return;

    forkJoin({
      task: this.http
        .get<Notification[]>(`${this.TASK_NOTIF_API}/${this.userId}`, this.headers())
        .pipe(catchError(() => of([]))),
      project: this.http
        .get<Notification[]>(`${this.PROJECT_NOTIF_API}/${this.userId}`, this.headers())
        .pipe(catchError(() => of([]))),
    }).subscribe(({ task, project }) => {
      const merged: Notification[] = [
        ...task.map(n    => ({ ...n, source: 'task'    as const })),
        ...project.map(n => ({ ...n, source: 'project' as const })),
      ];
      this.notifications = merged.sort((a, b) => b.id - a.id);
      this.cdr.markForCheck();
    });
  }

  toggleNotif() {
    this.notifOpen = !this.notifOpen;
    if (this.notifOpen) this.fetchNotifications();
    this.cdr.markForCheck();
  }

  markRead(n: Notification) {
    if (n.read) return;
    const base = n.source === 'task' ? this.TASK_NOTIF_API : this.PROJECT_NOTIF_API;
    this.http.put(`${base}/${n.id}/read`, {}, this.headers()).subscribe({
      next: () => { n.read = true; this.cdr.markForCheck(); },
    });
  }

  markAllRead() {
    this.notifications.filter(n => !n.read).forEach(n => this.markRead(n));
  }

  // ── Auth ──────────────────────────────────────────────────────────────────
  logout() { this.authService.logout(); }
}
