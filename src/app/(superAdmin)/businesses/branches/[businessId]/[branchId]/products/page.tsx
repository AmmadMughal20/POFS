import ProductsPageClient from "@/components/Product/ProductClientComponent/ProductClientComponent";
import { getCategoryes } from "@/server/CategoryFormHandlers";
import { getUserSession } from "@/server/getUserSession";
import { getProducts } from "@/server/ProductFormHandlers";

interface ProductPageProps
{
    params: Promise<{
        businessId: string;
        branchId: string;
    }>;
}

const page = async ({ params }: ProductPageProps) =>
{

    const { businessId, branchId } = await params;
    const { items, total } = await getProducts(0, 5, { id: "asc" }, { businessId, branchId });
    const { permissions } = await getUserSession();
    const { items: categories } = await getCategoryes(undefined, undefined, undefined, { businessId })

    return <ProductsPageClient initialProducts={items} permissions={permissions} initialTotal={total} businessId={businessId} branchId={branchId} categories={categories} />;

}

export default page