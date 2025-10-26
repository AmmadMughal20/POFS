import { IBaseEntity } from "./Base"
import { IBranch } from "./BranchSchema"
import { IProduct } from "./ProductSchema"

export interface IStock extends IBaseEntity
{
    branchId: string
    productId: number
    Branch?: IBranch
    Product?: IProduct
    stockUnits: number
}