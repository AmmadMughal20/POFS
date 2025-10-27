import { getBranches } from '@/server/BranchFormHandlers';
import BranchesPageClient from '../../../components/Branch/BranchClientComponent/BranchClientComponent';
import { getUserSession } from '@/server/getUserSession';
import { getCategoryes } from '@/server/CategoryFormHandlers';

export default async function Page()
{
    const { items, total } = await getBranches(0, 5); // Server-side data fetching
    const businessId = 'SS_01'

    const { items: categories, total: totalCategories } = await getCategoryes(undefined, undefined, undefined, { businessId })

    const { user, permissions } = await getUserSession();
    return <BranchesPageClient initialBranches={items} permissions={permissions} initialTotal={total} businessId={businessId} categories={categories} suppliers={[]} />;
}
