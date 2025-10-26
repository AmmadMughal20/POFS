import { DiscountType, IBaseEntity } from "./Base"
import { IBranch } from "./BranchSchema"
import { IProduct } from "./ProductSchema"

export interface IDiscount extends IBaseEntity
{
    id: number
    name: string
    type: DiscountType
    value: number
    startDate: Date
    endDate: Date
    Product?: IProduct[]
    Branch?: IBranch[]
    businessId: string
}