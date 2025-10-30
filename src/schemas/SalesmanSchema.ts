import { IBranch } from "./BranchSchema"
import { IBusiness } from "./BusinessSchema"
import { IUser } from "./UserSchema"
import z from 'zod';

export interface ISalesman
{
    id?: number | null
    User: Partial<IUser>
    branchId: string
    Branch?: IBranch
    businessId: string
    Business?: IBusiness
}

export const AddSalesmanSchema = z.object({
    User: z.object({
        name: z.string('Enter name of salesman e.g. John'),
        email: z.email('Enter email of salesman e.g. john@gmail.com'),
        phoneNo: z.string().regex(/^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/, 'Enter a valid Pakistani mobile number')
    }),
    branchId: z.string('Branch id is required'),
    businessId: z.string('Business id is required'),
})

export const EditSalesmanSchema = z.object({
    User: z.object({
        id: z.int('Salesman id is required'),
        name: z.string('Enter name of salesman e.g. John'),
        email: z.email('Enter email of salesman e.g. john@gmail.com'),
        phoneNo: z.string().regex(/^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/, 'Enter a valid Pakistani mobile number')
    }),
    branchId: z.string('Branch id is required'),
    businessId: z.string('Business id is required'),
})