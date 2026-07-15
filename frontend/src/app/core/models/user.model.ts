export interface User {
    _id: string;
    fullname: string;
    email: string;
    phoneNumber: number;
    role: 'worker' | 'recruiter';
    profile?: {
        bio?: string;
        skills?: string[];
        resume?: string;
        company?: string;
        profilePhoto?: string;
    };
}

export interface AuthResponse {
    message: string;
    success: boolean;
    user?: User;
}

export interface LoginPayload {
    email: string;
    password: string;
    role: 'worker' | 'recruiter';
}

export interface RegisterPayload {
    fullname: string;
    email: string;
    password: string;
    phoneNumber: number;
    role: 'worker' | 'recruiter';
}
