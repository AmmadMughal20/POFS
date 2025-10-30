'use server'
import { prisma } from "@/lib/prisma";
import { AddSalesmanSchema, EditSalesmanSchema, ISalesman } from "@/schemas/SalesmanSchema";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getUserSession, hasPermission } from "./getUserSession";
import bcrypt from "bcrypt";

export interface SalesmanState
{
    errors?: Record<string, string[]>;
    success?: boolean;
    message?: string;
    values?: Partial<ISalesman>
}


export const getSalesmen = async (skip?: number, take?: number, orderBy?: Prisma.SalesManOrderByWithRelationInput, filter?: Prisma.SalesManWhereInput & { search?: string }) =>
{
    const { permissions } = await getUserSession()
    if (!hasPermission(permissions, 'salesman:view'))
    {
        throw new Error("Forbidden: You don’t have permission to view salesman list.")
    }

    const { search, ...restFilters } = filter ?? {};

    const where: Prisma.SalesManWhereInput = {
        ...restFilters,
    };

    if (search && search.trim() !== '')
    {
        where.OR = [
            { User: { name: { contains: search, mode: 'insensitive' } } },
            { User: { email: { contains: search, mode: 'insensitive' } } },
            { User: { phoneNo: { contains: search, mode: 'insensitive' } } },
            { Branch: { area: { contains: search, mode: 'insensitive' } } },
            { Business: { name: { contains: search, mode: 'insensitive' } } },
        ];
    }

    const [items, total] = await Promise.all([
        prisma.salesMan.findMany({
            skip,
            take,
            orderBy: orderBy ?? { id: 'asc' },
            where,
            include: {
                Branch: true,
                Business: true,
                User: true
            },
        }),
        prisma.salesMan.count({ where }),
    ]);

    return { items, total };
}

export const handleSalesmanAddAction = async (prevState: SalesmanState, formData: FormData): Promise<SalesmanState> =>
{
    try
    {

        const { user, permissions } = await getUserSession();
        if (!hasPermission(permissions, "salesman:create"))
        {
            throw new Error("Forbidden: You don’t have permission to create salesman.");
        }

        const createdBy = user.id

        const newSalesman: ISalesman = {
            User: {
                name: formData.get('name')?.toString(),
                phoneNo: formData.get("phoneNo")?.toString(),
                email: formData.get("email")?.toString(),
            },
            branchId: formData.get("branchId")?.toString() || "",
            businessId: formData.get("businessId")?.toString() || "",
            // createdBy
        }

        const result = AddSalesmanSchema.safeParse(newSalesman)

        if (!result.success)
        {
            return {
                errors: result.error.flatten().fieldErrors,
                values: newSalesman
            }
        }

        const password = "Test@123"; // default password
        const encPass = await bcrypt.hash(password, await bcrypt.genSalt(10));

        const createdUser = await prisma.user.create({
            data: {
                name: newSalesman.User.name,
                email: newSalesman.User.email ?? '',
                phoneNo: newSalesman.User.phoneNo ?? '',
                password: encPass,
                status: "DISABLED",
                createdBy,
                roleId: 1, // if you have a default role for customers
            },
        });
        await prisma.salesMan.create({
            data: {
                id: createdUser.id,
                businessId: newSalesman.businessId ? newSalesman.businessId : '',
                branchId: newSalesman.branchId ? newSalesman.branchId : '',
            }
        })

        revalidatePath(`/branch/${newSalesman.branchId}/salesmen`)

        return { success: true, message: 'Salesman added successfully' }
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

export const handleSalesmanEditAction = async (prevState: SalesmanState, formData: FormData): Promise<SalesmanState> =>
{
    try
    {
        const { user, permissions } = await getUserSession();
        if (!hasPermission(permissions, "salesman:update"))
        {
            throw new Error("Forbidden: You don’t have permission to update salesman.");
        }

        const updatedBy = user.id

        const updatedSalesman: ISalesman = {
            User: {
                id: Number(formData.get('id')?.toString()),
                name: formData.get('name')?.toString(),
                phoneNo: formData.get("phoneNo")?.toString(),
                email: formData.get("email")?.toString(),
            },
            branchId: formData.get("branchId")?.toString() || "",
            businessId: formData.get("businessId")?.toString() || "",
            // updatedBy
        }

        const result = EditSalesmanSchema.safeParse(updatedSalesman)

        if (!result.success)
        {
            return {
                errors: result.error.flatten().fieldErrors,
                values: updatedSalesman
            }
        }

        if (updatedSalesman.User.id)
        {
            await prisma.user.update({
                where: { id: updatedSalesman.User.id },
                data: {
                    name: updatedSalesman.User.name,
                    phoneNo: updatedSalesman.User.phoneNo,
                    email: updatedSalesman.User.email,
                }
            })
        }

        revalidatePath(`/branch/${updatedSalesman.branchId}/salesmen`)

        return { success: true, message: 'Salesman updated successfully' }
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

export const handleSalesmanDeleteAction = async (prevState: SalesmanState, formData: FormData): Promise<SalesmanState> =>
{
    try
    {

        const { user, permissions } = await getUserSession();
        if (!hasPermission(permissions, "salesman:delete"))
        {
            throw new Error("Forbidden: You don’t have permission to delete salesman.");
        }

        const id = Number(formData.get('id')?.toString())

        const salesmanToDelete = await prisma.salesMan.findFirst({ where: { id } })
        if (!salesmanToDelete)
        {
            return {
                errors: { general: ['Salesman not found'] },
            }
        }

        await prisma.salesMan.delete({
            where: { id },
        })

        await prisma.user.delete({
            where: { id },
        })

        revalidatePath(`/branch/${salesmanToDelete.branchId}/salesmans`)

        return { success: true, message: 'Salesman deleted successfully' }
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