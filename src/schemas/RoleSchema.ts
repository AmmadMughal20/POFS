import z from 'zod';
import { IPermission } from './PermissionSchema';
import { IUser } from './UserSchema';
import { IRolePermission } from './Base';

export interface IRole
{
    id?: number
    title: string
    rolePerms?: IRolePermission[]
    Users?: IUser[]
    createdBy?: number | null
    updatedBy?: number | null
    permissions?: IPermission[]
}

export const AddRoleSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    createdBy: z.int('Created by is required'),
});

export const EditRoleSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    updatedBy: z.int('Updated by is required'),
});