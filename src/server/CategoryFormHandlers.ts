'use server'
import { AddCategorySchema, ICategory } from "@/schemas/CategorySchema";
import { getUserSession, hasPermission } from "./getUserSession";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export interface CategoryState
{
    errors?: Record<string, string[]>;
    success?: boolean;
    message?: string;
    values?: Partial<ICategory>
}

export async function getCategoryes(
    skip?: number,
    take?: number,
    orderBy?: Prisma.CategoryOrderByWithRelationInput,
    filter?: Prisma.CategoryWhereInput
): Promise<{ items: ICategory[]; total: number }>
{
    const { permissions } = await getUserSession();
    if (!hasPermission(permissions, "category:view"))
    {
        throw new Error("Forbidden: You don’t have permission to view category list.");
    }

    const findManyArgs: Prisma.CategoryFindManyArgs = {
        skip,
        take,
        orderBy: orderBy ?? { id: 'asc' },
        where: filter,
    };

    const countArgs: Prisma.CategoryCountArgs = {
        where: filter,
    };

    const [items, total] = await Promise.all([
        prisma.category.findMany(findManyArgs),
        prisma.category.count(countArgs),
    ]);

    return { items, total };
}


export const handleCategoryAddAction = async (prevState: CategoryState, formData: FormData): Promise<CategoryState> =>
{
    const { user, permissions } = await getUserSession();
    if (!hasPermission(permissions, "category:create"))
    {
        throw new Error("Forbidden: You don’t have permission to create category.");
    }

    const createdBy = user.id

    const newCategory: ICategory = {
        name: formData.get('name')?.toString() || '',
        businessId: formData.get("businessId")?.toString() || "",
        createdBy
    }

    const result = AddCategorySchema.safeParse(newCategory)

    if (!result.success)
    {
        return {
            errors: result.error.flatten().fieldErrors,
            values: newCategory
        }
    }

    await prisma.category.create({
        data: {
            name: newCategory.name,
            businessId: newCategory.businessId,
            createdBy: newCategory.createdBy
        }
    })

    revalidatePath('/businesses')

    return { success: true, message: 'Category added successfully' }

} 