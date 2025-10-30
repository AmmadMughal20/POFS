import StocksPageClient from '@/components/Stock/StockClientComponent/StockClientComponent';
import { getProducts } from '@/server/ProductFormHandlers';
import { getUserSession } from '@/server/getUserSession';
import { getStocks } from '@/server/StockFormHandlers';


interface StockPageProps
{
    params: Promise<{
        businessId: string;
        branchId: string;
    }>;
}

const page = async ({ params }: StockPageProps) =>
{
    const { businessId, branchId } = await params;
    const { items, total } = await getStocks(0, 10, { productId: "asc" }, { branchId });
    const { items: businessProducts } = await getProducts(undefined, undefined, { id: "asc" }, { businessId });
    const { permissions } = await getUserSession();

    return (<StocksPageClient initialStocks={items} permissions={permissions} initialTotal={total} branchId={branchId} businessProducts={businessProducts} />)
}

export default page