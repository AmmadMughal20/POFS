'use server'
import { AddSupplierSchema, ISupplier } from "@/schemas/SupplierSchema";
import { getUserSession, hasPermission } from "./getUserSession";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export interface SupplierState
{
    errors?: Record<string, string[]>;
    success?: boolean;
    message?: string;
    values?: Partial<ISupplier>
}

export async function getSupplieres(
    skip?: number,
    take?: number,
    orderBy?: Prisma.SupplierOrderByWithRelationInput,
    filter?: Prisma.SupplierWhereInput
): Promise<{ items: ISupplier[]; total: number }>
{
    const { permissions } = await getUserSession();
    if (!hasPermission(permissions, "supplier:view"))
    {
        throw new Error("Forbidden: You don’t have permission to view supplier list.");
    }

    const findManyArgs: Prisma.SupplierFindManyArgs = {
        skip,
        take,
        orderBy: orderBy ?? { id: 'asc' },
        where: filter,
    };

    const countArgs: Prisma.SupplierCountArgs = {
        where: filter,
    };

    const [items, total] = await Promise.all([
        prisma.supplier.findMany(findManyArgs),
        prisma.supplier.count(countArgs),
    ]);

    return { items, total };
}


export const handleSupplierAddAction = async (prevState: SupplierState, formData: FormData): Promise<SupplierState> =>
{
    try
    {

        const { user, permissions } = await getUserSession();
        if (!hasPermission(permissions, "category:create"))
        {
            throw new Error("Forbidden: You don’t have permission to create category.");
        }

        const createdBy = user.id

        const newSupplier: ISupplier = {
            name: formData.get('name')?.toString() || '',
            businessId: formData.get("businessId")?.toString() || "",
            createdBy
        }

        const result = AddSupplierSchema.safeParse(newSupplier)

        if (!result.success)
        {
            return {
                errors: result.error.flatten().fieldErrors,
                values: newSupplier
            }
        }

        await prisma.supplier.create({
            data: {
                name: newSupplier.name,
                businessId: newSupplier.businessId,
                createdBy: newSupplier.createdBy
            }
        })

        revalidatePath('/businesses')

        return { success: true, message: 'Supplier added successfully' }


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