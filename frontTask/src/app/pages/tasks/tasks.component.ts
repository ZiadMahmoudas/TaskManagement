import { env } from './../../core/environment/environment.dev';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

interface Task {
  taskId?: number;
  title?: string;
  description?: string;
  githubLink?: string;
  status?: string;
  priority?: string;
  assignedToUserId?: number;
  projectId?: number;
  verified?: boolean;
}
interface Project { projectId: number; title: string; }
interface User    { userId: number; username: string; }

@Component({
  selector: 'app-tasks',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-[#f6f7fb] px-6 py-8 pb-16 font-[\'Plus_Jakarta_Sans\',sans-serif]">
      <div class="max-w-6xl mx-auto">

        <!-- Header -->
        <div class="flex items-end justify-between mb-7 animate-[fadeUp_.4s_ease_both]">
          <div>
            <h1 class="text-2xl font-extrabold text-[#111827] tracking-tight">Tasks</h1>
            <p class="text-[13px] text-[#9ca3af] mt-0.5">{{ tasks.length }} task{{ tasks.length !== 1 ? 's' : '' }} total</p>
          </div>
          <button *ngIf="isManager" (click)="openCreate()"
            class="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-500 text-white text-[13px] font-bold
                   rounded-xl border-none cursor-pointer transition-colors hover:bg-indigo-600 active:scale-95">
            <svg class="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
            </svg>
            New Task
          </button>
        </div>

        <!-- Loading -->
        <div *ngIf="loading" class="flex flex-col items-center justify-center py-20 gap-3 text-[13px] text-[#9ca3af]">
          <div class="w-7 h-7 border-[2.5px] border-black/10 border-t-indigo-500 rounded-full animate-spin"></div>
          <span>Loading tasks…</span>
        </div>

        <!-- Task Grid — 3 columns -->
        <div *ngIf="!loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-start">

          <div *ngFor="let t of tasks; let i = index"
            class="bg-white border border-black/[0.07] rounded-2xl p-4 flex flex-col relative overflow-hidden
                   transition-all duration-200 hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)]
                   hover:border-black/[0.12] animate-[fadeUp_.35s_ease_both]"
            [style.animation-delay]="i * 40 + 'ms'"
          >
            <!-- coloured left accent bar -->
            <div class="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
              [ngClass]="{
                'bg-[#d1d5db]':  t.status === 'INCOMPLETE',
                'bg-blue-500':   t.status === 'PENDING',
                'bg-emerald-500':t.status === 'COMPLETE'
              }"></div>

            <!-- Title + description -->
            <div class="pl-3 mb-2">
              <div class="text-[14px] font-bold text-[#111827] truncate">{{ t.title }}</div>
              <div *ngIf="t.description" class="text-[12px] text-[#9ca3af] mt-0.5 truncate">{{ t.description }}</div>
            </div>

            <!-- Meta badges -->
            <div class="pl-3 flex flex-wrap items-center gap-1.5 mb-4">

              <!-- Status -->
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold"
                [ngClass]="{
                  'bg-gray-100 text-gray-500':       t.status === 'INCOMPLETE',
                  'bg-blue-100 text-blue-700':       t.status === 'PENDING',
                  'bg-emerald-100 text-emerald-800': t.status === 'COMPLETE'
                }">
                <span class="w-1.5 h-1.5 rounded-full"
                  [ngClass]="{
                    'bg-gray-400':   t.status === 'INCOMPLETE',
                    'bg-blue-500':   t.status === 'PENDING',
                    'bg-emerald-500':t.status === 'COMPLETE'
                  }"></span>
                {{ t.status | titlecase }}
              </span>

              <!-- Priority -->
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold"
                [ngClass]="{
                  'bg-red-100 text-red-800':    t.priority === 'HIGH',
                  'bg-amber-100 text-amber-800':t.priority === 'MEDIUM',
                  'bg-emerald-100 text-emerald-800': t.priority === 'LOW'
                }">
                {{ t.priority | titlecase }}
              </span>

              <!-- Assignee -->
              <span *ngIf="t.assignedToUserId"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-500">
                <svg class="w-3 h-3 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"/>
                </svg>
                {{ getUserName(t.assignedToUserId) }}
              </span>

              <!-- GitHub link -->
              <a *ngIf="t.githubLink" [href]="t.githubLink" target="_blank"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold
                       bg-gray-100 text-gray-600 no-underline hover:bg-gray-200 transition-colors">
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                View PR
              </a>
            </div>

            <!-- Spacer -->
            <div class="flex-1"></div>

            <!-- Actions -->
            <div class="pl-3 flex items-center gap-1.5 flex-wrap">

              <!-- TEAM_LEADER -->
              <button *ngIf="isLeader && t.status === 'INCOMPLETE'"
                class="inline-flex items-center gap-1 h-8 px-3 rounded-[9px] text-[12px] font-bold border border-[#c4b5fd]
                       bg-violet-100 text-violet-600 cursor-pointer transition-all hover:bg-violet-500 hover:text-white hover:border-violet-500 active:scale-95"
                (click)="openAssign(t)">
                <svg class="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"/>
                </svg>
                Assign
              </button>

              <button *ngIf="isLeader && t.status === 'COMPLETE' && !t.verified"
                class="inline-flex items-center gap-1 h-8 px-3 rounded-[9px] text-[12px] font-bold border border-[#6ee7b7]
                       bg-emerald-100 text-emerald-800 cursor-pointer transition-all hover:bg-emerald-500 hover:text-white hover:border-emerald-500 active:scale-95"
                (click)="verifyTask(t)">
                <svg class="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Verify
              </button>

              <span *ngIf="isLeader && t.verified"
                class="text-[12px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                ✓ Verified
              </span>

              <button *ngIf="isLeader && (t.status === 'PENDING' || (t.status === 'COMPLETE' && !t.verified))"
                class="inline-flex items-center gap-1 h-8 px-3 rounded-[9px] text-[12px] font-bold border border-[#fcd34d]
                       bg-amber-100 text-amber-800 cursor-pointer transition-all hover:bg-amber-500 hover:text-white hover:border-amber-500 active:scale-95"
                (click)="resetTask(t)">
                <svg class="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
                </svg>
                Reset
              </button>

              <!-- TEAM_MEMBER -->
              <button *ngIf="isMember && t.status === 'INCOMPLETE'"
                class="inline-flex items-center gap-1 h-8 px-3 rounded-[9px] text-[12px] font-bold border border-[#93c5fd]
                       bg-blue-100 text-blue-700 cursor-pointer transition-all hover:bg-blue-500 hover:text-white hover:border-blue-500 active:scale-95"
                (click)="startTask(t)">
                <svg class="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"/>
                </svg>
                Start
              </button>

              <button *ngIf="isMember && t.status === 'PENDING'"
                class="inline-flex items-center gap-1 h-8 px-3 rounded-[9px] text-[12px] font-bold border border-[#6ee7b7]
                       bg-emerald-100 text-emerald-800 cursor-pointer transition-all hover:bg-emerald-500 hover:text-white hover:border-emerald-500 active:scale-95"
                (click)="openComplete(t)">
                <svg class="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                </svg>
                Complete
              </button>
            </div>
          </div>

          <!-- Empty -->
          <div *ngIf="tasks.length === 0"
            class="col-span-full bg-white border border-dashed border-black/[0.07] rounded-2xl p-16 text-center">
            <div class="w-13 h-13 bg-indigo-50 rounded-[14px] flex items-center justify-center mx-auto mb-3.5">
              <svg class="w-6 h-6 stroke-indigo-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <div class="text-[15px] font-bold text-[#111827] mb-1.5">No tasks yet</div>
            <div class="text-[13px] text-[#9ca3af]">
              <span *ngIf="isManager">Hit "New Task" to create the first one.</span>
              <span *ngIf="!isManager">No tasks have been assigned to you yet.</span>
            </div>
          </div>
        </div>

        <!-- Global Error -->
        <div *ngIf="globalError"
          class="mt-4 px-4 py-3 bg-red-100 text-red-800 rounded-xl text-[13px] font-semibold text-center">
          {{ globalError }}
        </div>

      </div>
    </div>

    <!-- ══════════ CREATE MODAL ══════════ -->
    <div *ngIf="showCreate" class="fixed inset-0 bg-[rgba(17,24,39,.45)] backdrop-blur-md flex items-center justify-center z-[100] p-4" (click)="closeCreate()">
      <div class="bg-white rounded-[22px] p-8 w-full max-w-md shadow-[0_32px_80px_rgba(0,0,0,.2)] animate-[modalIn_.28s_cubic-bezier(.16,1,.3,1)_both]" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between mb-6">
          <span class="text-[1.05rem] font-extrabold text-[#111827] tracking-tight">New Task</span>
          <button class="w-[30px] h-[30px] bg-[#f6f7fb] border-none rounded-lg cursor-pointer flex items-center justify-center text-[#9ca3af] hover:bg-gray-200 hover:text-[#111827] transition-colors" (click)="closeCreate()">
            <svg class="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-[11px] font-bold tracking-[.06em] uppercase text-[#9ca3af] mb-1.5">Title</label>
            <input [(ngModel)]="form.title" placeholder="Task title"
              class="w-full px-3 py-2.5 bg-[#f6f7fb] border-[1.5px] border-black/[0.07] rounded-[11px] text-[13.5px] text-[#111827] outline-none transition-all focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,.12)] focus:bg-white placeholder:text-[#9ca3af]" />
          </div>
          <div>
            <label class="block text-[11px] font-bold tracking-[.06em] uppercase text-[#9ca3af] mb-1.5">Description</label>
            <textarea [(ngModel)]="form.description" rows="3" placeholder="What needs to be done?"
              class="w-full px-3 py-2.5 bg-[#f6f7fb] border-[1.5px] border-black/[0.07] rounded-[11px] text-[13.5px] text-[#111827] outline-none transition-all focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,.12)] focus:bg-white resize-none leading-relaxed"></textarea>
          </div>
          <div>
            <label class="block text-[11px] font-bold tracking-[.06em] uppercase text-[#9ca3af] mb-1.5">Priority</label>
            <select [(ngModel)]="form.priority"
              class="w-full px-3 py-2.5 bg-[#f6f7fb] border-[1.5px] border-black/[0.07] rounded-[11px] text-[13.5px] text-[#111827] outline-none transition-all focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,.12)] focus:bg-white">
              <option value="HIGH">🔴 High</option>
              <option value="MEDIUM">🟡 Medium</option>
              <option value="LOW">🟢 Low</option>
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-bold tracking-[.06em] uppercase text-[#9ca3af] mb-1.5">Project</label>
            <select [(ngModel)]="form.projectId"
              class="w-full px-3 py-2.5 bg-[#f6f7fb] border-[1.5px] border-black/[0.07] rounded-[11px] text-[13.5px] text-[#111827] outline-none transition-all focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,.12)] focus:bg-white">
              <option [ngValue]="null" disabled>Select a project</option>
              <option *ngFor="let p of projects" [ngValue]="p.projectId">{{ p.title }}</option>
            </select>
          </div>
        </div>
        <div *ngIf="formError" class="text-[12px] text-red-500 font-semibold mt-2">{{ formError }}</div>
        <div class="flex gap-2 mt-6">
          <button (click)="closeCreate()" class="flex-1 h-[42px] bg-[#f6f7fb] border-[1.5px] border-black/[0.07] rounded-xl text-[13px] font-bold text-[#9ca3af] cursor-pointer hover:bg-gray-200 hover:text-[#111827] transition-all">Cancel</button>
          <button (click)="submitCreate()" [disabled]="formLoading" class="flex-[2] h-[42px] bg-indigo-500 text-white border-none rounded-xl text-[13px] font-bold cursor-pointer hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {{ formLoading ? 'Creating…' : '+ Create Task' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ══════════ ASSIGN MODAL ══════════ -->
    <div *ngIf="showAssign" class="fixed inset-0 bg-[rgba(17,24,39,.45)] backdrop-blur-md flex items-center justify-center z-[100] p-4" (click)="closeAssign()">
      <div class="bg-white rounded-[22px] p-8 w-full max-w-sm shadow-[0_32px_80px_rgba(0,0,0,.2)] animate-[modalIn_.28s_cubic-bezier(.16,1,.3,1)_both]" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between mb-6">
          <span class="text-[1.05rem] font-extrabold text-[#111827] tracking-tight">Assign Task</span>
          <button class="w-[30px] h-[30px] bg-[#f6f7fb] border-none rounded-lg cursor-pointer flex items-center justify-center text-[#9ca3af] hover:bg-gray-200 hover:text-[#111827] transition-colors" (click)="closeAssign()">
            <svg class="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <p class="text-[13px] text-[#9ca3af] mb-5">Assigning <strong class="text-[#111827]">{{ selectedTask?.title }}</strong></p>
        <div>
          <label class="block text-[11px] font-bold tracking-[.06em] uppercase text-[#9ca3af] mb-1.5">Team Member</label>
          <select [(ngModel)]="assignUserId"
            class="w-full px-3 py-2.5 bg-[#f6f7fb] border-[1.5px] border-black/[0.07] rounded-[11px] text-[13.5px] text-[#111827] outline-none transition-all focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,.12)] focus:bg-white">
            <option [ngValue]="null" disabled>Select a member</option>
            <option *ngFor="let u of users" [ngValue]="u.userId">{{ u.username }}</option>
          </select>
        </div>
        <div *ngIf="formError" class="text-[12px] text-red-500 font-semibold mt-2">{{ formError }}</div>
        <div class="flex gap-2 mt-6">
          <button (click)="closeAssign()" class="flex-1 h-[42px] bg-[#f6f7fb] border-[1.5px] border-black/[0.07] rounded-xl text-[13px] font-bold text-[#9ca3af] cursor-pointer hover:bg-gray-200 hover:text-[#111827] transition-all">Cancel</button>
          <button (click)="submitAssign()" [disabled]="formLoading" class="flex-[2] h-[42px] bg-violet-500 text-white border-none rounded-xl text-[13px] font-bold cursor-pointer hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {{ formLoading ? 'Assigning…' : 'Assign' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ══════════ COMPLETE MODAL ══════════ -->
    <div *ngIf="showComplete" class="fixed inset-0 bg-[rgba(17,24,39,.45)] backdrop-blur-md flex items-center justify-center z-[100] p-4" (click)="closeComplete()">
      <div class="bg-white rounded-[22px] p-8 w-full max-w-sm shadow-[0_32px_80px_rgba(0,0,0,.2)] animate-[modalIn_.28s_cubic-bezier(.16,1,.3,1)_both]" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between mb-6">
          <span class="text-[1.05rem] font-extrabold text-[#111827] tracking-tight">Complete Task</span>
          <button class="w-[30px] h-[30px] bg-[#f6f7fb] border-none rounded-lg cursor-pointer flex items-center justify-center text-[#9ca3af] hover:bg-gray-200 hover:text-[#111827] transition-colors" (click)="closeComplete()">
            <svg class="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <p class="text-[13px] text-[#9ca3af] mb-5">Completing <strong class="text-[#111827]">{{ selectedTask?.title }}</strong></p>
        <div>
          <label class="block text-[11px] font-bold tracking-[.06em] uppercase text-[#9ca3af] mb-1.5">
            GitHub Link <span class="font-normal normal-case tracking-normal">(optional)</span>
          </label>
          <input [(ngModel)]="githubLink" placeholder="https://github.com/…"
            class="w-full px-3 py-2.5 bg-[#f6f7fb] border-[1.5px] border-black/[0.07] rounded-[11px] text-[13.5px] text-[#111827] outline-none transition-all focus:border-emerald-500 focus:shadow-[0_0_0_3px_rgba(16,185,129,.12)] focus:bg-white placeholder:text-[#9ca3af]" />
        </div>
        <div *ngIf="formError" class="text-[12px] text-red-500 font-semibold mt-2">{{ formError }}</div>
        <div class="flex gap-2 mt-6">
          <button (click)="closeComplete()" class="flex-1 h-[42px] bg-[#f6f7fb] border-[1.5px] border-black/[0.07] rounded-xl text-[13px] font-bold text-[#9ca3af] cursor-pointer hover:bg-gray-200 hover:text-[#111827] transition-all">Cancel</button>
          <button (click)="submitComplete()" [disabled]="formLoading" class="flex-[2] h-[42px] bg-emerald-500 text-white border-none rounded-xl text-[13px] font-bold cursor-pointer hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {{ formLoading ? 'Saving…' : '✓ Mark Complete' }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class TasksComponent implements OnInit {
  private readonly API = `${env.API_URL}/tasks`;

  projects: Project[] = [];
  users: User[]       = [];
  tasks: Task[]       = [];

  loading     = true;
  formLoading = false;
  formError   = '';
  globalError = '';

  showCreate   = false;
  showAssign   = false;
  showComplete = false;

  selectedTask: Task | null = null;
  assignUserId: number | null = null;
  githubLink = '';

  form = { title: '', description: '', priority: 'MEDIUM', projectId: null as any };

  role: string;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {
    this.role = this.authService.getRole() ?? '';
  }

  get isManager() { return this.role === 'MANAGER'; }
  get isLeader()  { return this.role === 'TEAM_LEADER'; }
  get isMember()  { return this.role === 'TEAM_MEMBER'; }

  private headers() {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.authService.getToken()}` }) };
  }

  ngOnInit() {
    this.loadTasks();
    if (this.isManager) this.loadProjects();
    if (this.isManager || this.isLeader) this.loadUsers();
  }

  loadTasks() {
    this.loading = true;
    const url = this.isMember ? `${this.API}/my-tasks` : this.API;
    this.http.get<Task[]>(url, this.headers()).subscribe({
      next: (t) => { this.tasks = t; this.loading = false; this.globalError = ''; this.cdr.markForCheck(); },
      error: ()  => { this.loading = false; this.globalError = 'Failed to load tasks.'; this.cdr.markForCheck(); },
    });
  }

  loadProjects() {
    this.http.get<Project[]>(`${env.API_URL}/projects`, this.headers()).subscribe({
      next: (p) => { this.projects = p; this.cdr.markForCheck(); },
      error: () => {},
    });
  }

  loadUsers() {
    this.http.get<User[]>(`${env.API_URL}/users`, this.headers()).subscribe({
      next: (u) => { this.users = u; this.cdr.markForCheck(); },
      error: () => {},
    });
  }

  getUserName(id?: number): string {
    if (!id) return '—';
    return this.users.find(u => u.userId === id)?.username ?? `#${id}`;
  }

  openCreate() {
    this.form = { title: '', description: '', priority: 'MEDIUM', projectId: null };
    this.formError = ''; this.showCreate = true; this.cdr.markForCheck();
  }
  closeCreate() { this.showCreate = false; this.cdr.markForCheck(); }

  submitCreate() {
    if (!this.form.title) { this.formError = 'Title is required.'; return; }
    this.formLoading = true;
    this.http.post<Task>(this.API, this.form, this.headers()).subscribe({
      next: (t) => { this.tasks = [t, ...this.tasks]; this.formLoading = false; this.showCreate = false; this.cdr.markForCheck(); },
      error: ()  => { this.formError = 'Failed to create task.'; this.formLoading = false; this.cdr.markForCheck(); },
    });
  }

  openAssign(t: Task) {
    this.selectedTask = t; this.assignUserId = null; this.formError = '';
    this.showAssign = true; this.cdr.markForCheck();
  }
  closeAssign() { this.showAssign = false; this.cdr.markForCheck(); }

  submitAssign() {
    if (!this.selectedTask?.taskId || !this.assignUserId) { this.formError = 'Please select a team member.'; return; }
    this.formLoading = true;
    this.http.put<Task>(`${this.API}/${this.selectedTask.taskId}/assign`, { assignedToUserId: this.assignUserId }, this.headers()).subscribe({
      next: (u) => { this.tasks = this.tasks.map(t => t.taskId === u.taskId ? u : t); this.formLoading = false; this.showAssign = false; this.cdr.markForCheck(); },
      error: ()  => { this.formError = 'Failed to assign task.'; this.formLoading = false; this.cdr.markForCheck(); },
    });
  }

  startTask(t: Task) {
    if (!t.taskId) return;
    this.globalError = '';
    this.http.put<Task>(`${this.API}/${t.taskId}/start`, {}, this.headers()).subscribe({
      next: (u) => { this.tasks = this.tasks.map(x => x.taskId === u.taskId ? u : x); this.cdr.markForCheck(); },
      error: ()  => { this.globalError = 'Failed to start task.'; this.cdr.markForCheck(); },
    });
  }

  openComplete(t: Task) {
    this.selectedTask = t; this.githubLink = ''; this.formError = '';
    this.showComplete = true; this.cdr.markForCheck();
  }
  closeComplete() { this.showComplete = false; this.cdr.markForCheck(); }

  submitComplete() {
    if (!this.selectedTask?.taskId) return;
    this.formLoading = true;
    const params = this.githubLink ? `?githubLink=${encodeURIComponent(this.githubLink)}` : '';
    this.http.put<Task>(`${this.API}/${this.selectedTask.taskId}/complete${params}`, {}, this.headers()).subscribe({
      next: (u) => { this.tasks = this.tasks.map(t => t.taskId === u.taskId ? u : t); this.formLoading = false; this.showComplete = false; this.cdr.markForCheck(); },
      error: ()  => { this.formError = 'Failed to complete task.'; this.formLoading = false; this.cdr.markForCheck(); },
    });
  }

  verifyTask(t: Task) {
    if (!t.taskId) return;
    this.globalError = '';
    this.http.put<Task>(`${this.API}/${t.taskId}/verify`, {}, this.headers()).subscribe({
      next: (u) => { this.tasks = this.tasks.map(x => x.taskId === u.taskId ? u : x); this.cdr.markForCheck(); },
      error: ()  => { this.globalError = 'Failed to verify task.'; this.cdr.markForCheck(); },
    });
  }

  resetTask(t: Task) {
    if (!t.taskId) return;
    this.globalError = '';
    this.http.put<Task>(`${this.API}/${t.taskId}/reset`, {}, this.headers()).subscribe({
      next: (u) => { this.tasks = this.tasks.map(x => x.taskId === u.taskId ? u : x); this.cdr.markForCheck(); },
      error: ()  => { this.globalError = 'Failed to reset task.'; this.cdr.markForCheck(); },
    });
  }
}