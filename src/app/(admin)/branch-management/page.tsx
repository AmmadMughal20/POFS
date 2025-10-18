import { getBranches } from '@/server/BranchFormHandlers';
import BranchesPageClient from '../../../components/Branch/BranchClientComponent/BranchClientComponent';

export default async function Page()
{
    const branches = await getBranches(0, 5); // Server-side data fetching


    return <BranchesPageClient initialBranches={branches} />;
}
