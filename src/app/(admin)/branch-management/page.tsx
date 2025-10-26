import { getBranches } from '@/server/BranchFormHandlers';
import BranchesPageClient from '../../../components/Branch/BranchClientComponent/BranchClientComponent';
import { getUserSession } from '@/server/getUserSession';

export default async function Page()
{
    const { items, total } = await getBranches(0, 5); // Server-side data fetching

    const { user, permissions } = await getUserSession();
    console.log(user)
    const businessId = 'SS_01'
    return <BranchesPageClient initialBranches={items} permissions={permissions} initialTotal={total} businessId={businessId} />;
}
