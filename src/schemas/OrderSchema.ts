import { IBaseEntity } from "./Base"
import { IBranch } from "./BranchSchema"
import { ICustomer } from "./CustomerSchema"
import { IOrderItem } from "./OrderItem"

export interface IOrder extends IBaseEntity
{
    id: number
    customerId: number
    Customer?: ICustomer
    branchId: string
    Branch?: IBranch
    totalAmount: number
    status: string
    orderItems?: IOrderItem[]
}