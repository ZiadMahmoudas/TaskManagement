import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { env } from '../../core/environment/environment.dev';

interface Task {
  taskId?: number;
  id?: number;
  title?: string;
  description?: string;
  status?: string;
  deadline?: string;
  priority?: string;
  githubLink?: string;
}

@Component({
  selector: 'app-my-tasks',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Page wrapper -->
    <div class="page min-h-screen  px-6 py-10 relative overflow-hidden font-sans">

      <!-- Blobs -->
      <div class="fixed top-[-150px] right-[-150px] w-[600px] h-[600px] rounded-full
                  bg-[radial-gradient(circle,rgba(91,79,255,0.10)_0%,transparent_70%)]
                  blur-[90px] pointer-events-none z-0 animate-blob-float"></div>
      <div class="fixed bottom-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full
                  bg-[radial-gradient(circle,rgba(0,196,140,0.08)_0%,transparent_70%)]
                  blur-[90px] pointer-events-none z-0 animate-blob-float-rev"></div>

      <!-- Inner -->
      <div class="max-w-6xl mx-auto relative z-10">

        <!-- Header -->
        <div class="mb-8 animate-slide-up">
          <h1 class="text-2xl font-extrabold text-[#0d0d14] tracking-tight">My Tasks</h1>
          <p class="text-sm text-[#9090a8] mt-1">{{ tasks.length }} tasks assigned to you</p>
        </div>

        <!-- Loading -->
        <div *ngIf="loading" class="text-center py-16 text-sm text-[#9090a8]">
          Loading tasks...
        </div>

        <!-- Task grid: 3 columns -->
        <div *ngIf="!loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          <!-- Task card -->
          <div
            *ngFor="let t of tasks; let i = index"
            class="bg-white border border-black/[0.06] rounded-[18px] p-5 relative overflow-hidden
                   transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]
                   animate-slide-up flex flex-col"
            [style.animation-delay]="(i * 0.05 + 0.05) + 's'"
          >
            <!-- Priority left bar -->
            <div
              class="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[3px]"
              [ngClass]="{
                'bg-[#ef4444]': t.priority === 'HIGH',
                'bg-[#f59e0b]': t.priority === 'MEDIUM',
                'bg-[#00c48c]': t.priority === 'LOW'
              }"
            ></div>

            <!-- Top row -->
            <div class="flex items-start justify-between gap-3 mb-2">
              <div class="flex-1 min-w-0">
                <div class="text-sm font-bold text-[#0d0d14] leading-snug">{{ t.title }}</div>
                <div *ngIf="t.description" class="text-xs text-[#9090a8] mt-0.5 leading-relaxed line-clamp-2">
                  {{ t.description }}
                </div>
              </div>
              <!-- Status badge -->
              <span
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide whitespace-nowrap flex-shrink-0"
                [ngClass]="{
                  'bg-[#f1f1f5] text-[#7070a0]': t.status === 'INCOMPLETE',
                  'bg-blue-100 text-blue-500':    t.status === 'PENDING',
                  'bg-[#e5faf4] text-[#00c48c]':  t.status === 'COMPLETE'
                }"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                {{ t.status }}
              </span>
            </div>

            <!-- Meta row -->
            <div class="flex items-center gap-2 flex-wrap mb-4">
              <span *ngIf="t.deadline" class="text-[11.5px] text-[#9090a8]">Due {{ t.deadline }}</span>
              <span
                *ngIf="t.priority"
                class="text-[10.5px] font-bold tracking-wide px-2 py-0.5 rounded-full"
                [ngClass]="{
                  'bg-red-100 text-[#ef4444]':    t.priority === 'HIGH',
                  'bg-yellow-100 text-[#f59e0b]': t.priority === 'MEDIUM',
                  'bg-[#e5faf4] text-[#00c48c]':  t.priority === 'LOW'
                }"
              >{{ t.priority }}</span>
            </div>

            <!-- Spacer -->
            <div class="flex-1"></div>

            <!-- Actions -->
            <div class="flex items-center gap-2 flex-wrap">

              <!-- INCOMPLETE → Start -->
              <button
                *ngIf="t.status === 'INCOMPLETE'"
                class="h-[34px] px-3.5 rounded-lg text-[11px] font-bold tracking-wide border-none cursor-pointer
                       bg-blue-100 text-blue-500 transition-all duration-150
                       hover:bg-blue-500 hover:text-white hover:shadow-[0_4px_14px_rgba(59,130,246,0.35)]
                       disabled:opacity-45 disabled:cursor-not-allowed"
                [disabled]="actionLoadingId === getTaskId(t)"
                (click)="startTask(t)"
              >
                {{ actionLoadingId === getTaskId(t) ? 'Starting...' : 'Start' }}
              </button>

              <!-- PENDING → Complete -->
              <button
                *ngIf="t.status === 'PENDING'"
                class="h-[34px] px-3.5 rounded-lg text-[11px] font-bold tracking-wide border-none cursor-pointer
                       bg-[#e5faf4] text-[#00c48c] transition-all duration-150
                       hover:bg-[#00c48c] hover:text-white hover:shadow-[0_4px_14px_rgba(0,196,140,0.35)]"
                (click)="openComplete(t)"
              >
                Mark Complete
              </button>

              <!-- COMPLETE -->
              <span
                *ngIf="t.status === 'COMPLETE'"
                class="h-[34px] px-3.5 rounded-lg bg-[#e5faf4] text-[#00c48c] text-[11px] font-bold
                       inline-flex items-center"
              >Done ✓</span>

              <!-- GitHub link -->
              <a
                *ngIf="t.githubLink"
                [href]="t.githubLink"
                target="_blank"
                class="text-xs text-[#5b4fff] font-medium px-1 hover:opacity-70 transition-opacity duration-150 no-underline"
              >GitHub ↗</a>
            </div>
          </div>

          <!-- Empty state -->
          <div
            *ngIf="tasks.length === 0"
            class="col-span-full bg-white border border-black/[0.06] rounded-[18px] p-16 text-center text-sm text-[#9090a8]"
          >
            No tasks assigned to you yet.
          </div>
        </div>

      </div>
    </div>

    <!-- Complete Modal -->
    <div
      *ngIf="showComplete"
      class="fixed inset-0 bg-[rgba(13,13,20,0.55)] backdrop-blur-sm flex items-center justify-center z-50 p-4"
      (click)="closeComplete()"
    >
      <div
        class="bg-white rounded-[22px] p-8 w-full max-w-sm shadow-[0_24px_80px_rgba(0,0,0,0.18)] animate-modal-in"
        (click)="$event.stopPropagation()"
      >
        <div class="text-lg font-extrabold text-[#0d0d14] mb-1">Complete Task</div>
        <div class="text-sm text-[#9090a8] mb-5">{{ selectedTask?.title }}</div>

        <label class="block text-[11px] font-bold tracking-[0.08em] uppercase text-[#44445a] mb-1.5">
          GitHub Link
          <span class="font-normal normal-case tracking-normal text-[#9090a8]">(optional)</span>
        </label>
        <input
          [(ngModel)]="githubLink"
          placeholder="https://github.com/username/repo"
          class="w-full h-[42px] px-3 border-[1.5px] border-black/[0.06] rounded-[10px]
                 text-sm text-[#0d0d14] bg-[#f4f4f9] outline-none transition-all duration-200
                 focus:border-[#00c48c] focus:shadow-[0_0_0_3px_rgba(0,196,140,0.15)] focus:bg-white
                 placeholder:text-[#9090a8]"
        />
        <div *ngIf="completeError" class="text-xs text-[#ef4444] mt-1.5">{{ completeError }}</div>

        <div class="flex gap-2 mt-5">
          <button
            class="flex-1 h-[42px] border-[1.5px] border-black/[0.06] bg-transparent text-[#9090a8]
                   rounded-[10px] text-xs font-bold cursor-pointer transition-all duration-150
                   hover:bg-[#f4f4f9] hover:text-[#0d0d14]"
            (click)="closeComplete()"
          >Cancel</button>
          <button
            class="flex-[2] h-[42px] bg-[#00c48c] text-white border-none rounded-[10px]
                   text-xs font-bold tracking-wide cursor-pointer transition-all duration-150
                   hover:bg-[#00a87a] hover:shadow-[0_4px_16px_rgba(0,196,140,0.35)]
                   disabled:opacity-50 disabled:cursor-not-allowed"
            [disabled]="actionLoading"
            (click)="submitComplete()"
          >
            {{ actionLoading ? 'Saving...' : 'Mark Complete ✓' }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class MyTasksComponent implements OnInit {
  private readonly API = `${env.API_URL}/tasks`;

  tasks: Task[] = [];
  loading = true;
  actionLoading = false;
  actionLoadingId: number | null = null;

  showComplete = false;
  selectedTask: Task | null = null;
  githubLink = '';
  completeError = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  private headers() {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.authService.getToken()}` }) };
  }

  getTaskId(t: Task): number | undefined {
    return t.taskId ?? t.id;
  }

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.http.get<Task[]>(`${this.API}/my-tasks`, this.headers()).subscribe({
      next: (tasks) => { this.tasks = tasks; this.loading = false; this.cdr.markForCheck(); },
      error: () => { this.loading = false; this.cdr.markForCheck(); },
    });
  }

  startTask(t: Task) {
    const id = this.getTaskId(t); if (!id) return;
    this.actionLoadingId = id;
    this.http.put<Task>(`${this.API}/${id}/start`, {}, this.headers()).subscribe({
      next: (updated) => {
        this.tasks = this.tasks.map(x => this.getTaskId(x) === this.getTaskId(updated) ? updated : x);
        this.actionLoadingId = null;
        this.cdr.markForCheck();
      },
      error: () => { this.actionLoadingId = null; this.cdr.markForCheck(); },
    });
  }

  openComplete(t: Task) {
    this.selectedTask = t; this.githubLink = ''; this.completeError = '';
    this.showComplete = true; this.cdr.markForCheck();
  }

  closeComplete() { this.showComplete = false; this.cdr.markForCheck(); }

  submitComplete() {
    const id = this.getTaskId(this.selectedTask!); if (!id) return;
    this.actionLoading = true; this.completeError = '';
    const body = this.githubLink ? { githubLink: this.githubLink } : {};
    this.http.put<Task>(`${this.API}/${id}/complete`, body, this.headers()).subscribe({
      next: (updated) => {
        this.tasks = this.tasks.map(x => this.getTaskId(x) === this.getTaskId(updated) ? updated : x);
        this.actionLoading = false; this.showComplete = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.completeError = 'Failed to complete task. Try again.';
        this.actionLoading = false; this.cdr.markForCheck();
      },
    });
  }
}