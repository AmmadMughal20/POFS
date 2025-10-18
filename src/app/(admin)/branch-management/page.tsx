import { getBranches } from '@/server/BranchFormHandlers';
import BranchesPageClient from '../../../components/Branch/BranchClientComponent/BranchClientComponent';
import { getUserSession } from '@/server/getUserSession';

export default async function Page()
{
    const branches = await getBranches(0, 5); // Server-side data fetching

    const { permissions } = await getUserSession();
    return <BranchesPageClient initialBranches={branches} permissions={permissions} />;
}
