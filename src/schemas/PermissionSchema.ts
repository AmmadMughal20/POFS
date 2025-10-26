import z from 'zod';
import { IRolePermission } from './Base';
import { IUser } from './UserSchema';

export interface IPermission
{
    id: number
    title: string
    code: string
    description: string | null
    rolePerms?: IRolePermission[]
    createdAt: Date
    updatedAt: Date
    createdBy: number | null
    updatedBy: number | null
    createdByUser?: IUser | null
    updatedByUser?: IUser | null
}

export const AddPermissionSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    code: z.string().min(1, 'Code is required'),
    description: z.string().optional(),
    createdBy: z.int('Created by is required'),
});

export const UpdatePermissionSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    code: z.string().min(1, 'Code is required'),
    description: z.string().optional(),
    updatedBy: z.int('Updated by is required')
});