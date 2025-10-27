import OrdersPageClient from "@/components/Order/OrderClientComponent/OrderClientComponent";
import { getUserSession } from "@/server/getUserSession";
import { getOrders } from "@/server/OrderFormHandlers";

interface OrderPageProps
{
    params: Promise<{
        businessId: string;
        branchId: string;
    }>;
}

const page = async ({ params }: OrderPageProps) =>
{

    const { businessId, branchId } = await params;
    const { items, total } = await getOrders(0, 5, { id: "asc" }, { businessId, branchId });
    const { user, permissions } = await getUserSession();

    const initialOrders = items.map((order) => ({ ...order, totalAmount: parseFloat(order.totalAmount.toString()) }))

    return <OrdersPageClient initialOrders={initialOrders} permissions={permissions} initialTotal={total} businessId={businessId} branchId={branchId} />;

}

export default page