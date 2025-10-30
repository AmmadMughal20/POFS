'use server'
import { prisma } from "@/lib/prisma";
import { AddOrderSchema, EditOrderSchema, IOrder } from "@/schemas/OrderSchema";
import { getUserSession, hasPermission } from "@/server/getUserSession";
import { OrderMode, OrderStatus, Prisma } from "@prisma/client";
import { revalidatePath } from 'next/cache';
import bcrypt from "bcrypt";

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
    filter?: Prisma.OrderWhereInput & { search?: string }
): Promise<{ items: IOrder[]; total: number }>
{
    const { permissions } = await getUserSession();
    if (!hasPermission(permissions, "order:view"))
    {
        throw new Error("Forbidden: You don’t have permission to view orders list.");
    }

    const { search, ...restFilters } = filter ?? {};

    const where: Prisma.OrderWhereInput = {
        ...restFilters,
    };

    if (search && search.trim() !== '')
    {
        where.OR = [
            // { status: { equals: search as OrderStatus } },
            { Branch: { area: { contains: search, mode: 'insensitive' } } },
            { Business: { name: { contains: search, mode: 'insensitive' } } },
            { Customer: { User: { name: { contains: search, mode: 'insensitive' } } } },
            { Customer: { User: { phoneNo: { contains: search, mode: 'insensitive' } } } },
            { Customer: { User: { email: { contains: search, mode: 'insensitive' } } } },
        ];
    }

    const [items, total] = await Promise.all([
        prisma.order.findMany({
            skip,
            take,
            orderBy: orderBy ?? { id: 'asc' },
            where,
            include: {
                Branch: true,
                Business: true,
                Customer: {
                    include: { User: true },
                },
            },
        }),
        prisma.order.count({ where }),
    ]);

    const itemsToSend = items.map((item) => ({
        ...item,
        totalAmount: Number(item.totalAmount),
    }));


    return { items: itemsToSend, total };
}


export async function handleOrderAddAction(
    prevState: OrdersState,
    formData: FormData
): Promise<OrdersState>
{
    try
    {
        const { user, permissions } = await getUserSession();
        if (!hasPermission(permissions, "order:create"))
        {
            throw new Error("Forbidden: You don’t have permission to create orders.");
        }

        const createdBy = user.id;

        // Parse order items
        const orderItemsRaw = formData.get("orderItems")?.toString() || "[]";
        const parsedOrderItems = JSON.parse(orderItemsRaw) as {
            productId: number;
            qty: number;
            amount: number | string;
        }[];

        const orderItems = parsedOrderItems.map((item) => ({
            productId: item.productId,
            qty: item.qty,
            amount: Number(item.amount),
        }));

        // Determine customerId
        let customerId: number | undefined;
        const customerIdFromForm = formData.get("customerId")?.toString();
        const customerName = formData.get("customerName")?.toString()?.trim();

        if (customerIdFromForm)
        {
            customerId = parseInt(customerIdFromForm);
        } else if (customerName)
        {
            // Create new user and customer
            const email = formData.get("customerEmail")?.toString()?.trim() || "";
            const phone = formData.get("customerPhone")?.toString()?.trim() || "";
            const password = "Test@123"; // default password
            const encPass = await bcrypt.hash(password, await bcrypt.genSalt(10));

            const createdUser = await prisma.user.create({
                data: {
                    name: customerName,
                    email,
                    phoneNo: phone,
                    password: encPass,
                    status: "DISABLED",
                    createdBy,
                    roleId: 1, // if you have a default role for customers
                },
            });

            const createdCustomer = await prisma.customer.create({
                data: {
                    User: { connect: { id: createdUser.id } },
                    address: formData.get("address")?.toString() || "",
                    city: formData.get("city")?.toString() || "",
                    area: formData.get("area")?.toString() || "",
                },
            });

            customerId = createdCustomer.id;
        }


        // Build order object
        const newOrder: IOrder = {
            customerId: customerId!,
            branchId: formData.get("branchId")?.toString() || "",
            businessId: formData.get("businessId")?.toString() || "",
            totalAmount: Number(formData.get("totalAmount")?.toString() || "0"),
            status: OrderStatus.PENDING,
            orderMode: OrderMode.OFFLINE,
            orderItems,
            createdBy,
        };

        // Validate order
        const result = AddOrderSchema.safeParse(newOrder);

        if (!result.success)
        {
            return {
                errors: result.error.flatten().fieldErrors,
                values: newOrder,
            };
        }

        // Create order and order items in a transaction
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
                        amount: Number(item.amount),
                    })),
                });
            }
        });

        revalidatePath(`/branch/${formData.get("branchId")}/orders`);

        return {
            success: true,
            message: "Order and items added successfully.",
        };
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


export async function handleOrderEditAction(prevState: OrdersState, formData: FormData): Promise<OrdersState>
{
    try
    {
        const { user, permissions } = await getUserSession();
        if (!hasPermission(permissions, "order:update"))
        {
            throw new Error("Forbidden: You don’t have permission to update orders.");
        }

        const orderId = parseInt(formData.get("orderId")?.toString() || "");
        if (isNaN(orderId)) throw new Error("Invalid order ID.");

        const updatedBy = user.id;

        const updatedOrder: Partial<IOrder> = {
            id: parseInt(formData.get("orderId")?.toString() || ""),
            status: formData.get("status") as OrderStatus,
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

        console.log(updatedOrder.status)
        // Update the order
        await prisma.order.update({
            where: { id: orderId },
            data: {
                status: updatedOrder.status as OrderStatus,
                updatedBy,
            },
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
        const { permissions } = await getUserSession();
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
