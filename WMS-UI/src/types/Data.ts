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
    warehouseName: string,
    location: string,
    createdAt?: string,
    updatedAt?: string,
}

export interface ItemCategory {
    id: number,
    itemCategoryName: string,
    itemCategoryDescription: string,
}

export interface Item {
    id: number,
    itemName: string,
    price: number,
    imageUrl: string,
    stock: number,
    itemCategoryName: string,
    warehouseName: string,
}