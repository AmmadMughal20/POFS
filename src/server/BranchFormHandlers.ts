'use server'
import { prisma } from "@/lib/prisma"
import { Branch, BranchSchema } from "@/schemas/BranchSchema"
import { revalidatePath } from 'next/cache'
import { getUserSession, hasPermission } from "@/server/getUserSession";

export interface BranchesState
{
    errors?: Record<string, string[]>;
    success?: boolean;
    message?: string;
    values?: Partial<Branch>
}

export async function getBranches(skip: number, take: number): Promise<Branch[]>
{
    const { permissions } = await getUserSession();
    if (!hasPermission(permissions, "branch:view"))
    {
        throw new Error("Forbidden: You don’t have permission to view branches.");
    }

    const branches: Branch[] = await prisma.branch.findMany({ skip: skip, take: take })

    return branches.map((branch: Branch) => ({
        ...branch,
        branchId: branch.id,
    }))
}

export async function handleBranchAddAction(prevState: BranchesState, formData: FormData): Promise<BranchesState>
{
    const { permissions } = await getUserSession();
    if (!hasPermission(permissions, "branch:create"))
    {
        throw new Error("Forbidden: You don’t have permission to create branches.");
    }

    const newBranch: Branch = {
        id: formData.get('branchId')?.toString() || crypto.randomUUID(),
        city: formData.get('city')?.toString() || '',
        area: formData.get('area')?.toString() || '',
        address: formData.get('address')?.toString() || '',
        phoneNo: formData.get('phoneNo')?.toString() || '',
        status: "ACTIVE",
        openingTime: new Date(`1970-01-01T${formData.get('openingTime') || '00:00'}`),
        closingTime: new Date(`1970-01-01T${formData.get('closingTime') || '00:00'}`),
    }

    const result = BranchSchema.safeParse(newBranch)

    if (!result.success)
    {
        return {
            errors: result.error.flatten().fieldErrors,
            values: newBranch
        }
    }

    await prisma.branch.create({ data: newBranch })

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

    const result = BranchSchema.safeParse({ id: branchId, ...updatedBranchData })
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
