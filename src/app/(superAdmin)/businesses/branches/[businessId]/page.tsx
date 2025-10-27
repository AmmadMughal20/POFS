import BranchesPageClient from '@/components/Branch/BranchClientComponent/BranchClientComponent'
import { getBranches } from '@/server/BranchFormHandlers'
import { getCategoryes } from '@/server/CategoryFormHandlers'
import { getUserSession } from '@/server/getUserSession'
import { getSupplieres } from '@/server/SupplierFormHandlers'
import React from 'react'

type PageParams = {
    params: Promise<{ businessId: string }>
}

const page = async ({ params }: PageParams) =>
{
    const { businessId } = await params;
    const { items, total } = await getBranches(0, 5, { id: "asc" }, { businessId }); // Server-side data fetching
    const { user, permissions } = await getUserSession();
    const { items: categories, total: totalCategories } = await getCategoryes(undefined, undefined, undefined, { businessId })
    const { items: suppliers, total: totalSuppliers } = await getSupplieres(undefined, undefined, undefined, { businessId })
    return <BranchesPageClient initialBranches={items} permissions={permissions} initialTotal={total} businessId={businessId} categories={categories} suppliers={suppliers} />;
}

export default page