import { getBranches } from '@/server/BranchFormHandlers';
import BranchesPageClient from '../../../components/BranchClientComponent';

export default async function Page()
{
    const branches = await getBranches(); // Server-side data fetching

    return <BranchesPageClient initialBranches={branches} />;
}
