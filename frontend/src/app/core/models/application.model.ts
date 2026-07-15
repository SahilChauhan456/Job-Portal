export interface Application {
    _id: string;
    job: string;
    applicant: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt?: string;
    updatedAt?: string;
}
