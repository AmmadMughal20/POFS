import { IBaseEntity } from "./Base"
import { IBranch } from "./BranchSchema"
import { IProduct } from "./ProductSchema"
import z from 'zod';

export interface IStock extends IBaseEntity
{
    branchId: string
    productId: number
    Branch?: IBranch
    Product?: IProduct | null
    stockUnits: number
    createdBy?: number | null
    updatedBy?: number | null
}


export const AddStockSchema = z.object({
    branchId: z.string('Branch id is required'),
    productId: z.int('Product id is required'),
    stockUnits: z.int('Enter unit in stock'),
    createdBy: z.int('Created by is required')
})

export const EditStockSchema = z.object({
    branchId: z.string('Branch id is required'),
    productId: z.int('Product id is required'),
    stockUnits: z.int('Enter unit in stock'),
    updatedBy: z.int('Updated by is required')
})