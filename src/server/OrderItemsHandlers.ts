'use server'
import { prisma } from "@/lib/prisma";
import { IOrderItem } from "@/schemas/OrderItem";
import { IOrder } from "@/schemas/OrderSchema";
import { getUserSession, hasPermission } from "@/server/getUserSession";
import { Prisma } from "@prisma/client";

export interface OrderItemsState
{
    errors?: Record<string, string[]>;
    success?: boolean;
    message?: string;
    values?: Partial<IOrder>
}


export async function getOrderItems(
    skip?: number,
    take?: number,
    orderBy?: Prisma.OrderItemOrderByWithRelationInput,
    filter?: Prisma.OrderItemWhereInput
): Promise<{ items: IOrderItem[]; total: number }>
{
    const { permissions } = await getUserSession()
    if (!hasPermission(permissions, "orderItem:view"))
    {
        throw new Error("Forbidden: You don’t have permission to view order items list.")
    }

    const findManyArgs: Prisma.OrderItemFindManyArgs = {
        skip,
        take,
        orderBy: orderBy ?? { productId: "asc" },
        where: filter,
        include: {
            Product: true, // ✅ include product details
        },
    }

    const countArgs: Prisma.OrderItemCountArgs = {
        where: filter,
    }

    const [items, total] = await Promise.all([
        prisma.orderItem.findMany(findManyArgs),
        prisma.orderItem.count(countArgs),
    ])

    // ✅ Convert Decimal values (amount, rate) to plain numbers
    const itemsToSend = items.map((itm: IOrderItem) => ({
        ...itm,
        amount: Number(itm.amount), // convert Decimal → number
        qty: Number(itm.qty),
        Product: itm.Product
            ? {
                ...itm.Product,
                rate: itm.Product.rate ? Number(itm.Product.rate) : 0, // ensure Product.rate is number
            }
            : null,
    }))

    return { items: itemsToSend, total }
}
