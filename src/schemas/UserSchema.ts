import { UserStatus } from '@prisma/client'
import z from 'zod'
import { IBaseEntity } from './Base'
import { IRole } from './RoleSchema'
import { IPermission } from './PermissionSchema'
import { IBusiness } from './BusinessSchema'
import { IManager } from './ManagerSchema'
import { ISalesman } from './SalesmanSchema'
import { ICustomer } from './CustomerSchema'
import { IActivityLog } from './ActivityLogSchema'
import { IBranch } from './BranchSchema'
import { IProduct } from './ProductSchema'
import { IExpense } from './ExpenseSchema'
import { IOrder } from './OrderSchema'
import { IPurchase } from './PurchaseSchema'
import { ICategory } from './CategorySchema'
import { ISupplier } from './SupplierSchema'
import { IDiscount } from './DiscountSchema'

export interface IUser extends IBaseEntity
{
    id: number
    email: string
    name: string | null
    phoneNo: string
    password?: string
    status: UserStatus
    roleId: number
    Role?: IRole
    Customer?: ICustomer
    SalesMan?: ISalesman
    Manager?: IManager
    Business?: IBusiness
    AuditLogs?: IActivityLog[]
    isDeleted?: boolean
    deletedAt?: Date | null
    createdPermissions?: IPermission[]
    updatedPermissions?: IPermission[]
    createdRole?: IRole[]
    updatedRole?: IRole[]
    createdBranch?: IBranch[]
    updatedBranch?: IBranch[]
    createdBusiness?: IBusiness[]
    updatedBusiness?: IBusiness[]
    createdProduct?: IProduct[]
    updatedProduct?: IProduct[]
    createdExpense?: IExpense[]
    updatedExpense?: IExpense[]
    createdOrder?: IOrder[]
    updatedOrder?: IOrder[]
    createdPurchase?: IPurchase[]
    updatedPurchase?: IPurchase[]
    createdCategory?: ICategory[]
    updatedCategory?: ICategory[]
    createdSupplier?: ISupplier[]
    updatedSupplier?: ISupplier[]
    createdDiscount?: IDiscount[]
    updatedDiscount?: IDiscount[]
}

export const AddUserSchema = z.object({
    email: z.email('Invalid email address'),
    name: z.string().min(1, 'Name is required'),
    phoneNo: z
        .string()
        .regex(/^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/, 'Enter a valid Pakistani mobile number'),
    password: z.string("Password is required").min(6, 'Password must be at least 6 characters'),
    roleId: z.number().nonoptional('Role is required'),
    status: z.enum(UserStatus, "Status should be 'ACTIVE' or 'DISABLED'"),
    createdBy: z.int('Created by is required'),
})

export const EditUserSchema = z.object({
    id: z.int('User id is required'),
    email: z.email('Invalid email address'),
    name: z.string().min(1, 'Name is required'),
    phoneNo: z
        .string()
        .regex(/^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/, 'Enter a valid Pakistani mobile number'),
    roleId: z.number().nonoptional('Role is required'),
    status: z.enum(UserStatus, "Status should be 'ACTIVE' or 'DISABLED'"),
    updatedBy: z.int('Updated by is required'),
})