import { IPermission } from "./PermissionSchema"
import { IRole } from "./RoleSchema"

// Enums (match your Prisma enums)
export enum UserStatus
{
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export enum BusinessType
{
    RETAIL = 'RETAIL',
    RESTAURANT = 'RESTAURANT',
    ECOMMERCE = 'ECOMMERCE',
    SALON = 'SALON',
    MEDICAL = 'MEDICAL',
    EDUCATION = 'EDUCATION',
    SERVICES = 'SERVICES',
}

export enum DiscountType
{
    PERCENTAGE = 'PERCENTAGE',
    FIXED = 'FIXED',
}

export enum PaymentType
{
    CASH = 'CASH',
    CREDIT_CARD = 'CREDIT_CARD',
    BANK_TRANSFER = 'BANK_TRANSFER',
    OTHER = 'OTHER',
}

// ---------------------
// Base Types
// ---------------------
export interface IBaseEntity
{
    createdAt?: Date
    updatedAt?: Date
}
export interface IRolePermission
{
    roleId: number;
    permId: number;
    Role?: IRole;
    Permission?: IPermission;
}