import { Decimal } from "@prisma/client/runtime/library"
import { IBaseEntity } from "./Base"
import { IBranch } from "./BranchSchema"
import { ICustomer } from "./CustomerSchema"
import { IOrderItem } from "./OrderItem"
import z from 'zod'
import { OrderMode, OrderStatus } from "@prisma/client"
import { IBusiness } from "./BusinessSchema"

export interface IOrder extends IBaseEntity
{
    id?: number
    customerId: number
    Customer?: ICustomer
    branchId: string
    Branch?: IBranch
    businessId: string
    Business?: IBusiness
    totalAmount: Decimal | number;
    orderMode: OrderMode,
    status: string
    orderItems?: IOrderItem[]
    createdBy?: number | null
    updatedBy?: number | null
}


export const AddOrderSchema = z.object({
    id: z.string('Order Id is required'),
    address: z.string().min(1, 'Address is required'),
    phoneNo: z.string().regex(/^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/, "Enter Pakistani mobile no."),
    customerId: z.int('Customer is required'),
    branchId: z.int('Branch is required'),
    totalAmount: z.float64('Total amount is required'),
    orderMode: z.enum(OrderMode, 'Select Order mode'),
    status: z.enum(OrderStatus),
    createdBy: z.int('Created by is required')
});

export const EditOrderSchema = z.object({
    id: z.string('Order Id is required'),
    address: z.string().min(1, 'Address is required'),
    phoneNo: z.string().regex(/^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/, "Enter Pakistani mobile no."),
    updatedBy: z.int('Updated by is required')
});