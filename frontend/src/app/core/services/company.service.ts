import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class CompanyService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = 'http://localhost:8000/api/v1/company';

    registerCompany(companyName: string) {
        return this.http.post(`${this.baseUrl}/register`, { companyName }, { withCredentials: true });
    }

    getCompanies() {
        return this.http.get(`${this.baseUrl}/get`, { withCredentials: true });
    }
}
