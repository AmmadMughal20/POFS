import { IOrder } from "./OrderSchema"
import { IProduct } from "./ProductSchema"

export interface IOrderItem
{
    id: number
    orderId: number
    Order?: IOrder
    productId: number
    Product?: IProduct
    quantity: number
    price: number
}