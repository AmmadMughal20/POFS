import { getStocks } from '@/server/StockFormHandlers';
import { Prisma } from '@prisma/client';

export async function GET(req: Request)
{
    const { searchParams } = new URL(req.url);
    const branchId = searchParams.get('branchId') || undefined;
    const skip = Number(searchParams.get('skip')) || 0;
    const take = Number(searchParams.get('take')) || 10;

    const orderByField = searchParams.get('orderBy') || 'productId';
    const orderDirection = searchParams.get('orderDirection') || 'asc';

    // Filters
    const search = searchParams.get('search') || undefined;
    const product = searchParams.get('product') || undefined;

    const filters: Prisma.StockWhereInput & { search?: string } = {};
    if (branchId) filters.branchId = branchId;
    if (search) filters.search = search; // ✅ pass search to the handler
    if (product) filters.productId = parseInt(product)

    const { items, total } = await getStocks(skip, take, { [orderByField]: orderDirection }, filters);
    return Response.json({ items, total });
}