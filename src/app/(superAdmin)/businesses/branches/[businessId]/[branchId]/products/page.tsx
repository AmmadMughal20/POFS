import ProductsPageClient from "@/components/Product/ProductClientComponent/ProductClientComponent";
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
    const { user, permissions } = await getUserSession();

    return <ProductsPageClient initialProducts={items} permissions={permissions} initialTotal={total} businessId={businessId} branchId={branchId} />;

}

export default page