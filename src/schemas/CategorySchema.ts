import { IProduct } from "./ProductSchema"

export interface ICategory
{
    id: number
    title: string
    description?: string
    Products?: IProduct[]
}