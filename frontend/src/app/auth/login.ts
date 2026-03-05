import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  auth = inject(AuthService);
  router = inject(Router);

  email = '';
  password = '';
  error: string | null = null;
  loading = false;
  showPassword = false;
  readonly year = new Date().getFullYear();

  submit() {
    this.error = null;
    this.loading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        // on success, navigate to dashboard
        this.loading = false;
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Credenciales inválidas';
      },
    });
  }
}
