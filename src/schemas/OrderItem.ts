import { Prisma } from "@prisma/client"
import { IOrder } from "./OrderSchema"
import { IProduct } from "./ProductSchema"

export interface IOrderItem
{
    id?: number
    orderId?: number
    Order?: IOrder
    productId: number
    Product?: IProduct | null
    qty: number
    amount: number | Prisma.Decimal
}