'use server'
import { AddProductSchema, IProduct } from "@/schemas/ProductSchema";
import { getUserSession, hasPermission } from "./getUserSession";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface ProductState
{
    errors?: Record<string, string[]>;
    success?: boolean;
    message?: string;
    values?: Partial<IProduct>
}

export const handleProductAddAction = async (prevState: ProductState, formData: FormData): Promise<ProductState> =>
{
    const { user, permissions } = await getUserSession();
    if (!hasPermission(permissions, "category:create"))
    {
        throw new Error("Forbidden: You don’t have permission to create category.");
    }

    const createdBy = user.id

    const newProduct: IProduct = {
        title: formData.get('title')?.toString() || '',
        description: formData.get("description")?.toString() || "",
        sku: formData.get("sku")?.toString() || "",
        rate: parseFloat(formData.get("rate")?.toString() || ""),
        categoryId: parseInt(formData.get("categoryId")?.toString() || ""),
        supplierId: parseInt(formData.get("supplierId")?.toString() || ""),
        businessId: formData.get("businessId")?.toString() || "",
        branchId: formData.get("branchId")?.toString() || "",
        createdBy
    }

    const result = AddProductSchema.safeParse(newProduct)

    if (!result.success)
    {
        return {
            errors: result.error.flatten().fieldErrors,
            values: newProduct
        }
    }

    await prisma.product.create({
        data: {
            title: newProduct.title,
            description: newProduct.description,
            sku: newProduct.sku,
            rate: newProduct.rate,
            categoryId: newProduct.categoryId,
            supplierId: newProduct.supplierId,
            businessId: newProduct.businessId,
            createdBy: newProduct.createdBy,
            branchId: newProduct.branchId
        }
    })

    revalidatePath('/businesses')

    return { success: true, message: 'Product added successfully' }


} 