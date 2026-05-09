import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { env } from '../../core/environment/environment.dev';
import { User } from '../tasks/tasks.component';

interface Project {
  projectId?: number;
  title?: string;
  description?: string;
  deadline?: string;
  priority?: string;
  status?: string;
  createdByManagerId?: number;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-6xl mx-auto px-6 py-8">

        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-xl font-semibold text-gray-900">Projects</h1>
            <p class="text-gray-400 text-sm mt-1">{{ projects.length }} projects total</p>
          </div>
          <button
            *ngIf="isManager"
            (click)="openCreate()"
            class="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
          >+ New Project</button>
        </div>

        <!-- Loading -->
        <div *ngIf="loading" class="text-center py-20 text-gray-400">Loading projects...</div>

        <!-- Projects Grid — 3 columns -->
        <div *ngIf="!loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">

          <div
            *ngFor="let p of projects"
            class="bg-white border border-gray-100 rounded-xl p-6 flex flex-col hover:shadow-sm transition-shadow"
          >
            <!-- Title + badges -->
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <h3 class="font-semibold text-gray-900 text-sm">{{ p.title }}</h3>
              <span
                class="px-2 py-0.5 rounded-full text-xs font-semibold"
                [ngClass]="{
                  'bg-red-100 text-red-600':    p.priority === 'HIGH',
                  'bg-yellow-100 text-yellow-600': p.priority === 'MEDIUM',
                  'bg-green-100 text-green-600': p.priority === 'LOW'
                }"
              >{{ p.priority }}</span>
              <span
                class="px-2 py-0.5 rounded-full text-xs font-semibold"
                [ngClass]="{
                  'bg-gray-100 text-gray-600':  p.status === 'NOT_STARTED',
                  'bg-blue-100 text-blue-600':  p.status === 'IN_PROGRESS',
                  'bg-green-100 text-green-600': p.status === 'COMPLETED'
                }"
              >{{ p.status }}</span>
            </div>

            <!-- Description -->
            <p class="text-gray-400 text-sm mb-1 line-clamp-2">{{ p.description }}</p>
            <p class="text-gray-300 text-xs mb-4">Deadline: {{ p.deadline }}</p>

            <!-- Spacer -->
            <div class="flex-1"></div>

            <!-- Actions — Manager only -->
            <div *ngIf="isManager" class="flex items-center gap-2 mt-2">
              <button
                (click)="openEdit(p)"
                class="px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >Edit</button>
              <button
                (click)="confirmDelete(p)"
                class="px-3 py-1.5 text-xs bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
              >Delete</button>
            </div>
          </div>

          <!-- Empty -->
          <div
            *ngIf="projects.length === 0"
            class="col-span-full bg-white border border-gray-100 rounded-xl p-16 text-center"
          >
            <p class="text-gray-400 text-sm">No projects yet.</p>
            <button
              *ngIf="isManager"
              (click)="openCreate()"
              class="mt-4 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
            >Create first project</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== CREATE POPUP ===== -->
    <div
      *ngIf="showCreate"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      (click)="closeCreate()"
    >
      <div class="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl" (click)="$event.stopPropagation()">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">New Project</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">Title</label>
            <input [(ngModel)]="form.title" placeholder="Project title"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-purple-400" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">Description</label>
            <textarea [(ngModel)]="form.description" rows="3" placeholder="Project description"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-purple-400 resize-none"></textarea>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">Deadline</label>
            <input [(ngModel)]="form.deadline" type="date"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-purple-400" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">Priority</label>
            <select [(ngModel)]="form.priority"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-purple-400">
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
       <div>
  <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">Team Leader</label>

  <select
    [(ngModel)]="form.teamLeaderName"
    class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-purple-400"
  >
    <option [ngValue]="null" disabled>Select team leader</option>
    <option *ngFor="let leader of teamLeaders" [ngValue]="leader.name">
      {{ leader.name }}
    </option>
  </select>
