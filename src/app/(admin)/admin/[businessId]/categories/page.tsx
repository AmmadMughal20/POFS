import CategoriesClienPage from '@/components/Category/CategoriesClientPage/CategoriesClienPage';
import { getCategoryes } from '@/server/CategoryFormHandlers';
import { getUserSession } from '@/server/getUserSession';


interface CategoryPageProps
{
    params: Promise<{
        businessId: string;
    }>;
}

const page = async ({ params }: CategoryPageProps) =>
{
    const { businessId } = await params
    const { items, total } = await getCategoryes(0, 5, undefined, { businessId })
    const { permissions } = await getUserSession()
    return (
        <CategoriesClienPage businessId={businessId} initialcategories={items} initialTotal={total} permissions={permissions} />
    )
}

export default page