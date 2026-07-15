import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job, JobsResponse } from '../models/job.model';

interface CreateJobPayload extends Partial<Job> {
    companyId?: string;
    experience?: string;
}

@Injectable({
    providedIn: 'root',
})
export class JobService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = 'http://localhost:8000/api/v1/job';

    getJobs(keyword = ''): Observable<JobsResponse> {
        const params = new HttpParams().set('keyword', keyword);
        return this.http.get<JobsResponse>(`${this.baseUrl}/get`, { params, withCredentials: true });
    }

    getAdminJobs(): Observable<{ jobs: Job[]; success: boolean }> {
        return this.http.get<{ jobs: Job[]; success: boolean }>(`${this.baseUrl}/getadminjobs`, { withCredentials: true });
    }

    createJob(payload: CreateJobPayload) {
        return this.http.post(`${this.baseUrl}/post`, payload, { withCredentials: true });
    }
}
