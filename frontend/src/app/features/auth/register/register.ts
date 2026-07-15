import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [FormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
    templateUrl: './register.html',
})
export class RegisterComponent {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    fullname = '';
    email = '';
    phoneNumber: number | null = null;
    password = '';
    role: 'worker' | 'recruiter' = 'worker';

    onSubmit() {
        this.authService
            .register({
                fullname: this.fullname,
                email: this.email,
                password: this.password,
                phoneNumber: Number(this.phoneNumber),
                role: this.role,
            })
            .subscribe({
                next: () => {
                    this.router.navigateByUrl('/login');
                },
                error: (err) => {
                    alert(err?.error?.message || 'Registration failed');
                },
            });
    }
}
