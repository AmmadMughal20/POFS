import { IProduct } from "./ProductSchema"

export interface IPurchase
{
    id: number
    productId: number
    Product?: IProduct
    quantity: number
    costPrice: number
}