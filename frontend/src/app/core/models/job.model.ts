export interface Job {
    _id?: string;
    title: string;
    description: string;
    requirements: string[];
    salary: number;
    location: string;
    jobType: string;
    experienceLevel: string;
    position: string;
    company?: string | {
        _id: string;
        name?: string;
    };
    companyId?: string;
    createdAt?: string;
    created_by?: string;
}

export interface JobsResponse {
    jobs: Job[];
    success: boolean;
}
