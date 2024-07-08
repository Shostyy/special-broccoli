export interface RegisterNewUserData {
    login: string,
    email: string,
    role: {
        id: number,
        name: string
    }
}