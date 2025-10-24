import { UserStatus } from '@prisma/client'
import z from 'zod'

export interface IUser
{
    id?: number
    name?: string | unknown
    email: string
    phoneNo: string
    roleId: number
    status: UserStatus
    createdAt?: Date
}

export const UserSchema = z.object({
    email: z.email().min(1, 'Email is required'),
    name: z.string().nonempty('Name is required'),
    phoneNo: z.string().regex(/^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/, "Enter Pakistani mobile no."),
    roleId: z.number().nonoptional('Assign a role'),
    status: z.enum(UserStatus, `Status should be 'ACTIVE' or 'DISABLED'.`)
});