'use server'
import { prisma } from "@/lib/prisma"
import { revalidatePath } from 'next/cache'
import { getUserSession, hasPermission } from "@/server/getUserSession";
import { IPermission, PermissionSchema } from "@/schemas/PermissionSchema";
import { Prisma } from '@prisma/client';


export interface PermissionsState
{
    errors?: Record<string, string[]>;
    success?: boolean;
    message?: string;
    values?: Partial<IPermission>
}

export async function getPermissions(
    skip?: number,
    take?: number,
    orderBy?: Prisma.PermissionOrderByWithRelationInput,
    filter?: Prisma.PermissionWhereInput
): Promise<{ items: IPermission[]; total: number }>
{
    const { permissions } = await getUserSession();
    if (!hasPermission(permissions, "permission:view"))
    {
        throw new Error("Forbidden: You don’t have permission to view permissions list.");
    }

    const findManyArgs: Prisma.PermissionFindManyArgs = {
        skip,
        take,
        orderBy: orderBy ?? { id: 'asc' },
        where: filter,
    };

    const countArgs: Prisma.PermissionCountArgs = {
        where: filter,
    };

    const [items, total] = await Promise.all([
        prisma.permission.findMany(findManyArgs),
        prisma.permission.count(countArgs),
    ]);

    return { items, total };
}


export async function handlePermissionAddAction(prevState: PermissionsState, formData: FormData): Promise<PermissionsState>
{
    try
    {
        // 🧩 1️⃣ Check permission
        const { permissions } = await getUserSession();
        if (!hasPermission(permissions, "branch:create"))
        {
            throw new Error("Forbidden: You don’t have permission to create branches.");
        }

        const title = formData.get('title')?.toString().trim() || '';
        const code = formData.get('code')?.toString().trim() || '';
        const description = formData.get('description')?.toString().trim() || '';

        const result = PermissionSchema.safeParse({ title, code, description });
        if (!result.success)
        {
            return {
                errors: result.error.flatten().fieldErrors,
                values: { title, code, description },
                success: false,
                message: 'Validation failed. Please check the inputs.',
            };
        }

        const createdPermission = await prisma.permission.create({
            data: {
                title,
                code,
                description: description || null, // Prisma expects null, not empty string
            },
        });

        revalidatePath('/permissions');

        return {
            success: true,
            message: `Permission "${createdPermission.title}" added successfully.`,
            values: createdPermission,
        };
    } catch (error: unknown)
    {
        console.error('Error adding permission:', error);

        let message = 'Something went wrong while adding the permission.';
        if (error instanceof Error) message = error.message;

        return {
            success: false,
            message,
        };
    }
}

export async function handlePermissionEditAction(prevState: PermissionsState, formData: FormData): Promise<PermissionsState>
{
    const { permissions } = await getUserSession();
    if (!hasPermission(permissions, "branch:update"))
    {
        throw new Error("Forbidden: You don’t have permission to edit branches.");
    }

    const permId = formData.get('id')?.toString() || ''

    const updatedPermData = {
        title: formData.get('title')?.toString() || '',
        code: formData.get('code')?.toString() || '',
        description: formData.get('description')?.toString() || '',
    }

    const result = PermissionSchema.safeParse({ id: permId, ...updatedPermData })
    if (!result.success)
    {
        return {
            errors: result.error.flatten().fieldErrors,
            values: { id: parseInt(permId), ...updatedPermData }
        }
    }
    await prisma.permission.update({ where: { id: parseInt(permId) }, data: updatedPermData })

    revalidatePath('/permissions')

    return { success: true, message: 'Permission updated successfully' }
}

export async function handlePermissionDeleteAction(prevState: PermissionsState, formData: FormData): Promise<PermissionsState>
{
    const { permissions } = await getUserSession();
    if (!hasPermission(permissions, "branch:delete"))
    {
        throw new Error("Forbidden: You don’t have permission to delete branches.");
    }

    const permId = formData.get('permId') as string

    try
    {
        const isPermExist = await prisma.permission.findFirst({ where: { id: parseInt(permId) } })
        if (!isPermExist) return { errors: { branchId: ['Permission not found.'] } }

        await prisma.permission.delete({ where: { id: parseInt(permId) } })

        revalidatePath('/permissions')

        return { success: true, message: 'Permission deleted successfully' }
    } catch (error)
    {
        console.error('Error deleting permission:', error)
        return { success: false, message: 'Failed to delete permission' }
    }
}
