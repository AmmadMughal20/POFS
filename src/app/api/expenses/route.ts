import { getExpenses } from '@/server/ExpensesFormHandlers';
import { Prisma } from '@prisma/client';

export async function GET(req: Request)
{
    const { searchParams } = new URL(req.url);
    const branchId = searchParams.get('branchId') || undefined;
    const skip = Number(searchParams.get('skip')) || 0;
    const take = Number(searchParams.get('take')) || 10;

    const orderByField = searchParams.get('orderBy') || 'id';
    const orderDirection = searchParams.get('orderDirection') || 'asc';

    // Filters
    const search = searchParams.get('search') || undefined;
    const date = searchParams.get('date') || '';

    const filters: Prisma.ExpenseWhereInput & { search?: string } = {};
    if (branchId) filters.branchId = branchId;
    if (search) filters.search = search; // ✅ pass search to the handler
    if (date) filters.date = date; // ✅ pass search to the handler

    const { items, total } = await getExpenses(skip, take, { [orderByField]: orderDirection }, filters);
    return Response.json({ items, total });
}