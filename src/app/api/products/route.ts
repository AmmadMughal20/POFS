import { getProducts } from '@/server/ProductFormHandlers';
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
    const category = searchParams.get('category') || undefined;

    const filters: Prisma.ProductWhereInput & { search?: string } = {};
    if (branchId) filters.branchId = branchId;
    if (search) filters.search = search; // ✅ pass search to the handler
    if (category) filters.categoryId = parseInt(category)

    const { items, total } = await getProducts(skip, take, { [orderByField]: orderDirection }, filters);
    return Response.json({ items, total });
}