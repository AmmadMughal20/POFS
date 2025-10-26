import { BusinessStatus, BusinessType, Province } from "@prisma/client";
import { IBaseEntity } from "./Base"
import { IBranch } from "./BranchSchema"
import { IManager } from "./ManagerSchema"
import { IProduct } from "./ProductSchema"
import z from 'zod';

export interface IBusiness extends IBaseEntity
{
    id: string
    name: string
    type: BusinessType
    Branches?: IBranch[]
    Products?: IProduct[]
    Managers?: IManager[]
    ownerId: number
    status: BusinessStatus
    description?: string | null
    email?: string | null
    phone?: string | null
    website?: string | null
    address?: string | null
    city?: string | null
    province?: Province | null
    country?: string | null
    logoUrl?: string | null
    coverImageUrl?: string | null
    establishedYear?: number | null
    isVerified: boolean
    createdBy?: number | null
    updatedBy?: number | null
}

export const AddBusinessSchema = z.object({
    id: z.string('Business Id is required'),
    name: z.string('Business name is required'),
    type: z.enum(BusinessType),
    description: z.string().optional(),
    establishedYear: z.int('Enter year in number').optional(),
    ownerId: z.int("Select owner"),
    phone: z.string().optional(),
    email: z.string().optional(),
    website: z.string().optional(),
    city: z.string().optional(),
    province: z.string().optional(),
    country: z.string().optional(),
    address: z.string().optional(),
    createdBy: z.int('Created by is required')
});

export const EditBusinessSchema = z.object({
    id: z.string('Business Id is required'),
    name: z.string('Business name is required'),
    type: z.enum(BusinessType, 'Select business type'),
    description: z.string().optional(),
    establishedYear: z.int('Enter year in number').optional(),
    ownerId: z.int("Select owner"),
    phone: z.string().optional(),
    email: z.string().optional(),
    website: z.string().optional(),
    city: z.string().optional(),
    province: z.string().optional(),
    country: z.string().optional(),
    address: z.string().optional(),
    updatedBy: z.int('Updated by is required')
});