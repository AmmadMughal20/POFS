import { getBranches } from '@/server/BranchFormHandlers';
import { getCategoryes } from '@/server/CategoryFormHandlers';
import { getUserSession } from '@/server/getUserSession';
import { getServerSession } from 'next-auth';
import BranchesPageClient from '../../../components/Branch/BranchClientComponent/BranchClientComponent';

export default async function Page()
{
    const session = await getServerSession()
    const businessId = session?.user.businessId
    const { permissions } = await getUserSession()

    const { items, total } = await getBranches(0, 5, undefined, { businessId: businessId ?? '' }); // Server-side data fetching

    const { items: categories, total: totalCategories } = await getCategoryes(undefined, undefined, undefined, { businessId: businessId ?? '' })

    return <BranchesPageClient initialBranches={items} permissions={permissions ?? []} initialTotal={total} businessId={businessId ?? ''} categories={categories} suppliers={[]} />;
}
