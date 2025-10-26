import { IBaseEntity } from "./Base"
import { IBranch } from "./BranchSchema"
import { IBusiness } from "./BusinessSchema"
import { ICategory } from "./CategorySchema"
import { IDiscount } from "./DiscountSchema"
import { IOrderItem } from "./OrderItem"
import { IPurchase } from "./PurchaseSchema"
import { IStock } from "./StockSchema"
import { ISupplier } from "./SupplierSchema"

export interface IProduct extends IBaseEntity
{
    id: number
    title: string
    description: string
    sku: string
    rate: number
    stocks?: IStock[]
    orderItems?: IOrderItem[]
    branchId: string
    Branch?: IBranch
    businessId: string
    Business?: IBusiness
    categoryId: number
    Category?: ICategory
    supplierId: number
    Supplier?: ISupplier
    Purchases?: IPurchase[]
    discounts?: IDiscount[]
}