</div>
        </div>
        <div *ngIf="formError" class="mt-3 text-red-500 text-xs">{{ formError }}</div>
        <div class="flex gap-3 mt-6">
          <button (click)="closeCreate()"
            class="flex-1 px-4 py-2 border border-gray-200 text-gray-500 text-sm rounded-lg hover:bg-gray-50">Cancel</button>
          <button (click)="submitCreate()" [disabled]="formLoading"
            class="flex-1 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50">
            {{ formLoading ? 'Creating...' : 'Create' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ===== EDIT POPUP ===== -->
    <div
      *ngIf="showEdit"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      (click)="closeEdit()"
    >
      <div class="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl" (click)="$event.stopPropagation()">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Edit Project</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">Title</label>
            <input [(ngModel)]="editForm.title"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">Description</label>
            <textarea [(ngModel)]="editForm.description" rows="3"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 resize-none"></textarea>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">Deadline</label>
            <input [(ngModel)]="editForm.deadline" type="date"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">Priority</label>
            <select [(ngModel)]="editForm.priority"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400">
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">Status</label>
            <select [(ngModel)]="editForm.status"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400">
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
        <div *ngIf="formError" class="mt-3 text-red-500 text-xs">{{ formError }}</div>
        <div class="flex gap-3 mt-6">
          <button (click)="closeEdit()"
            class="flex-1 px-4 py-2 border border-gray-200 text-gray-500 text-sm rounded-lg hover:bg-gray-50">Cancel</button>
          <button (click)="submitEdit()" [disabled]="formLoading"
            class="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {{ formLoading ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ===== DELETE CONFIRM POPUP ===== -->
    <div
      *ngIf="showDelete"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      (click)="closeDelete()"
    >
      <div class="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center" (click)="$event.stopPropagation()">
        <div class="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 class="font-semibold text-gray-900 mb-2">Delete Project?</h3>
        <p class="text-gray-400 text-sm mb-6">
          Are you sure you want to delete <strong>{{ selectedProject?.title }}</strong>? This cannot be undone.
        </p>
        <div class="flex gap-3">
          <button (click)="closeDelete()"
            class="flex-1 px-4 py-2 border border-gray-200 text-gray-500 text-sm rounded-lg hover:bg-gray-50">Cancel</button>
          <button (click)="submitDelete()" [disabled]="formLoading"
            class="flex-1 px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 disabled:opacity-50">
            {{ formLoading ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ProjectsComponent implements OnInit {
  private readonly API = `${env.API_URL}/projects`;
 private readonly TEAM_LEADERS_API = `${env.API_URL}/auth/team-leaders`;
  projects: Project[] = [];
  loading = true;
  formLoading = false;
  formError = '';

  showCreate = false;
  showEdit = false;
  showDelete = false;
  selectedProject: Project | null = null;

  form = { title: '', description: '', deadline: '', priority: 'MEDIUM', teamLeaderName: null as any };
  editForm = { title: '', description: '', deadline: '', priority: '', status: '' };

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
    this.loadProjects();

    if (this.isManager) {
      this.loadTeamLeaders();
    }
  }
  loadProjects() {
    this.loading = true;

    const url = this.isManager
      ? this.API
      : this.isLeader
        ? `${this.API}/leader-view`
        : `${this.API}/member-view`;

    this.http.get<Project[]>(url, this.headers()).subscribe({
      next: (p) => {
        this.projects = p;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }
    loadTeamLeaders() {
    this.http.get<User[]>(this.TEAM_LEADERS_API, this.headers()).subscribe({
      next: (leaders) => {
        this.teamLeaders = leaders;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.log('Load team leaders error:', err);
        this.formError = 'Failed to load team leaders.';
        this.cdr.markForCheck();
      },
    });
  }

openCreate() {
  this.form = {
    title: '',
    description: '',
    deadline: '',
    priority: 'MEDIUM',
    teamLeaderName: null
  };

  this.formError = '';
  this.showCreate = true;
  this.cdr.markForCheck();
}
  closeCreate() { this.showCreate = false; this.cdr.markForCheck(); }

submitCreate() {
  if (!this.form.title || !this.form.deadline || !this.form.teamLeaderName) {
    this.formError = 'Title, deadline and team leader are required.';
    return;
  }

  this.formLoading = true;
  this.formError = '';

  this.http.post<Project>(this.API, this.form, this.headers()).subscribe({
    next: (p) => {
      this.projects = [p, ...this.projects];
      this.formLoading = false;
      this.showCreate = false;
      this.cdr.markForCheck();
    },
    error: (err) => {
      console.log('Create project error:', err);
      this.formError =
        err?.error?.message ||
        err?.error ||
        'Failed to create project.';
      this.formLoading = false;
      this.cdr.markForCheck();
    },
  });
}

  openEdit(p: Project) {
    this.selectedProject = p;
    this.editForm = { title: p.title ?? '', description: p.description ?? '', deadline: p.deadline ?? '', priority: p.priority ?? 'MEDIUM', status: p.status ?? 'NOT_STARTED' };
    this.formError = ''; this.showEdit = true; this.cdr.markForCheck();
  }
  closeEdit() { this.showEdit = false; this.cdr.markForCheck(); }

  submitEdit() {
    if (!this.selectedProject?.projectId) return;
    this.formLoading = true;
    this.http.put<Project>(`${this.API}/${this.selectedProject.projectId}`, this.editForm, this.headers()).subscribe({
      next: (updated) => { this.projects = this.projects.map(p => p.projectId === updated.projectId ? updated : p); this.formLoading = false; this.showEdit = false; this.cdr.markForCheck(); },
      error: () => { this.formError = 'Failed to update project.'; this.formLoading = false; this.cdr.markForCheck(); },
    });
  }

  confirmDelete(p: Project) { this.selectedProject = p; this.showDelete = true; this.cdr.markForCheck(); }
  closeDelete() { this.showDelete = false; this.cdr.markForCheck(); }

  submitDelete() {
    if (!this.selectedProject?.projectId) return;
    this.formLoading = true;
    this.http.delete(`${this.API}/${this.selectedProject.projectId}`, this.headers()).subscribe({
      next: () => { this.projects = this.projects.filter(p => p.projectId !== this.selectedProject?.projectId); this.formLoading = false; this.showDelete = false; this.cdr.markForCheck(); },
      error: () => { this.formLoading = false; this.cdr.markForCheck(); },
    });
  }
  teamLeaders: User[] = [];
}