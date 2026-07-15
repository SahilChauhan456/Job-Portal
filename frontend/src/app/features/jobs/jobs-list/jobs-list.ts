import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { JobService } from '../../../core/services/job.service';
import { Job } from '../../../core/models/job.model';

@Component({
    selector: 'app-jobs-list',
    standalone: true,
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink],
    templateUrl: './jobs-list.html',
})
export class JobsListComponent implements OnInit {
    private readonly jobService = inject(JobService);

    jobs: Job[] = [];
    loading = false;
    searchTerm = '';

    ngOnInit() {
        this.loadJobs();
    }

    loadJobs() {
        this.loading = true;
        this.jobService.getJobs(this.searchTerm).subscribe({
            next: (response) => {
                this.jobs = response.jobs || [];
                this.loading = false;
            },
            error: () => {
                this.jobs = [];
                this.loading = false;
            },
        });
    }

    getCompanyName(job: Job): string {
        if (typeof job.company === 'string') {
            return job.company;
        }

        return job.company?.name || 'Company';
    }
}
