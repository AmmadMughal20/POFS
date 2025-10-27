import { IProduct } from "./ProductSchema"
import z from 'zod'

export interface ISupplier
{
    id?: number
    name: string
    email?: string | null
    phoneNo?: string
    address?: string | null
    Products?: IProduct[],
    businessId: string,
    createdBy?: number | null
    updatedBy?: number | null
}

export const AddSupplierSchema = z.object({
    name: z.string('Enter name for supplier'),
    businessId: z.string('Business id is required'),
    createdBy: z.int('Created by is required')
})

export const EditSupplierSchema = z.object({
    id: z.int('Supplier Id is required'),
    businessId: z.string('Business id is required'),
    name: z.string('Enter name for category'),
    updatedBy: z.int('Updated by is required')
})