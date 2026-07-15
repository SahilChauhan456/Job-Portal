import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatButtonModule, MatIconModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  user = signal(this.authService.getCurrentUser());
  isLoggedIn = computed(() => !!this.user());
  userRole = computed(() => this.user()?.role ?? null);
  menuOpen = signal(false);

  constructor() {
    this.authService.currentUser$.subscribe((user) => this.user.set(user));
  }

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.closeMenu();
      this.router.navigateByUrl('/login');
    });
  }
}
