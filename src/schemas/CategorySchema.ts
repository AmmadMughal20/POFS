import { IProduct } from "./ProductSchema"
import z from 'zod'

export interface ICategory
{
    id?: number
    name: string
    businessId: string
    description?: string
    Products?: IProduct[]
    createdBy?: number | null
    updatedBy?: number | null
}


export const AddCategorySchema = z.object({
    name: z.string('Enter name for category'),
    businessId: z.string('Business id is required'),
    createdBy: z.int('Created by is required')
})

export const EditCategorySchema = z.object({
    id: z.int('Category Id is required'),
    businessId: z.string('Business id is required'),
    name: z.string('Enter name for category'),
    updatedBy: z.int('Updated by is required')
})