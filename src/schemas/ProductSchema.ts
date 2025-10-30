import { IBaseEntity } from "./Base"
import { IBranch } from "./BranchSchema"
import { IBusiness } from "./BusinessSchema"
import { ICategory } from "./CategorySchema"
import { IDiscount } from "./DiscountSchema"
import { IOrderItem } from "./OrderItem"
import { IPurchase } from "./PurchaseSchema"
import { IStock } from "./StockSchema"
import { ISupplier } from "./SupplierSchema"
import z from 'zod';

export interface IProduct extends IBaseEntity
{
    id?: number
    title: string
    description: string
    sku: string
    rate: number
    stocks?: IStock[]
    orderItems?: IOrderItem[]
    branchId?: string | null
    Branch?: IBranch | null
    businessId: string
    Business?: IBusiness
    categoryId: number
    Category?: ICategory
    supplierId: number
    Supplier?: ISupplier
    Purchases?: IPurchase[]
    discounts?: IDiscount[]
    createdBy?: number | null
    updatedBy?: number | null
}

export const AddProductSchema = z.object({
    title: z.string('Enter title for product'),
    description: z.string('Enter description'),
    sku: z.string('Enter stock keeping unit'),
    rate: z.number('Enter rate of product'),
    businessId: z.string('Business id is required'),
    branchId: z.string('Branch id is required'),
    categoryId: z.int('Select category of product'),
    supplierId: z.number('Select supplier of product'),
    createdBy: z.int('Created by is required')
})

export const EditProductSchema = z.object({
    id: z.int('Product Id is required'),
    title: z.string('Enter title for product'),
    description: z.string('Enter description'),
    sku: z.string('Enter stock keeping unit'),
    rate: z.number('Enter rate of product'),
    businessId: z.string('Business id is required'),
    branchId: z.string('Branch id is required'),
    categoryId: z.int('Select category of product'),
    supplierId: z.number('Select supplier of product'),
    updatedBy: z.int('Updated by is required')
})