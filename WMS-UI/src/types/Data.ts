export interface FormData {
    userName: string,
    password: string,
    role: string,
    status: number,
    captcha?: string
}

export interface User {
    id: number,
    userName: string,
    password: string,
    role: string,
    status: string,
    createdAt: string,
    updatedAt: string,
}