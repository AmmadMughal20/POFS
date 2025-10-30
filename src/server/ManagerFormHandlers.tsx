'use server'

import { prisma } from "@/lib/prisma"
import { IManager } from "@/schemas/ManagerSchema";
import { getUserSession, hasPermission } from "./getUserSession";
import { handleUserAddAction, UsersState } from "./UserFormHandlers";
import { revalidatePath } from "next/cache";

export interface ManagerState
{
    errors?: Record<string, string[]>;
    success?: boolean;
    message?: string;
    values?: Partial<IManager>
}

export async function getManagersByBusiness(businessId: string)
{
    const managers = await prisma.manager.findMany({
        where: { businessId },
        include: {
            User: true
        }
    })
    return managers
}

export async function assignBranchManager(branchId: string, userId: number)
{
    try
    {
        await prisma.branch.update({
            where: { id: branchId },
            data: { managerId: userId },
        })
        return { success: true }
    } catch (error)
    {
        // ✅ Fallback for other errors
        if (error instanceof Error)
        {
            return {
                success: false,
                message: error.message,
            };
        }

        // ✅ Handle truly unknown errors safely
        return {
            success: false,
            message: 'An unexpected error occurred while adding the category.',
        };
    }
};



export async function createManagerAction(prevState: ManagerState, formData: FormData): Promise<ManagerState>
{
    try
    {
        const { permissions } = await getUserSession()
        if (!hasPermission(permissions, 'manager:create'))
        {
            throw new Error('Forbidden: You don’t have permission to create a manager.')
        }

        // Extract form fields
        const branchId = formData.get('branchId')?.toString() || ''
        const businessId = formData.get('businessId')?.toString() || ''
        const name = formData.get('name')?.toString() || ''
        const email = formData.get('email')?.toString() || ''
        const phoneNo = formData.get('phoneNo')?.toString() || ''
        const roleId = parseInt(formData.get('roleId')?.toString() || '0')

        console.log(branchId)
        console.log(businessId)
        console.log(name)
        console.log(email)
        console.log(phoneNo)
        console.log(roleId)

        // 🔹 1️⃣ Create user first (reuse existing user creation logic)
        const userFormData = new FormData()
        userFormData.append('name', name)
        userFormData.append('email', email)
        userFormData.append('phoneNo', phoneNo)
        userFormData.append('roleId', roleId.toString())

        const userResult = await handleUserAddAction({} as UsersState, userFormData)

        if (!userResult.success || !userResult.values)
        {
            console.log(userResult, 'printing user creation error')
            throw new Error(userResult.message || 'Failed to create user for manager.')
        }

        const userId = userResult.values.id
        let newManager: Partial<IManager>;
        if (userId)
        {

            // 🔹 2️⃣ Now create the manager record
            newManager = await prisma.manager.create({
                data: {
                    id: userId,
                    businessId,
                },
                include: {
                    User: true,
                },
            })


            // 🔹 3️⃣ Optionally link to branch
            await prisma.branch.update({
                where: { id: branchId },
                data: { managerId: newManager.id },
            })


            revalidatePath(`/businesses/branches/${businessId}`)

            return {
                success: true,
                message: `Manager "${newManager.User?.name}" created successfully and assigned to branch.`,
                values: newManager,
            }
        }
        else
        {
            throw Error('Error creating user')
        }

    } catch (error: unknown)
    {
        console.error('Error assigning branch:', error);

        let message = 'Something went wrong while assigning branch manager.';

        if (error instanceof Error)
        {
            message = error.message;
        } else if (typeof error === 'string')
        {
            message = error;
        }

        return {
            success: false,
            message,
        };
    }
}