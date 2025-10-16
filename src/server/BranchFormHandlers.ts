'use server'
import { BranchSchema } from "@/schemas/BranchSchema"
import { revalidatePath } from 'next/cache'
import fs from 'fs'
import path from 'path'

const BRANCHES_PATH = path.join(process.cwd(), 'src', 'data', 'branches.json')

async function saveBranches(updatedBranches: any)
{
    await fs.promises.writeFile(
        BRANCHES_PATH,
        JSON.stringify({ branches: updatedBranches }, null, 2),
        'utf-8'
    )
}


export async function getBranches()
{
    const data = JSON.parse(await fs.promises.readFile(BRANCHES_PATH, 'utf-8'))

    await new Promise(res => setTimeout(res, 200))

    return data.branches.map((branch: any) => ({
        ...branch,
        branchId: branch.id,
    }))
}

export async function handleBranchAddAction(prevState: any, formData: FormData)
{
    await new Promise((resolve) => setTimeout(resolve, 200))

    const newBranch = {
        id: formData.get('branchId')?.toString() || crypto.randomUUID(),
        city: formData.get('city')?.toString() || '',
        area: formData.get('area')?.toString() || '',
        address: formData.get('address')?.toString() || '',
        phoneNo: formData.get('phoneNo')?.toString() || '',
        openingTime: formData.get('openingTime')?.toString() || '',
        closingTime: formData.get('closingTime')?.toString() || '',
    }

    const result = BranchSchema.safeParse(newBranch)

    if (!result.success)
    {
        return {
            errors: result.error.flatten().fieldErrors,
            values: newBranch
        }
    }

    const data = JSON.parse(await fs.promises.readFile(BRANCHES_PATH, 'utf-8'))
    const updated = [...data.branches, newBranch]

    await saveBranches(updated)
    revalidatePath('/branch-management')

    return { success: true, message: 'Branch added successfully' }
}

export async function handleBranchEditAction(prevState: any, formData: FormData)
{
    await new Promise((resolve) => setTimeout(resolve, 200))

    const branchId = formData.get('branchId')?.toString() || ''

    const updatedBranch = {
        id: branchId,
        city: formData.get('city')?.toString() || '',
        area: formData.get('area')?.toString() || '',
        address: formData.get('address')?.toString() || '',
        phoneNo: formData.get('phoneNo')?.toString() || '',
        openingTime: formData.get('openingTime')?.toString() || '',
        closingTime: formData.get('closingTime')?.toString() || '',
    }

    const result = BranchSchema.safeParse(updatedBranch)
    if (!result.success)
    {
        return {
            errors: result.error.flatten().fieldErrors,
            values: updatedBranch
        }
    }

    const data = JSON.parse(await fs.promises.readFile(BRANCHES_PATH, 'utf-8'))
    const updated = data.branches.map((b: any) =>
        b.id === branchId ? updatedBranch : b
    )

    await saveBranches(updated)
    revalidatePath('/branch-management')

    return { success: true, message: 'Branch updated successfully' }
}


export async function handleBranchDeleteAction(prevState: any, formData: FormData)
{
    const branchId = formData.get('branchId') as string

    try
    {
        const data = JSON.parse(await fs.promises.readFile(BRANCHES_PATH, 'utf-8'))
        const updated = data.branches.filter((b: any) => b.id !== branchId)

        await saveBranches(updated)
        revalidatePath('/branch-management')

        return { success: true, message: 'Branch deleted successfully' }
    } catch (error)
    {
        console.error('Error deleting branch:', error)
        return { success: false, message: 'Failed to delete branch' }
    }
}
