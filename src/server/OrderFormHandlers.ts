'use server'
import { prisma } from "@/lib/prisma";
import { AddOrderSchema, EditOrderSchema, IOrder } from "@/schemas/OrderSchema";
import { getUserSession, hasPermission } from "@/server/getUserSession";
import { OrderMode, OrderStatus, Prisma } from "@prisma/client";
import { revalidatePath } from 'next/cache';

export interface OrdersState
{
    errors?: Record<string, string[]>;
    success?: boolean;
    message?: string;
    values?: Partial<IOrder>
}


export async function getOrders(
    skip?: number,
    take?: number,
    orderBy?: Prisma.OrderOrderByWithRelationInput,
    filter?: Prisma.OrderWhereInput
): Promise<{ items: IOrder[]; total: number }>
{
    const { permissions } = await getUserSession();
    if (!hasPermission(permissions, "order:view"))
    {
        throw new Error("Forbidden: You don’t have permission to view orders list.");
    }

    const findManyArgs: Prisma.OrderFindManyArgs = {
        skip,
        take,
        orderBy: orderBy ?? { id: 'asc' },
        where: filter,
        include: {
            Branch: true,
            Business: true,
            Customer: {
                include: {
                    User: true
                }
            }
        }
    };

    const countArgs: Prisma.OrderCountArgs = {
        where: filter,
    };

    const [items, total] = await Promise.all([
        prisma.order.findMany(findManyArgs),
        prisma.order.count(countArgs),
    ]);

    return { items, total };
}

export async function handleOrderAddAction(prevState: OrdersState, formData: FormData): Promise<OrdersState>
{
    try
    {

        const { user, permissions } = await getUserSession();
        if (!hasPermission(permissions, "order:create"))
        {
            throw new Error("Forbidden: You don’t have permission to create orders.");
        }

        const createdBy = user.id

        const orderItemsRaw = formData.get("orderItems")?.toString() || "[]";
        const parsedOrderItems = JSON.parse(orderItemsRaw) as {
            productId: number;
            qty: number;
            amount: number | string;
        }[];

        const orderItems = parsedOrderItems.map((item) => ({
            productId: item.productId,
            qty: item.qty,
            amount: new Prisma.Decimal(item.amount),
        }));

        const newOrder: IOrder = {
            customerId: parseInt(formData.get('customerId')?.toString() || ''),
            branchId: formData.get('branchId')?.toString() || '',
            businessId: formData.get('businessId')?.toString() || '',
            totalAmount: new Prisma.Decimal(formData.get('totalAmount')?.toString() || '0'),
            status: OrderStatus.PENDING,
            orderMode: OrderMode.OFFLINE,
            orderItems,
            createdBy,
        }

        const result = AddOrderSchema.safeParse(newOrder)

        if (!result.success)
        {
            return {
                errors: result.error.flatten().fieldErrors,
                values: newOrder
            }
        }

        await prisma.$transaction(async (tx) =>
        {
            const createdOrder = await tx.order.create({
                data: {
                    customerId: newOrder.customerId,
                    totalAmount: newOrder.totalAmount,
                    businessId: newOrder.businessId,
                    branchId: newOrder.branchId,
                    status: newOrder.status as OrderStatus,
                    orderMode: newOrder.orderMode,
                    createdBy,
                },
            });

            if (orderItems.length > 0)
            {
                await tx.orderItem.createMany({
                    data: orderItems.map((item) => ({
                        orderId: createdOrder.id,
                        productId: item.productId,
                        qty: item.qty,
                        amount: item.amount,
                    })),
                });
            }
        });

        revalidatePath(`/businesses/branches/${formData.get("businessId")}/orders`);

        return {
            success: true,
            message: "Order and items added successfully.",
        };
    } catch (error: unknown)
    {
        console.error('Error adding order:', error);

        let message = 'Something went wrong while adding the order.';

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

export async function handleOrderEditAction(prevState: OrdersState, formData: FormData): Promise<OrdersState>
{
    try
    {
        const { user, permissions } = await getUserSession();
        if (!hasPermission(permissions, "order:update"))
        {
            throw new Error("Forbidden: You don’t have permission to update orders.");
        }

        const orderId = parseInt(formData.get("id")?.toString() || "");
        if (isNaN(orderId)) throw new Error("Invalid order ID.");

        const updatedBy = user.id;

        const orderItemsRaw = formData.get("orderItems")?.toString() || "[]";
        const parsedOrderItems = JSON.parse(orderItemsRaw) as {
            productId: number;
            qty: number;
            amount: number | string;
        }[];

        const orderItems = parsedOrderItems.map((item) => ({
            productId: item.productId,
            qty: item.qty,
            amount: new Prisma.Decimal(item.amount),
        }));

        const updatedOrder: Partial<IOrder> = {
            customerId: parseInt(formData.get("customerId")?.toString() || ""),
            branchId: formData.get("branchId")?.toString() || "",
            businessId: formData.get("businessId")?.toString() || "",
            totalAmount: new Prisma.Decimal(formData.get("totalAmount")?.toString() || "0"),
            status: formData.get("status") as OrderStatus || OrderStatus.PENDING,
            orderMode: (formData.get("orderMode") as OrderMode) || OrderMode.OFFLINE,
            updatedBy,
        };

        const result = EditOrderSchema.safeParse(updatedOrder);
        if (!result.success)
        {
            return {
                errors: result.error.flatten().fieldErrors,
                values: updatedOrder as IOrder,
            };
        }

        await prisma.$transaction(async (tx) =>
        {
            // Update the order
            await tx.order.update({
                where: { id: orderId },
                data: {
                    customerId: updatedOrder.customerId,
                    totalAmount: updatedOrder.totalAmount,
                    branchId: updatedOrder.branchId,
                    businessId: updatedOrder.businessId,
                    status: updatedOrder.status as OrderStatus,
                    orderMode: updatedOrder.orderMode as OrderMode,
                    updatedBy,
                },
            });

            // Replace all existing order items with new ones
            await tx.orderItem.deleteMany({ where: { orderId } });

            if (orderItems.length > 0)
            {
                await tx.orderItem.createMany({
                    data: orderItems.map((item) => ({
                        orderId,
                        productId: item.productId,
                        qty: item.qty,
                        amount: item.amount,
                    })),
                });
            }
        });

        revalidatePath(`/businesses/branches/${formData.get("businessId")}/orders`);

        return { success: true, message: "Order updated successfully." };
    } catch (error: unknown)
    {
        console.error('Error updating order:', error);

        let message = 'Something went wrong while updating the order.';

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

export async function handleOrderDeleteAction(orderId: number, businessId: string): Promise<OrdersState>
{
    try
    {
        const { user, permissions } = await getUserSession();
        if (!hasPermission(permissions, "order:delete"))
        {
            throw new Error("Forbidden: You don’t have permission to delete orders.");
        }

        await prisma.$transaction(async (tx) =>
        {
            // First delete related order items
            await tx.orderItem.deleteMany({ where: { orderId } });

            // Then delete the order itself
            await tx.order.delete({ where: { id: orderId } });
        });

        revalidatePath(`/businesses/branches/${businessId}/orders`);

        return { success: true, message: "Order deleted successfully." };
    } catch (error: unknown)
    {
        console.error('Error deleting order:', error);

        let message = 'Something went wrong while deleting the order.';

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
