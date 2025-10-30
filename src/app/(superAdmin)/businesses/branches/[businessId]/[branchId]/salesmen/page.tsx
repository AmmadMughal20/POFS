import SalesmenPageClient from "@/components/Salesman/SalesmanClientComponent/SalesmanClientComponent";
import { getUserSession } from "@/server/getUserSession";
import { getSalesmen } from "@/server/SalesmanFormHandlers";

interface SalesmanPageProps
{
    params: Promise<{
        businessId: string;
        branchId: string;
    }>;
}

const page = async ({ params }: SalesmanPageProps) =>
{

    const { businessId, branchId } = await params;
    const { items, total } = await getSalesmen(0, 5, { id: "asc" }, { businessId, branchId });
    const { permissions } = await getUserSession();

    return <SalesmenPageClient initialSalesmen={items} permissions={permissions} initialTotal={total} businessId={businessId} branchId={branchId} />;

}

export default page