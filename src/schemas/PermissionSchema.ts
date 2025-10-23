import z from 'zod';

export interface IPermission
{
    id?: number
    title: string
    code: string
    description?: string | null
}

export const PermissionSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    code: z.string().min(1, 'Code is required'),
    description: z.string(),
});