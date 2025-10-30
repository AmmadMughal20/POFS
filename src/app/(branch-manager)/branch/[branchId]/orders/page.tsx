import OrdersPageClient from '@/components/Order/OrderClientComponent/OrderClientComponent';
import { getCategoryes } from '@/server/CategoryFormHandlers';
import { getUserSession } from '@/server/getUserSession';
import { getOrders } from '@/server/OrderFormHandlers';
import { getProducts } from '@/server/ProductFormHandlers';


interface OrderPageProps
{
    params: Promise<{
        businessId: string;
        branchId: string;
    }>;
}

const page = async ({ params }: OrderPageProps) =>
{
    const { branchId } = await params;
    const { items, total } = await getOrders(0, 5, { id: "asc" }, { branchId });
    const { items: products } = await getProducts(undefined, undefined, undefined, { branchId })
    const businessId = products[0]?.businessId
    const { items: categories } = await getCategoryes(undefined, undefined, undefined, { businessId })
    const { permissions } = await getUserSession();

    const initialOrders = items.map((order) => ({ ...order, totalAmount: parseFloat(order.totalAmount.toString()) }))
    return (<OrdersPageClient initialOrders={initialOrders} permissions={permissions} initialTotal={total} businessId={businessId} branchId={branchId} customers={[]} products={products} categories={categories} />)
}

export default page