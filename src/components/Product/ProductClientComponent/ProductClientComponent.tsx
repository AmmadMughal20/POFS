'use client'

import ProductForm from '@/components/Product/ProductForm/ProductForm';
import ViewProductDetialsPopup from '@/components/Product/ViewProductDetailsPopup/ViewProductDetialsPopup';
import Button from '@/components/ui/Button/Button';
import Card from '@/components/ui/Card/Card';
import Page from '@/components/ui/Page/Page';
import Popup from '@/components/ui/Popup/Popup';
import RowActions from '@/components/ui/RowActions/RowActions';
import Table, { Align, Column } from '@/components/ui/Table/Table';
import { fetcher } from '@/lib/fetcher';
import { ICategory } from '@/schemas/CategorySchema';
import { IProduct } from '@/schemas/ProductSchema';
import { ISupplier } from '@/schemas/SupplierSchema';
import { getCategoryes } from '@/server/CategoryFormHandlers';
import { handleProductAddAction } from '@/server/ProductFormHandlers';
import { getSupplieres } from '@/server/SupplierFormHandlers';
import { hasPermission } from '@/server/getUserSession';
import { Grid, List, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import ProductCard from '../ProductCard/ProductCard';

interface Props
{
    initialProducts: IProduct[];
    permissions: string[];
    initialTotal: number
    businessId: string,
    branchId: string,
    categories: ICategory[]
}

export default function ProductsPageClient({ initialProducts, permissions, initialTotal, businessId, branchId, categories }: Props)
{
    const router = useRouter()
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [displayType, setDisplayType] = useState<'list' | 'grid'>('list')
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
    const [productAddPopup, setProductAddPopup] = useState(false);
    const [productEditPopup, setProductEditPopup] = useState(false);
    const [viewProductDetails, setViewProductDetails] = useState(false);
    const [orderBy, setOrderBy] = useState('id');
    const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
    const [categoryFilter, setCategoryFilter] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [businessCategories, setBusinessCategories] = useState<ICategory[]>([])
    const [businessSuppliers, setBusinessSuppliers] = useState<ISupplier[]>([])

    const skip = (page - 1) * rowsPerPage;

    const query = new URLSearchParams({
        branchId: branchId || '',
        skip: skip.toString(),
        take: rowsPerPage.toString(),
        orderBy,
        orderDirection,
        ...(categoryFilter ? { category: categoryFilter } : {}),
        ...(searchTerm ? { search: searchTerm } : {}),
    });

    const { data, error, isLoading, mutate } = useSWR(
        `/api/products?${query.toString()}`,
        fetcher,
        {
            fallbackData: { items: initialProducts, total: initialTotal },
            revalidateOnFocus: true,
        }
    );

    useEffect(() =>
    {
        const timer = setTimeout(() =>
        {
            handleSearch(searchTerm);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const products: IProduct[] = data?.items ?? [];
    const total = data?.total ?? 0;

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

    const columnsWithActions: Column<IProduct, string>[] = [
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

    const handleSearch = async (term: string) =>
    {
        setSearchTerm(term);

        // Build new query params
        const query = new URLSearchParams({
            branchId: branchId || '',
            skip: '0',
            take: rowsPerPage.toString(),
            orderBy,
            orderDirection,
            ...(categoryFilter ? { category: categoryFilter } : {}),
            ...(term ? { search: term } : {}),
        });

        // Ask SWR to revalidate with the new key
        await mutate(fetcher(`/api/products?${query.toString()}`), {
            revalidate: true,
        });
    };

    const handleSort = async (key: string, dir: 'asc' | 'desc') =>
    {
        setOrderBy(key);
        setOrderDirection(dir);

        const query = new URLSearchParams({
            branchId: branchId || '',
            skip: skip.toString(),
            take: rowsPerPage.toString(),
            orderBy: key,
            orderDirection: dir,
            ...(categoryFilter ? { category: categoryFilter } : {}),
            ...(searchTerm ? { search: searchTerm } : {}),
        });

        await mutate(fetcher(`/api/products?${query.toString()}`), {
            revalidate: true,
        });
    }

    return (
        <Page>
            <div className='flex justify-between items-center'>
                <Card className='flex w-full items-center justify-between'>
                    <div className='flex gap-5 items-center'>
                        <h5>Products  {'(' + total + ')'}</h5>
                        {
                            hasPermission(permissions, "product:create") ?
                                <Button className='!rounded-full !p-0' onClick={() => setProductAddPopup(true)}>
                                    <Plus />
                                </Button> : <></>
                        }
                    </div>
                    <div className='flex justify-between items-center gap-2'>
                        <div className='flex gap-2 items-center'>
                            <button
                                onClick={() =>
                                {
                                    setCategoryFilter('');
                                    setSearchTerm('');
                                    setTimeout(() => mutate(undefined, { revalidate: true }), 0);
                                }}
                                className="px-3 py-1.5 text-sm rounded bg-gray-100 hover:bg-gray-200 border border-gray-300"
                            >
                                Refresh
                            </button>
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="border rounded px-3 py-1 text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value || '')}
                                className="border rounded px-3 py-1 text-sm"
                            >
                                <option value="">All</option>
                                {categories.map((item) => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Rows per page selector */}
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                <span>Rows per page:</span>
                                <select
                                    value={rowsPerPage}
                                    onChange={(e) =>
                                    {
                                        setRowsPerPage(Number(e.target.value));
                                        setPage(1); // reset to first page when rows per page changes
                                    }}
                                    className="border rounded px-2 py-1 text-sm"
                                >
                                    {[5, 10, 15, 20, 25, 50].map((size) => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Page number and navigation */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">
                                    Page {page} of {Math.ceil(total / rowsPerPage)}
                                </span>
                                <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>
                                    Prev
                                </Button>
                                <Button
                                    disabled={skip + rowsPerPage >= total}
                                    onClick={() => setPage(page + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
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
                    <Table<IProduct, string>
                        columns={columnsWithActions}
                        data={products}
                        total={total}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={setPage}
                        onRowsPerPageChange={setRowsPerPage}
                        onSearch={handleSearch}
                        onSort={handleSort}
                        loading={isLoading}
                        config={{
                            enableSearch: false,
                            enablePagination: false,
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
                {displayType === "list" && products.length === 0 && !isLoading && (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-lg font-medium">No products found.</p>
                        {hasPermission(permissions, "product:create") && (
                            <Button onClick={() => setProductAddPopup(true)}>Add Product</Button>
                        )}
                    </div>
                )}
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

            <Popup isOpen={viewProductDetails} onClose={() => { setViewProductDetails(false); setSelectedProduct(null); }} className='!overflow-hidden'>
                {selectedProduct && (
                    <ViewProductDetialsPopup selectedProduct={selectedProduct} onClose={() => { setViewProductDetails(false); setSelectedProduct(null); }} permissions={permissions} />
                )}
            </Popup>

        </Page>
    );
}
