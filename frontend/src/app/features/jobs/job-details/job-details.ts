import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JobService } from '../../../core/services/job.service';
import { Job } from '../../../core/models/job.model';

@Component({
    selector: 'app-job-details',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './job-details.html',
})
export class JobDetailsComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly jobService = inject(JobService);

    job: Job | null = null;
    loading = false;

    ngOnInit() {
        const jobId = this.route.snapshot.paramMap.get('id');
        if (jobId) {
            this.loadJob(jobId);
        }
    }

    loadJob(jobId: string) {
        this.loading = true;
        this.jobService.getJobs().subscribe({
            next: (response) => {
                const foundJob = (response.jobs || []).find((item) => item._id === jobId) || null;
                this.job = foundJob;
                this.loading = false;
            },
            error: () => {
                this.job = null;
                this.loading = false;
            },
        });
    }

    getCompanyName(job: Job | null): string {
        if (!job) {
            return 'Company';
        }

        if (typeof job.company === 'string') {
            return job.company;
        }

        return job.company?.name || 'Company';
    }
}
