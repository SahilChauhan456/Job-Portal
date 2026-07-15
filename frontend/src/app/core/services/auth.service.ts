import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';
import { AuthResponse, LoginPayload, RegisterPayload, User } from '../models/user.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = 'http://localhost:8000/api/v1/user';

    private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
    readonly currentUser$ = this.currentUserSubject.asObservable();

    constructor() {
        this.restoreSession();
    }

    restoreSession() {
        if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
            const storedUser = window.localStorage.getItem('jobportal_user');
            if (storedUser) {
                try {
                    this.currentUserSubject.next(JSON.parse(storedUser));
                } catch {
                    this.clearSession();
                }
            }
        }
    }

    register(payload: RegisterPayload) {
        return this.http.post<AuthResponse>(`${this.baseUrl}/register`, payload, { withCredentials: true });
    }

    login(payload: LoginPayload) {
        return this.http.post<AuthResponse>(`${this.baseUrl}/login`, payload, { withCredentials: true }).pipe(
            tap((response) => {
                if (response.user) {
                    this.currentUserSubject.next(response.user);
                    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
                        window.localStorage.setItem('jobportal_user', JSON.stringify(response.user));
                    }
                }
            })
        );
    }

    logout() {
        return this.http.get<AuthResponse>(`${this.baseUrl}/logout`, { withCredentials: true }).pipe(
            tap(() => this.clearSession()),
            catchError(() => {
                this.clearSession();
                return of({ success: true, message: 'Logged out locally' } as AuthResponse);
            })
        );
    }

    clearSession() {
        this.currentUserSubject.next(null);
        if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
            window.localStorage.removeItem('jobportal_user');
        }
    }

    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    isAuthenticated(): boolean {
        return !!this.getCurrentUser();
    }
}
