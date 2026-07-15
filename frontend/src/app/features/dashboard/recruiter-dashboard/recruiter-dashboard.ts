import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JobService } from '../../../core/services/job.service';
import { CompanyService } from '../../../core/services/company.service';
import { Job } from '../../../core/models/job.model';
import { Company } from '../../../core/models/company.model';

@Component({
    selector: 'app-recruiter-dashboard',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './recruiter-dashboard.html',
})
export class RecruiterDashboardComponent implements OnInit {
    private readonly jobService = inject(JobService);
    private readonly companyService = inject(CompanyService);
    private readonly router = inject(Router);

    postedJobs: Job[] = [];
    companies: Company[] = [];
    loading = false;
    loadingCompanies = false;

    title = '';
    description = '';
    requirements = '';
    salary: number | null = null;
    location = '';
    jobType = '';
    experience = '';
    position = '';
    companyName = '';
    companyId = '';
    selectedCompanyId = '';
    companyReady = false;

    ngOnInit() {
        this.loadPostedJobs();
        this.loadCompanies();
    }

    loadPostedJobs() {
        this.loading = true;
        this.jobService.getAdminJobs().subscribe({
            next: (response) => {
                this.postedJobs = response.jobs || [];
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            },
        });
    }

    private normalizeCompany(company: any): Company | null {
        if (!company) {
            return null;
        }

        const id = company._id || company.id;
        const name = company.name;

        if (!id || !name) {
            return null;
        }

        return {
            _id: id,
            name,
            userId: company.userId || '',
        } as Company;
    }

    loadCompanies() {
        this.loadingCompanies = true;
        this.companyService.getCompanies().subscribe({
            next: (response: any) => {
                const companyList = Array.isArray(response?.companies)
                    ? response.companies
                    : Array.isArray(response)
                        ? response
                        : [];

                this.companies = companyList
                    .map((company: any) => this.normalizeCompany(company))
                    .filter((company: Company | null): company is Company => !!company);

                if (this.companies.length > 0 && !this.selectedCompanyId) {
                    this.selectedCompanyId = this.companies[0]._id;
                    this.companyId = this.companies[0]._id;
                    this.companyName = this.companies[0].name;
                    this.companyReady = true;
                }

                this.loadingCompanies = false;
            },
            error: () => {
                this.companies = [];
                this.loadingCompanies = false;
            },
        });
    }

    createCompanyFirst() {
        if (!this.companyName.trim()) {
            alert('Please enter a company name first.');
            return;
        }

        this.companyService.registerCompany(this.companyName).subscribe({
            next: (response: any) => {
                const createdCompany = response?.company || response;
                const normalizedCompany = this.normalizeCompany(createdCompany);

                if (normalizedCompany) {
                    this.companies = [normalizedCompany, ...this.companies.filter((company) => company._id !== normalizedCompany._id)];
                    this.selectedCompanyId = normalizedCompany._id;
                    this.companyId = normalizedCompany._id;
                    this.companyName = normalizedCompany.name;
                    this.companyReady = true;
                }
                alert('Company created successfully. You can now create the job.');
            },
            error: (err) => {
                alert(err?.error?.message || 'Unable to create company');
            },
        });
    }

    selectCompany(company: Company) {
        this.selectedCompanyId = company._id;
        this.companyId = company._id;
        this.companyName = company.name;
        this.companyReady = true;
    }

    createJob() {
        if (!this.title.trim() || !this.description.trim() || !this.location.trim() || !this.jobType.trim() || !this.experience.trim() || !this.position.trim() || !this.requirements.trim()) {
            alert('Please fill in all job fields before creating the job.');
            return;
        }

        if (!this.selectedCompanyId) {
            alert('Please select a company before posting a job.');
            return;
        }

        const payload = {
            title: this.title.trim(),
            description: this.description.trim(),
            requirements: this.requirements.split(',').map((item) => item.trim()).filter(Boolean),
            salary: Number(this.salary) || 0,
            location: this.location.trim(),
            jobType: this.jobType.trim(),
            experience: this.experience.trim(),
            position: this.position.trim(),
            companyId: this.selectedCompanyId,
        };

        this.jobService.createJob(payload).subscribe({
            next: () => {
                this.title = '';
                this.description = '';
                this.requirements = '';
                this.salary = null;
                this.location = '';
                this.jobType = '';
                this.experience = '';
                this.position = '';
                this.loadPostedJobs();
                this.router.navigateByUrl('/recruiter');
            },
            error: (err) => {
                alert(err?.error?.message || 'Unable to create job');
            },
        });
    }
}
