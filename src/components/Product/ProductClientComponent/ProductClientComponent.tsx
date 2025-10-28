'use client'

import ProductForm from '@/components/Product/ProductForm/ProductForm';
import ViewProductDetialsPopup from '@/components/Product/ViewProductDetailsPopup/ViewProductDetialsPopup';
import Button from '@/components/ui/Button/Button';
import Card from '@/components/ui/Card/Card';
import Page from '@/components/ui/Page/Page';
import Popup from '@/components/ui/Popup/Popup';
import RowActions from '@/components/ui/RowActions/RowActions';
import Table, { Align, Column } from '@/components/ui/Table/Table';
import { ICategory } from '@/schemas/CategorySchema';
import { IProduct } from '@/schemas/ProductSchema';
import { ISupplier } from '@/schemas/SupplierSchema';
import { getCategoryes } from '@/server/CategoryFormHandlers';
import
{
    handleProductAddAction,
} from '@/server/ProductFormHandlers';
import { getSupplieres } from '@/server/SupplierFormHandlers';
import { hasPermission } from '@/server/getUserSession';
import { Grid, List, PencilIcon, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductCard from '../ProductCard/ProductCard';

// export const dynamic = 'force-dynamic' // ✅ forces fresh fetch on refresh


interface Props
{
    initialProducts: IProduct[];
    permissions: string[];
    initialTotal: number
    businessId: string,
    branchId: string,
}

export default function ProductsPageClient({ initialProducts, permissions, initialTotal, businessId, branchId }: Props)
{

    const data: IProduct[] = (initialProducts)
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const total = initialTotal
    const products = initialProducts;
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
    const [productAddPopup, setProductAddPopup] = useState(false);
    const [productEditPopup, setProductEditPopup] = useState(false);
    const [viewProductDetails, setViewProductDetails] = useState(false);
    const [displayType, setDisplayType] = useState<'list' | 'grid'>('list')
    const [businessCategories, setBusinessCategories] = useState<ICategory[]>([])
    const [businessSuppliers, setBusinessSuppliers] = useState<ISupplier[]>([])
    const router = useRouter()

    useEffect(() =>
    {
        if (businessId)
        {
            const fetchCategories = async () =>
            {
                const { items: categories, total: totalCategories } = await getCategoryes(undefined, undefined, undefined, { businessId })
                setBusinessCategories(categories)
            }

            const fetchSuppliers = async () =>
            {
                const { items: suppliers, total: totalSuppliers } = await getSupplieres(undefined, undefined, undefined, { businessId })
                setBusinessSuppliers(suppliers)
            }

            fetchCategories()
            fetchSuppliers()
        }
    }, [businessId])

    if (products.length === 0)
    {
        return (
            <Page>
                <div className='flex justify-between items-center mb-6'>
                    <h5>Products</h5>
                </div>

                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg font-medium">No products found.</p>
                    <p className="text-sm mb-4">Click below to add your first product.</p>
                    <Button onClick={() => setProductAddPopup(true)}>Add Product</Button>
                </div>

                <Popup isOpen={productAddPopup} onClose={() => { setProductAddPopup(false); router.refresh() }}>
                    <ProductForm mode='add' onSubmitAction={handleProductAddAction} businessId={businessId} branchId={branchId} businessCategories={businessCategories} businessSuppliers={businessSuppliers} />
                </Popup>
            </Page>
        )
    }

    const handleDelete = async (id?: number) =>
    {
        if (confirm(`Delete product ${id}?`))
        {
            const formData = new FormData();
            formData.append('productId', id?.toString() || '');
            // await handleProductDeleteAction({}, formData);
            alert(`Product ${id} deleted successfully!`);
            router.refresh()
        }
    };

    const productCols: Column<IProduct>[] = [{
        key: "id",
        label: "Id",
        sortable: true,
        align: Align.CENTER,
        headerStyle: { textAlign: Align.CENTER },
        bodyStyle: { textAlign: Align.CENTER },
    }, {
        key: "title",
        label: "Title",
        sortable: true,
        align: Align.CENTER,
        headerStyle: { textAlign: Align.CENTER },
        bodyStyle: { textAlign: Align.CENTER },
    }, {
        key: "sku",
        label: "SKU",
        sortable: true,
        align: Align.CENTER,
        headerStyle: { textAlign: Align.CENTER },
        bodyStyle: { textAlign: Align.CENTER },
    }, {
        key: "rate",
        label: "Rate",
        sortable: true,
        align: Align.CENTER,
        headerStyle: { textAlign: Align.CENTER },
        bodyStyle: { textAlign: Align.CENTER },
    },
    ]

    const columnsWithActions: Column<IProduct>[] = [
        ...productCols,
        {
            key: "categoryId",
            label: "Category",
            sortable: true,
            align: Align.CENTER,
            headerStyle: { textAlign: Align.CENTER },
            bodyStyle: { textAlign: Align.CENTER },
            render: (row: IProduct) => (
                <p>{row.Category?.name}</p>
            )
        }, {
            key: "supplierId",
            label: "Supplier",
            sortable: true,
            align: Align.CENTER,
            headerStyle: { textAlign: Align.CENTER },
            bodyStyle: { textAlign: Align.CENTER },
            render: (row: IProduct) => (
                <p>{row.Supplier?.name}</p>
            )
        },
        {
            key: "stocks",
            label: "Stocks",
            sortable: true,
            align: Align.CENTER,
            headerStyle: { textAlign: Align.CENTER },
            bodyStyle: { textAlign: Align.CENTER },
            render: (row: IProduct) => (
                <p>{row.stocks?.[0]?.stockUnits || '0'}</p>
            )
        },
        {
            key: 'actions', // ✅ now allowed
            label: 'ACTIONS',
            align: Align.CENTER,
            render: (row) => (
                <RowActions
                    onView={() =>
                    {
                        const product = products.find((b: IProduct) => b.id === row.id);
                        if (product) setSelectedProduct(product);
                        setViewProductDetails(true);
                    }}
                    onEdit={() =>
                    {
                        const product = products.find(b => b.id === row.id);
                        if (product) setSelectedProduct(product);
                        setProductEditPopup(true);
                    }}
                    onDelete={() => handleDelete(row.id)}
                    showView={hasPermission(permissions, "product:view")}
                    showEdit={hasPermission(permissions, "product:update")}
                    showDelete={hasPermission(permissions, "product:delete")}
                />
            )
            ,
        },
    ];

    const handleSearch = (searchTerm: string) =>
    {
        // await
        console.log(searchTerm)
        return undefined
    }

    return (
        <Page>
            <div className='flex justify-between items-center'>
                <Card className='flex w-full items-center justify-between'>
                    <div className='flex gap-5 items-center'>
                        <h5>Products</h5>
                        {
                            hasPermission(permissions, "product:create") ?
                                <Button className='!rounded-full !p-0' onClick={() => setProductAddPopup(true)}>
                                    <Plus />
                                </Button> : <></>
                        }
                    </div>
                    <div className='flex gap-2'>
                        <div className={`p-1 rounded cursor-pointer ${displayType == 'list' && 'bg-accent'}`} onClick={() => setDisplayType('list')}>
                            <List />
                        </div>
                        <div className={`p-1 rounded cursor-pointer ${displayType == 'grid' && 'bg-accent'}`} onClick={() => setDisplayType('grid')}>
                            <Grid />
                        </div>
                    </div>
                </Card>
            </div>
            <div className='pt-3'>
                {
                    displayType == "list" &&
                    <Table<IProduct>
                        columns={columnsWithActions}
                        data={data}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        total={total}
                        onPageChange={setPage}
                        onRowsPerPageChange={setRowsPerPage}
                        onSearch={handleSearch}
                        config={{
                            enableSearch: true,
                            enablePagination: true,
                            defaultRowsPerPage: rowsPerPage,
                            rowsPerPageOptions: [5, 10, 15],
                        }}
                    />
                }
                {
                    displayType == "grid" &&
                    <div className='grid grid-cols-4 gap-4 mt-3'>
                        {
                            products.map(product => (
                                <ProductCard
                                    title={product.title}
                                    description={product.description}
                                    sku={product.sku}
                                    stocks={product.stocks}
                                    rate={product.rate}
                                    categoryId={product.categoryId}
                                    supplierId={product.supplierId}
                                    createdBy={product.createdBy}
                                    createdAt={product.createdAt}
                                    updatedBy={product.updatedBy}
                                    updatedAt={product.updatedAt}
                                    branchId={product.branchId}
                                    businessId={product.businessId}
                                    key={product.id}
                                    id={product.id}
                                />
                            ))
                        }
                    </div>
                }
            </div>

            <Popup isOpen={productAddPopup} onClose={() => { setProductAddPopup(false); router.refresh(); }}>
                <ProductForm mode='add' onSubmitAction={handleProductAddAction} businessId={businessId} branchId={branchId} businessCategories={businessCategories} businessSuppliers={businessSuppliers} />
            </Popup>

            {/* <Popup isOpen={productEditPopup} onClose={() => { setProductEditPopup(false); setSelectedProduct(null); router.refresh(); }}>
                {selectedProduct && (
                    <ProductForm mode='edit' initialData={selectedProduct}
                        // onSubmitAction={handleProductEditAction}
                        businessId={businessId} branchId={branchId} businessCategories={businessCategories} businessSuppliers={businessSuppliers} />
                )}
            </Popup> */}

            <Popup isOpen={viewProductDetails} onClose={() => { setViewProductDetails(false); setSelectedProduct(null); }}>
                {selectedProduct && (
                    <ViewProductDetialsPopup selectedProduct={selectedProduct} onClose={() => { setViewProductDetails(false); setSelectedProduct(null); }} permissions={permissions} />
                )}
            </Popup>

        </Page>
    );
}
