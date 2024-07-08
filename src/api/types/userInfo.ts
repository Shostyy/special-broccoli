export interface UserInfo {
    blocked: boolean;
    email: string;
    id: number;
    login: string;
    role: {
        id: number;
        name: string;
    };
}
