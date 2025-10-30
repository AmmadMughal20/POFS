'use server'
import { prisma } from "@/lib/prisma";
import { AddExpenseSchema, EditExpenseSchema, IExpense } from "@/schemas/ExpenseSchema";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getUserSession, hasPermission } from "./getUserSession";

export interface ExpenseState
{
    errors?: Record<string, string[]>;
    success?: boolean;
    message?: string;
    values?: Partial<IExpense>
}


export const getExpenses = async (skip?: number, take?: number, orderBy?: Prisma.ExpenseOrderByWithRelationInput, filter?: Prisma.ExpenseWhereInput & { search?: string }) =>
{
    const { permissions } = await getUserSession()
    if (!hasPermission(permissions, 'expense:view'))
    {
        throw new Error("Forbidden: You don’t have permission to view expense list.")
    }

    const { search, date, ...restFilters } = filter ?? {};

    const where: Prisma.ExpenseWhereInput = {
        ...restFilters,
    };

    if (date)
    {
        const parsedDate = new Date(date.toString());
        if (!isNaN(parsedDate.getTime()))
        {
            // Match records for the same day (ignoring time)
            const startOfDay = new Date(parsedDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(parsedDate);
            endOfDay.setHours(23, 59, 59, 999);

            where.date = {
                gte: startOfDay,
                lte: endOfDay,
            };
        }
    }

    if (search && search.trim() !== '')
    {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { createdByUser: { name: { contains: search, mode: 'insensitive' } } },
            { notes: { contains: search, mode: 'insensitive' } },
            { Branch: { area: { contains: search, mode: 'insensitive' } } },
            { Business: { name: { contains: search, mode: 'insensitive' } } },
        ];

        if (!isNaN(Number(search)))
        {
            where.OR.push({ amount: { equals: Number(search) } });
        }
    }

    const [items, total] = await Promise.all([
        prisma.expense.findMany({
            skip,
            take,
            orderBy: orderBy ?? { id: 'asc' },
            where,
            include: {
                Branch: true,
                Business: true,
                createdByUser: true,
                updatedByUser: true
            },
        }),
        prisma.expense.count({ where }),
    ]);

    const itemsToSend = items.map((prod) => ({
        ...prod,
        amount: Number(prod.amount)
    }))
    return { items: itemsToSend, total };
}

export const handleExpenseAddAction = async (prevState: ExpenseState, formData: FormData): Promise<ExpenseState> =>
{
    const { user, permissions } = await getUserSession();
    if (!hasPermission(permissions, "expense:create"))
    {
        throw new Error("Forbidden: You don’t have permission to create expense.");
    }

    const createdBy = user.id

    const newExpense: IExpense = {
        title: formData.get('title')?.toString() || '',
        notes: formData.get("notes")?.toString() || "",
        amount: Number(formData.get("amount")?.toString() || ""),
        date: new Date(formData.get("date")?.toString() || ""),
        businessId: formData.get("businessId")?.toString() || "",
        branchId: formData.get("branchId")?.toString() || "",
        createdBy
    }

    const result = AddExpenseSchema.safeParse(newExpense)

    if (!result.success)
    {
        return {
            errors: result.error.flatten().fieldErrors,
            values: newExpense
        }
    }

    await prisma.expense.create({
        data: {
            title: newExpense.title,
            notes: newExpense.notes,
            amount: newExpense.amount,
            date: newExpense.date,
            businessId: newExpense.businessId ? newExpense.businessId : '',
            branchId: newExpense.branchId ? newExpense.branchId : '',
            createdBy: newExpense.createdBy
        }
    })

    revalidatePath(`/branch/${newExpense.branchId}/expenses`)

    return { success: true, message: 'Expense added successfully' }
}

export const handleExpenseEditAction = async (prevState: ExpenseState, formData: FormData): Promise<ExpenseState> =>
{
    const { user, permissions } = await getUserSession();
    if (!hasPermission(permissions, "expense:update"))
    {
        throw new Error("Forbidden: You don’t have permission to update expense.");
    }

    const updatedBy = user.id

    const updatedExpense: IExpense = {
        id: Number(formData.get('id')?.toString() || ''),
        title: formData.get('title')?.toString() || '',
        notes: formData.get("notes")?.toString() || "",
        amount: Number(formData.get("amount")?.toString() || ""),
        date: new Date(formData.get("date")?.toString() || ""),
        businessId: formData.get("businessId")?.toString() || "",
        branchId: formData.get("branchId")?.toString() || "",
        updatedBy
    }

    const result = EditExpenseSchema.safeParse(updatedExpense)

    if (!result.success)
    {
        return {
            errors: result.error.flatten().fieldErrors,
            values: updatedExpense
        }
    }

    await prisma.expense.update({
        where: { id: updatedExpense.id },
        data: {
            title: updatedExpense.title,
            notes: updatedExpense.notes,
            amount: updatedExpense.amount,
            date: updatedExpense.date,
            businessId: updatedExpense.businessId ? updatedExpense.businessId : '',
            branchId: updatedExpense.branchId ? updatedExpense.branchId : '',
            createdBy: updatedExpense.createdBy
        }
    })

    revalidatePath(`/branch/${updatedExpense.branchId}/expenses`)

    return { success: true, message: 'Expense updated successfully' }
}

export const handleExpenseDeleteAction = async (prevState: ExpenseState, formData: FormData): Promise<ExpenseState> =>
{
    const { user, permissions } = await getUserSession();
    if (!hasPermission(permissions, "expense:delete"))
    {
        throw new Error("Forbidden: You don’t have permission to delete expense.");
    }

    const id = Number(formData.get('id')?.toString())
    const branchId = formData.get('branchId')?.toString()

    const expenseToDelete = await prisma.expense.findFirst({ where: { id } })
    if (!expenseToDelete)
    {
        return {
            errors: { general: ['Expense not found'] },
        }
    }

    await prisma.expense.delete({
        where: { id },
    })

    revalidatePath(`/branch/${branchId}/expenses`)

    return { success: true, message: 'Expense deleted successfully' }
} 