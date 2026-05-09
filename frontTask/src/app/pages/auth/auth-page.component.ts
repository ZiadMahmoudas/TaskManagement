import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auth-page.component.html',
})
export class AuthPageComponent {
  activeTab: 'login' | 'register' = 'login';
  showPassword = false;
  loading = false;
  error = '';

  loginForm: FormGroup;
  registerForm: FormGroup;

  roles = [
    { value: 'MANAGER',     label: 'Manager'      },
    { value: 'TEAM_LEADER', label: 'Team leader'  },
    { value: 'TEAM_MEMBER', label: 'Team member'  },
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr:ChangeDetectorRef
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      name:     ['', Validators.required],
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role:     ['MANAGER', Validators.required]
    });
  }

  switchTab(tab: 'login' | 'register') {
    this.activeTab = tab;
    this.error = '';
  }

  onLogin() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.error = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.error = 'Invalid username or password.';
        this.cdr.markForCheck();
      }
    });
  }

  onRegister() {
    if (this.registerForm.invalid) return;
    this.loading = true;
    this.error = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.activeTab = 'login';    
        this.loginForm.reset();
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.error = 'Registration failed. Email may already be used.';
        this.cdr.markForCheck();
      }
    });
  }
}