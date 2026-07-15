import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
    templateUrl: './login.html',
})
export class LoginComponent {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    email = '';
    password = '';
    role: 'worker' | 'recruiter' = 'worker';

    onSubmit() {
        this.authService.login({ email: this.email, password: this.password, role: this.role }).subscribe({
            next: () => {
                this.router.navigateByUrl(this.role === 'recruiter' ? '/recruiter' : '/jobs');
            },
            error: (err) => {
                alert(err?.error?.message || 'Login failed');
            },
        });
    }
}
