import { IProduct } from "./ProductSchema"

export interface ISupplier
{
    id: number
    name: string
    email?: string
    phoneNo?: string
    address?: string
    Products?: IProduct[]
}