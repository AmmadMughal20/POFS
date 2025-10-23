import z from 'zod';
import { IPermission } from './PermissionSchema';

export interface IRole
{
    id?: number
    title: string
    permissions?: IPermission[]
}

export const RoleSchema = z.object({
    title: z.string().min(1, 'Title is required'),
});