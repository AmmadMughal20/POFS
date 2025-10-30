import SalesmenPageClient from '@/components/Salesman/SalesmanClientComponent/SalesmanClientComponent';
import { getBranch } from '@/server/BranchFormHandlers';
import { getUserSession } from '@/server/getUserSession';
import { getSalesmen } from '@/server/SalesmanFormHandlers';


interface SalesmanPageProps
{
    params: Promise<{
        businessId: string;
        branchId: string;
    }>;
}

const page = async ({ params }: SalesmanPageProps) =>
{
    const { branchId } = await params;
    const { items, total } = await getSalesmen(0, 10, { id: "asc" }, { branchId });
    const { permissions } = await getUserSession();
    const branch = await getBranch(branchId)
    const businessId = branch?.businessId ?? ''

    return (<SalesmenPageClient initialSalesmen={items} permissions={permissions} initialTotal={total} branchId={branchId} businessId={businessId} />)
}

export default page