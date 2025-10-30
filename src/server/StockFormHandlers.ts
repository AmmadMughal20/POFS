'use server'
import { AddStockSchema, EditStockSchema, IStock } from "@/schemas/StockSchema";
import { getUserSession, hasPermission } from "./getUserSession";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export interface StockState
{
    errors?: Record<string, string[]>;
    success?: boolean;
    message?: string;
    values?: Partial<IStock>
}


export const getStocks = async (skip?: number, take?: number, orderBy?: Prisma.StockOrderByWithRelationInput, filter?: Prisma.StockWhereInput & { search?: string }) =>
{
    const { permissions } = await getUserSession()
    if (!hasPermission(permissions, 'stock:view'))
    {
        throw new Error("Forbidden: You don’t have permission to view stocks list.")
    }

    const { search, ...restFilters } = filter ?? {};

    const where: Prisma.StockWhereInput = {
        ...restFilters,
    };

    if (search && search.trim() !== '')
    {
        where.OR = [
            // { stockUnits: { equals: parseInt(search) } },
            { Branch: { area: { contains: search, mode: 'insensitive' } } },
            { Product: { title: { contains: search, mode: 'insensitive' } } },
        ];
    }

    const [items, total] = await Promise.all([
        prisma.stock.findMany({
            skip,
            take,
            orderBy: orderBy ?? { productId: 'asc' },
            where,
            include: {
                Branch: true,
                Product: true
            },
        }),
        prisma.stock.count({ where }),
    ]);

    const itemsToSend = items.map((stock) => ({
        ...stock,
        stockUnits: Number(stock.stockUnits),
        Product: stock.Product
            ? {
                ...stock.Product,
                rate: Number(stock.Product.rate), // ✅ convert Decimal to number
            }
            : null,
    }))
    return { items: itemsToSend, total };
}

export const handleStockAddAction = async (prevState: StockState, formData: FormData): Promise<StockState> =>
{
    const { user, permissions } = await getUserSession();
    if (!hasPermission(permissions, "stock:create"))
    {
        throw new Error("Forbidden: You don’t have permission to create stock.");
    }

    const createdBy = user.id

    const newStock: IStock = {
        branchId: formData.get("branchId")?.toString() || "",
        productId: Number(formData.get("productId")?.toString()),
        stockUnits: Number(formData.get("stockUnits")?.toString()),
        createdBy
    }

    const result = AddStockSchema.safeParse(newStock)

    if (!result.success)
    {
        return {
            errors: result.error.flatten().fieldErrors,
            values: newStock
        }
    }

    await prisma.stock.create({
        data: {
            branchId: newStock.branchId,
            productId: newStock.productId,
            stockUnits: newStock.stockUnits,
            // createdBy: newStock.createdBy
        }
    })

    revalidatePath(`/branch/${newStock.branchId}/stocks`)

    return { success: true, message: 'Stock added successfully' }
}

export const handleStockEditAction = async (prevState: StockState, formData: FormData): Promise<StockState> =>
{
    const { user, permissions } = await getUserSession();
    if (!hasPermission(permissions, "stock:update"))
    {
        throw new Error("Forbidden: You don’t have permission to update stock.");
    }

    const updatedBy = user.id

    const updatedStock: IStock = {
        branchId: formData.get("branchId")?.toString() || "",
        productId: Number(formData.get("productId")?.toString()),
        stockUnits: Number(formData.get("stockUnits")?.toString()),
        updatedBy
    }

    const result = EditStockSchema.safeParse(updatedStock)

    if (!result.success)
    {
        return {
            errors: result.error.flatten().fieldErrors,
            values: updatedStock
        }
    }

    await prisma.stock.update({
        where: {
            branchId_productId: {
                branchId: updatedStock.branchId,
                productId: updatedStock.productId,
            },
        },
        data: {
            branchId: updatedStock.branchId,
            productId: updatedStock.productId,
            stockUnits: updatedStock.stockUnits,
            // updatedBy: updatedStock.createdBy
        }
    })

    revalidatePath(`/branch/${updatedStock.branchId}/stocks`)

    return { success: true, message: 'Stock added successfully' }
}


export const handleStockDeleteAction = async (prevState: StockState, formData: FormData): Promise<StockState> =>
{
    const { user, permissions } = await getUserSession();
    if (!hasPermission(permissions, "stock:delete"))
    {
        throw new Error("Forbidden: You don’t have permission to delete stock.");
    }

    const updatedBy = user.id

    const updatedStock: IStock = {
        branchId: formData.get("branchId")?.toString() || "",
        productId: Number(formData.get("productId")?.toString()),
        stockUnits: 0,
        updatedBy
    }

    const result = EditStockSchema.safeParse(updatedStock)

    if (!result.success)
    {
        return {
            errors: result.error.flatten().fieldErrors,
            values: updatedStock
        }
    }

    await prisma.stock.update({
        where: {
            branchId_productId: {
                branchId: updatedStock.branchId,
                productId: updatedStock.productId,
            },
        },
        data: {
            branchId: updatedStock.branchId,
            productId: updatedStock.productId,
            stockUnits: updatedStock.stockUnits,
            // updatedBy: updatedStock.createdBy
        }
    })

    revalidatePath(`/branch/${updatedStock.branchId}/stocks`)

    return { success: true, message: 'Stock added successfully' }
} 