import { PaymentType } from "./Base"
import { IBranch } from "./BranchSchema"
import { IBusiness } from "./BusinessSchema"
import { IUser } from "./UserSchema"
import z from 'zod';

export interface IExpense
{
    id?: number
    title: string
    notes?: string | null
    amount: number
    date: Date
    branchId?: string | null
    Branch?: IBranch | null
    businessId?: string | null
    Business?: IBusiness | null
    createdBy?: number | null
    updatedBy?: number | null
    createdByUser?: IUser | null
    updatedByUser?: IUser | null
    User?: IUser
    createdAt?: Date
    updatedAt?: Date
}

export const AddExpenseSchema = z.object({
    title: z.string('Enter title for expense'),
    notes: z.string('Enter notes'),
    amount: z.number('Enter amount of expense'),
    date: z.date('Select date of expense'),
    branchId: z.string('Branch id is required'),
    businessId: z.string('Business id is required'),
    createdBy: z.int('Created by is required')
})

export const EditExpenseSchema = z.object({
    id: z.int('Expense Id is required'),
    title: z.string('Enter title for expense'),
    notes: z.string('Enter notes'),
    amount: z.number('Enter amount of expense'),
    date: z.date('Select date of expense'),
    branchId: z.string('Branch id is required'),
    businessId: z.string('Business id is required'),
    updatedBy: z.int('Updated by is required')
})