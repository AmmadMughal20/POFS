'use server'
import { prisma } from "@/lib/prisma"
import { IBranch, AddBranchSchema, EditBranchSchema } from "@/schemas/BranchSchema"
import { revalidatePath } from 'next/cache'
import { getUserSession, hasPermission } from "@/server/getUserSession";
import { BranchStatus, Prisma, Province } from "@prisma/client";

export interface BranchesState
{
    errors?: Record<string, string[]>;
    success?: boolean;
    message?: string;
    values?: Partial<IBranch>
}


export async function getBranches(
    skip?: number,
    take?: number,
    orderBy?: Prisma.BranchOrderByWithRelationInput,
    filter?: Prisma.BranchWhereInput
): Promise<{ items: IBranch[]; total: number }>
{
    const { permissions } = await getUserSession();
    if (!hasPermission(permissions, "branch:view"))
    {
        throw new Error("Forbidden: You don’t have permission to view branches list.");
    }

    const findManyArgs: Prisma.BranchFindManyArgs = {
        skip,
        take,
        orderBy: orderBy ?? { id: 'asc' },
        where: filter,
        include: {
            Manager: {
                include: {
                    User: true
                }
            },
            salesMen: {
                include: {
                    User: true
                }
            }
        }
    };

    const countArgs: Prisma.BranchCountArgs = {
        where: filter,
    };

    const [items, total] = await Promise.all([
        prisma.branch.findMany(findManyArgs),
        prisma.branch.count(countArgs),
    ]);

    return { items, total };
}

export async function handleBranchAddAction(prevState: BranchesState, formData: FormData): Promise<BranchesState>
{
    const { user, permissions } = await getUserSession();
    if (!hasPermission(permissions, "branch:create"))
    {
        throw new Error("Forbidden: You don’t have permission to create branches.");
    }

    const createdBy = user.id

    const newBranch: IBranch = {
        id: formData.get('branchId')?.toString() || crypto.randomUUID(),
        businessId: formData.get('businessId')?.toString() || '',
        city: formData.get('city')?.toString() || '',
        area: formData.get('area')?.toString() || '',
        address: formData.get('address')?.toString() || '',
        phoneNo: formData.get('phoneNo')?.toString() || '',
        status: BranchStatus.ACTIVE,
        openingTime: new Date(`1970-01-01T${formData.get('openingTime') || '00:00'}`),
        closingTime: new Date(`1970-01-01T${formData.get('closingTime') || '00:00'}`),
        createdBy,
        province: formData.get('province')?.toString() as Province || '',
    }

    const result = AddBranchSchema.safeParse(newBranch)

    if (!result.success)
    {
        return {
            errors: result.error.flatten().fieldErrors,
            values: newBranch
        }
    }

    await prisma.branch.create({
        data: {
            id: newBranch.id,
            businessId: newBranch.businessId,
            city: newBranch.city,
            area: newBranch.area,
            address: newBranch.address,
            phoneNo: newBranch.phoneNo,
            status: newBranch.status,
            openingTime: newBranch.openingTime,
            closingTime: newBranch.closingTime,
            createdBy,
        },
    })

    revalidatePath('/branch-management')

    return { success: true, message: 'Branch added successfully' }
}

export async function handleBranchEditAction(prevState: BranchesState, formData: FormData): Promise<BranchesState>
{
    const { permissions } = await getUserSession();
    if (!hasPermission(permissions, "branch:update"))
    {
        throw new Error("Forbidden: You don’t have permission to edit branches.");
    }

    const branchId = formData.get('branchId')?.toString() || ''

    const updatedBranchData = {
        city: formData.get('city')?.toString() || '',
        area: formData.get('area')?.toString() || '',
        address: formData.get('address')?.toString() || '',
        phoneNo: formData.get('phoneNo')?.toString() || '',
        status: formData.get('status') as 'ACTIVE' | 'DISABLED' || '',
        openingTime: new Date(`1970-01-01T${formData.get('openingTime') || '00:00'}`),
        closingTime: new Date(`1970-01-01T${formData.get('closingTime') || '00:00'}`),
    }

    const result = EditBranchSchema.safeParse({ id: branchId, ...updatedBranchData })
    if (!result.success)
    {
        return {
            errors: result.error.flatten().fieldErrors,
            values: { id: branchId, ...updatedBranchData }
        }
    }
    await prisma.branch.update({ where: { id: branchId }, data: updatedBranchData })

    revalidatePath('/branch-management')

    return { success: true, message: 'Branch updated successfully' }
}


export async function handleBranchDeleteAction(prevState: BranchesState, formData: FormData): Promise<BranchesState>
{
    const { permissions } = await getUserSession();
    if (!hasPermission(permissions, "branch:delete"))
    {
        throw new Error("Forbidden: You don’t have permission to delete branches.");
    }

    const branchId = formData.get('branchId') as string

    try
    {
        const isBranchExist = await prisma.branch.findFirst({ where: { id: branchId } })
        if (!isBranchExist) return { errors: { branchId: ['Branch not found.'] } }

        await prisma.branch.delete({ where: { id: branchId } })

        revalidatePath('/branch-management')

        return { success: true, message: 'Branch deleted successfully' }
    } catch (error)
    {
        console.error('Error deleting branch:', error)
        return { success: false, message: 'Failed to delete branch' }
    }
}


export async function getBranch(branchId: string): Promise<IBranch | null>
{
    const { user, permissions } = await getUserSession();
    if (!(user.roleId == 6))
    {
        throw new Error("Forbidden: You don’t have permission to view branch.");
    }

    const branch = await prisma.branch.findFirst({ where: { id: branchId } })

    return branch;
}