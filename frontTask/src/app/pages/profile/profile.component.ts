import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { env } from '../../core/environment/environment.dev';

interface ProfileDto {
  userId?: string;
  bio?: string;
  githubUsername?: string;
  technicalSkills?: string[];
  completedTasksCount?: number;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush, 
  imports: [CommonModule, FormsModule],
  styles: [
    `

      .card {
        background: #0f172a;
        border: 1px solid rgba(255, 255, 255, 0.08);
        padding: 32px;
        color: #e2e8f0;
      }
      .header {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 32px;
      }
      .big-avatar {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        background: #1e3a5f;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 26px;
        font-weight: 700;
        color: #60a5fa;
        border: 2px solid rgba(96, 165, 250, 0.3);
        flex-shrink: 0;
      }
      .header-info h2 {
        font-size: 20px;
        font-weight: 700;
        margin: 0 0 4px;
      }
      .header-info p {
        font-size: 13px;
        color: #475569;
        margin: 0;
      }
      label {
        display: block;
        font-size: 12px;
        font-weight: 600;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 6px;
      }
      input,
      textarea {
        width: 100%;
        padding: 10px 14px;
        border-radius: 10px;
        font-size: 14px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #e2e8f0;
        outline: none;
        transition: border-color 0.2s;
        box-sizing: border-box;
      }
      input:focus,
      textarea:focus {
        border-color: #2563eb;
      }
      input:disabled,
      textarea:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      textarea {
        resize: vertical;
        min-height: 80px;
      }
      .field {
        margin-bottom: 20px;
      }
      .skills-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 10px;
      }
      .skill-tag {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 12px;
        border-radius: 20px;
        background: rgba(37, 99, 235, 0.15);
        border: 1px solid rgba(37, 99, 235, 0.3);
        font-size: 12px;
        font-weight: 600;
        color: #60a5fa;
      }
      .skill-tag button {
        background: none;
        border: none;
        color: #f87171;
        cursor: pointer;
        font-size: 14px;
        padding: 0;
        line-height: 1;
      }
      .skill-input-row {
        display: flex;
        gap: 8px;
      }
      .skill-input-row input {
        flex: 1;
      }
      .btn-add {
        padding: 10px 16px;
        background: rgba(37, 99, 235, 0.2);
        border: 1px solid rgba(37, 99, 235, 0.4);
        border-radius: 10px;
        color: #60a5fa;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        white-space: nowrap;
      }
      .btn-add:hover {
        background: rgba(37, 99, 235, 0.35);
      }
      .stats-bar {
        display: flex;
        gap: 24px;
        padding: 16px 0;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        margin-bottom: 28px;
      }
      .stat-item {
        text-align: center;
      }
      .stat-value {
        font-size: 22px;
        font-weight: 700;
        color: #60a5fa;
      }
      .stat-label {
        font-size: 11px;
        color: #475569;
        margin-top: 2px;
      }
      .btn-row {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 8px;
      }
      .btn-save {
        padding: 10px 24px;
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 10px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.2s;
      }
      .btn-save:hover {
        background: #1d4ed8;
      }
      .btn-cancel {
        padding: 10px 20px;
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #64748b;
        border-radius: 10px;
        font-size: 13px;
        cursor: pointer;
      }
      .btn-edit {
        padding: 8px 18px;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #94a3b8;
        border-radius: 10px;
        font-size: 13px;
        cursor: pointer;
      }
      .readonly-note {
        font-size: 12px;
        color: #334155;
        text-align: center;
        margin-top: 16px;
      }
      .alert {
        padding: 10px 16px;
        border-radius: 10px;
        font-size: 13px;
        margin-bottom: 16px;
      }
      .alert-success {
        background: rgba(34, 197, 94, 0.1);
        border: 1px solid rgba(34, 197, 94, 0.3);
        color: #4ade80;
      }
      .alert-error {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #f87171;
      }
      .no-profile {
        text-align: center;
        padding: 40px;
      }
      .btn-create {
        padding: 12px 28px;
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        margin-top: 16px;
      }
    `,
  ],
  template: `
    <div class="page">
      <!-- البروفايل موجود -->
      <div class="card" *ngIf="profile">
        <div
          *ngIf="msg"
          class="alert"
          [ngClass]="msgType === 'success' ? 'alert-success' : 'alert-error'"
        >
          {{ msg }}
        </div>

        <div class="header">
          <div class="big-avatar">{{ initials }}</div>
          <div class="header-info">
            <h2>{{ username }}</h2>
            <p>{{ roleLabel }} · ID: {{ profile.userId }}</p>
          </div>
          <button *ngIf="isMember && !editing" class="btn-edit" (click)="startEdit()">
            Edit profile
          </button>
        </div>

        <div class="stats-bar">
          <div class="stat-item">
            <div class="stat-value">{{ profile.completedTasksCount ?? 0 }}</div>
            <div class="stat-label">Completed tasks</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ profile.technicalSkills?.length ?? 0 }}</div>
            <div class="stat-label">Skills</div>
          </div>
        </div>

        <div class="field">
          <label>Bio</label>
          <textarea [(ngModel)]="draft.bio" [disabled]="!editing" rows="3"></textarea>
        </div>

        <div class="field">
          <label>GitHub Username</label>
          <input [(ngModel)]="draft.githubUsername" [disabled]="!editing" />
        </div>

        <div class="field">
          <label>Skills</label>
          <div class="skills-list">
            <span class="skill-tag" *ngFor="let s of draft.technicalSkills">
              {{ s }}
              <button *ngIf="editing" (click)="removeSkill(s)">×</button>
            </span>
            <span *ngIf="!draft.technicalSkills?.length" style="font-size:13px;color:#475569">
              No skills added yet.
            </span>
          </div>
          <div class="skill-input-row" *ngIf="editing">
            <input [(ngModel)]="newSkill" placeholder="e.g. Angular" (keydown.enter)="addSkill()" />
            <button class="btn-add" (click)="addSkill()">+ Add</button>
          </div>
        </div>

        <div class="btn-row" *ngIf="editing">
          <button class="btn-cancel" (click)="cancelEdit()">Cancel</button>
          <button class="btn-save" (click)="saveProfile()">Save changes</button>
        </div>

        <p class="readonly-note" *ngIf="!isMember">
          Viewing as {{ roleLabel }} — profile editing is available to Team Members only.
        </p>
      </div>

      <!-- TEAM_MEMBER ومعندوش profile لسه -->
      <div class="card no-profile" *ngIf="!profile && isMember && !loading">
        <p style="color:#94a3b8">You don't have a profile yet.</p>
        <button class="btn-create" (click)="createProfile()">Create my profile</button>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" style="text-align:center;color:#475569;padding:60px">
        Loading profile...
      </div>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  profile: ProfileDto | null = null;
  draft: ProfileDto = {};
  editing = false;
  newSkill = '';
  msg = '';
  msgType: 'success' | 'error' = 'success';
  loading = true;

  username: string;
  role: string;
  userId: string;

  private readonly API_URL = `${env.API_URL}`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef 
  ) {
    this.username = this.authService.getUsername() ?? 'User';
    this.role = this.authService.getRole() ?? '';
    this.userId = this.authService.getUserId() ?? '';
  }

  ngOnInit() {
    this.loadProfile();
  }

  get initials() {
    return this.username.slice(0, 2).toUpperCase();
  }
  get isMember() {
    return this.role === 'TEAM_MEMBER';
  }
  get roleLabel() {
    return (
      { MANAGER: 'Manager', TEAM_LEADER: 'Team Leader', TEAM_MEMBER: 'Member' }[this.role] ??
      this.role
    );
  }

  private headers() {
    const token = this.authService.getToken();
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  loadProfile() {
    this.loading = true;
    this.http.get<ProfileDto>(`${this.API_URL}/profiles/${this.userId}`, this.headers()).subscribe({
      next: (p) => {
        this.profile = p;
        this.draft = { ...p, technicalSkills: [...(p.technicalSkills ?? [])] };
        this.loading = false;
          this.cdr.markForCheck();
      },
      error: () => {
        this.profile = null;
        this.loading = false;
          this.cdr.markForCheck();
      },
    });
  }

  createProfile() {
    const newProfile: ProfileDto = {
      userId: this.userId,
      bio: '',
      githubUsername: '',
      technicalSkills: [],
    };
    this.http.post<ProfileDto>(`${this.API_URL}/profiles`, newProfile, this.headers()).subscribe({
      next: (p) => {
        this.profile = p;
        this.draft = { ...p, technicalSkills: [...(p.technicalSkills ?? [])] };
        this.editing = true;
        this.showMsg('Profile created! Add your details.', 'success');
          this.cdr.markForCheck();
      },
      error: () => {this.showMsg('Failed to create profile', 'error');
          this.cdr.markForCheck();
      },
    });
  }

  startEdit() {
    this.editing = true;
    this.draft = { ...this.profile!, technicalSkills: [...(this.profile!.technicalSkills ?? [])] };
  }
  cancelEdit() {
    this.editing = false;
    this.newSkill = '';
  }

  addSkill() {
    const s = this.newSkill.trim();
    if (s && !this.draft.technicalSkills?.includes(s)) {
      this.draft.technicalSkills = [...(this.draft.technicalSkills ?? []), s];
    }
    this.newSkill = '';
  }

  removeSkill(skill: string) {
    this.draft.technicalSkills = this.draft.technicalSkills?.filter((s) => s !== skill);
  }

  saveProfile() {
    this.http
      .put<ProfileDto>(`${this.API_URL}/profiles/${this.userId}`, this.draft, this.headers())
      .subscribe({
        next: (p) => {
          this.profile = p;
          this.editing = false;
          this.showMsg('Profile updated successfully!', 'success');
            this.cdr.markForCheck();
        },
        error: () => {this.showMsg('Failed to update profile', 'error');
            this.cdr.markForCheck();
        },
      });
  }

  private showMsg(text: string, type: 'success' | 'error') {
    this.msg = text;
    this.msgType = type;
 this.cdr.markForCheck(); // وده
    setTimeout(() => {
      this.msg = '';
      this.cdr.markForCheck(); // وده
    }, 3000);
  }
}
