'use client'

import StockForm from '@/components/Stock/StockForm/StockForm';
import Button from '@/components/ui/Button/Button';
import Card from '@/components/ui/Card/Card';
import Page from '@/components/ui/Page/Page';
import Popup from '@/components/ui/Popup/Popup';
import RowActions from '@/components/ui/RowActions/RowActions';
import Table, { Align, Column } from '@/components/ui/Table/Table';
import
{
    handleStockAddAction,
    handleStockDeleteAction,
    handleStockEditAction,
} from '@/server/StockFormHandlers';
import { hasPermission } from '@/server/getUserSession';
import { Grid, List, PencilIcon, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { IStock } from '@/schemas/StockSchema';
import { IProduct } from '@/schemas/ProductSchema';

interface Props
{
    initialStocks: IStock[];
    permissions: string[];
    initialTotal: number
    branchId: string,
    businessProducts: IProduct[]
}

export default function StocksPageClient({ initialStocks, permissions, initialTotal, branchId, businessProducts }: Props)
{
    const router = useRouter()
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [displayType, setDisplayType] = useState<'list' | 'grid'>('list')
    const [selectedStock, setSelectedStock] = useState<IStock | null>(null);
    const [stockAddPopup, setStockAddPopup] = useState(false);
    const [stockEditPopup, setStockEditPopup] = useState(false);
    const [orderBy, setOrderBy] = useState('productId');
    const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
    const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
    const [searchTerm, setSearchTerm] = useState('');

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
        `/api/stocks?${query.toString()}`,
        fetcher,
        {
            fallbackData: { items: initialStocks, total: initialTotal },
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

    const stocks: IStock[] = data?.items ?? [];
    const total = data?.total ?? 0;

    const handleDelete = async (productId?: number, branchId?: string) =>
    {
        if (confirm(`Delete stock ${productId} + ${branchId}?`))
        {
            const formData = new FormData();
            formData.append('productId', productId?.toString() || '');
            formData.append('branchId', branchId?.toString() || '');
            await handleStockDeleteAction({}, formData);
            alert(`Stock deleted successfully!`);
            mutate()
        }
    };

    const stockCols: Column<IStock>[] = []

    const columnsWithActions: Column<IStock, string>[] = [
        ...stockCols,
        {
            key: "productId",
            label: "Product Id",
            sortable: true,
            align: Align.LEFT,
            headerStyle: { textAlign: Align.LEFT },
            bodyStyle: { textAlign: Align.LEFT },
            render: (row: IStock) => (
                <p>{row.Product?.id}</p>
            )
        }, {
            key: "productTitle",
            label: "Title",
            sortable: true,
            align: Align.LEFT,
            headerStyle: { textAlign: Align.LEFT },
            bodyStyle: { textAlign: Align.LEFT },
            render: (row: IStock) => (
                <p>{row.Product?.title}</p>
            )
        },
        {
            key: "stocks",
            label: "Stock Units",
            sortable: true,
            align: Align.LEFT,
            headerStyle: { textAlign: Align.LEFT },
            bodyStyle: { textAlign: Align.LEFT },
            render: (row: IStock) => (
                <p>{row.stockUnits || '0'}</p>
            )
        },
        {
            key: 'actions', // ✅ now allowed
            label: 'ACTIONS',
            align: Align.CENTER,
            headerStyle: { textAlign: Align.CENTER },
            render: (row) => (
                <RowActions

                    onEdit={() =>
                    {
                        const stock = stocks.find(b => (b.productId === row.productId && b.branchId === row.branchId));
                        if (stock) setSelectedStock(stock);
                        setStockEditPopup(true);
                    }}
                    onDelete={() => handleDelete(row.productId, row.branchId)}
                    showView={false}
                    showEdit={hasPermission(permissions, "stock:update")}
                    showDelete={hasPermission(permissions, "stock:delete")}
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
        await mutate(fetcher(`/api/stocks?${query.toString()}`), {
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

        await mutate(fetcher(`/api/stocks?${query.toString()}`), {
            revalidate: true,
        });
    }

    if (error)
    {
        return (
            <Page>
                <div className="text-center py-10">
                    <p className="text-red-500 font-semibold text-lg">
                        Failed to load stocks.
                    </p>
                    <p className="text-gray-500 text-sm">
                        {error?.message || 'Something went wrong while fetching stocks.'}
                    </p>
                    <Button onClick={() => mutate()}>Retry</Button>
                </div>
            </Page>
        );
    }

    return (
        <Page>
            <div className='flex justify-between items-center'>
                <Card className='flex w-full items-center justify-between'>
                    <div className='flex gap-5 items-center'>
                        <h5>Stocks  {'(' + total + ')'}</h5>
                        {
                            hasPermission(permissions, "stock:create") ?
                                <Button className='!rounded-full !p-0' onClick={() => setStockAddPopup(true)}>
                                    <Plus />
                                </Button> : <></>
                        }
                    </div>
                    <div className='flex justify-between items-center gap-2'>
                        <div className='flex gap-2 items-center'>
                            <button
                                onClick={() => { setSearchTerm(''); setTimeout(() => mutate(undefined, { revalidate: true }), 0) }}
                                className="px-3 py-1.5 text-sm rounded bg-gray-100 hover:bg-gray-200 border border-gray-300"
                            >
                                Refresh
                            </button>
                            <input
                                type="text"
                                placeholder="Search stocks..."
                                className="border rounded px-3 py-1 text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
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
                    </div>
                </Card>
            </div>
            <div className='pt-3'>
                {
                    displayType == "list" &&
                    <Table<IStock, string>
                        columns={columnsWithActions}
                        data={stocks}
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

                {stocks.length === 0 && !isLoading && (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-lg font-medium">No stocks found.</p>
                        {hasPermission(permissions, "stock:create") && (
                            <Button onClick={() => setStockAddPopup(true)}>Add Stock</Button>
                        )}
                    </div>
                )}
            </div>

            <Popup isOpen={stockAddPopup} onClose={() => { setStockAddPopup(false); router.refresh(); }}>
                <StockForm mode='add' onSubmitAction={handleStockAddAction} branchId={branchId} businessProducts={businessProducts} mutate={mutate} />
            </Popup>

            <Popup isOpen={stockEditPopup} onClose={() => { setStockEditPopup(false); setSelectedStock(null); router.refresh(); }}>
                {selectedStock && (
                    <StockForm mode='edit' initialData={selectedStock} onSubmitAction={handleStockEditAction} branchId={branchId} businessProducts={businessProducts} mutate={mutate} />
                )}
            </Popup>
        </Page>
    );
}
