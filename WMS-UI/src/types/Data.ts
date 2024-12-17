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

export interface Warehouse {
    id: number,
    name: string,
    location: string,
    createdAt: string,
    updatedAt: string,
}