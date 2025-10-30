'use client'

import OrderForm from '@/components/Order/OrderForm/OrderForm';
import ViewOrderDetialsPopup from '@/components/Order/ViewOrderDetailsPopup/ViewOrderDetialsPopup';
import Button from '@/components/ui/Button/Button';
import Card from '@/components/ui/Card/Card';
import Page from '@/components/ui/Page/Page';
import Popup from '@/components/ui/Popup/Popup';
import RowActions from '@/components/ui/RowActions/RowActions';
import Table, { Align, Column } from '@/components/ui/Table/Table';
import { fetcher } from '@/lib/fetcher';
import { ICategory } from '@/schemas/CategorySchema';
import { IOrder } from '@/schemas/OrderSchema';
import { IProduct } from '@/schemas/ProductSchema';
import { IUser } from '@/schemas/UserSchema';
import { handleOrderAddAction, handleOrderEditAction } from '@/server/OrderFormHandlers';
import { hasPermission } from '@/server/getUserSession';
import { Grid, List, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import OrderCard from '../OrderCard/OrderCard';
import OrderStatusForm from '../OrderStatusForm/OrderStatusForm';

interface OrdersPageClientProps
{
    initialOrders: IOrder[];
    permissions: string[];
    initialTotal: number
    branchId: string,
    businessId: string,
    customers: IUser[],
    products: IProduct[],
    categories: ICategory[]
}

export default function OrdersPageClient({ initialOrders, permissions, initialTotal, branchId, businessId, customers, products, categories, }: OrdersPageClientProps)
{
    const router = useRouter()
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [displayType, setDisplayType] = useState<'list' | 'grid'>('list')
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const [orderAddPopup, setOrderAddPopup] = useState(false);
    const [orderEditPopup, setOrderEditPopup] = useState(false);
    const [viewOrderDetails, setViewOrderDetails] = useState(false);
    const [orderBy, setOrderBy] = useState('id');
    const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [modeFilter, setModeFilter] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');

    const skip = (page - 1) * rowsPerPage;

    const query = new URLSearchParams({
        branchId: branchId || '',
        skip: skip.toString(),
        take: rowsPerPage.toString(),
        orderBy,
        orderDirection,
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(modeFilter ? { orderMode: modeFilter } : {}),
        ...(searchTerm ? { search: searchTerm } : {}),
    });

    const { data, error, isLoading, mutate } = useSWR(
        `/api/orders?${query.toString()}`,
        fetcher,
        {
            fallbackData: { items: initialOrders, total: initialTotal },
            revalidateOnFocus: true,
        }
    );

    useEffect(() =>
    {
        const timer = setTimeout(() =>
        {
            handleSearch(searchTerm);
        }, 1000);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const orders: IOrder[] = data?.items ?? [];
    const total = data?.total ?? 0;

    const getBgColor = (status: string) =>
    {
        switch (status)
        {
            case "PENDING":
                return "bg-amber-200";
            case "CONFIRMED":
                return "bg-blue-200";
            case "COMPLETED":
                return "bg-green-200";
            case "CANCELLED":
                return "bg-red-200";
            default:
                return "bg-gray-200";
        }
    };

    const getTextColor = (status: string) =>
    {
        switch (status)
        {
            case "PENDING":
                return "text-amber-500";
            case "CONFIRMED":
                return "text-blue-500";
            case "COMPLETED":
                return "text-green-500";
            case "CANCELLED":
                return "text-red-500";
            default:
                return "text-gray-500";
        }
    };

    const handleDelete = async (id?: number) =>
    {
        if (confirm(`Delete order ${id}?`))
        {
            const formData = new FormData();
            formData.append('orderId', id?.toString() || '');
            // await handleOrderDeleteAction({}, formData);
            alert(`Order ${id} deleted successfully!`);
            router.refresh()
        }
    };

    const orderCols: Column<IOrder>[] = [{
        key: "id",
        label: "Id",
        sortable: true,
        align: Align.CENTER,
        headerStyle: { textAlign: Align.CENTER },
        bodyStyle: { textAlign: Align.CENTER },
    },
    {
        key: "orderMode",
        label: "Mode",
        sortable: true,
        align: Align.CENTER,
        headerStyle: { textAlign: Align.CENTER },
        bodyStyle: { textAlign: Align.CENTER },
    },
    ]

    const columnsWithActions: Column<IOrder, string>[] = [
        ...orderCols,
        {
            key: "customerId",
            label: "Customer",
            sortable: true,
            align: Align.CENTER,
            headerStyle: { textAlign: Align.CENTER },
            bodyStyle: { textAlign: Align.CENTER },
            render: (row: IOrder) => (
                <p>{row.Customer?.User.name} - {row.Customer?.User.phoneNo}</p>
            )
        },
        {
            key: "totalAmount",
            label: "Total Amount",
            sortable: true,
            align: Align.CENTER,
            headerStyle: { textAlign: Align.CENTER },
            bodyStyle: { textAlign: Align.CENTER },
            render: (row: IOrder) => (
                <p>{row.totalAmount ? parseFloat(row.totalAmount.toString()) : 0}</p>
            )
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            align: Align.CENTER,
            headerStyle: { textAlign: Align.CENTER },
            bodyStyle: { textAlign: Align.CENTER },
            render: (row: IOrder) => (
                <p className={`p-1 rounded shadow ${getBgColor(row.status)} ${getTextColor(row.status)}`}>{row.status}</p>
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
                        const order = orders.find((b: IOrder) => b.id === row.id);
                        if (order) setSelectedOrder(order);
                        setViewOrderDetails(true);
                    }}
                    onEdit={() =>
                    {
                        const order = orders.find(b => b.id === row.id);
                        if (order) setSelectedOrder(order);
                        setOrderEditPopup(true);
                    }}
                    onDelete={() => handleDelete(row.id)}
                    showView={hasPermission(permissions, "order:view")}
                    showEdit={hasPermission(permissions, "order:update")}
                    showDelete={false}
                />
            )
            ,
        },
    ];

    const handleSearch = async (term: string) =>
    {
        setSearchTerm(term);

        const query = new URLSearchParams({
            branchId: branchId || '',
            skip: '0',
            take: rowsPerPage.toString(),
            orderBy,
            orderDirection,
            ...(statusFilter ? { status: statusFilter } : {}),
            ...(modeFilter ? { orderMode: modeFilter } : {}),
            ...(term ? { search: term } : {}),
        });
        await mutate(fetcher(`/api/orders?${query.toString()}`), {
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
            ...(statusFilter ? { status: statusFilter } : {}),
            ...(modeFilter ? { orderMode: modeFilter } : {}),
            ...(searchTerm ? { search: searchTerm } : {}),
        });

        await mutate(fetcher(`/api/orders?${query.toString()}`), {
            revalidate: true,
        });
    }

    if (error)
    {
        return (
            <Page>
                <div className="text-center py-10">
                    <p className="text-red-500 font-semibold text-lg">
                        Failed to load orders.
                    </p>
                    <p className="text-gray-500 text-sm">
                        {error?.message || 'Something went wrong while fetching orders.'}
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
                        <h5>Orders  {'(' + total + ')'}</h5>
                        {
                            hasPermission(permissions, "order:create") ?
                                <Button className='!rounded-full !p-0' onClick={() => setOrderAddPopup(true)}>
                                    <Plus />
                                </Button> : <></>
                        }
                    </div>
                    <div className='flex justify-between items-center gap-2'>
                        <div className='flex gap-2 items-center'>
                            <button
                                onClick={() =>
                                {
                                    setModeFilter('');
                                    setStatusFilter('');
                                    setSearchTerm('');
                                    setTimeout(() => mutate(undefined, { revalidate: true }), 0);
                                }}
                                className="px-3 py-1.5 text-sm rounded bg-gray-100 hover:bg-gray-200 border border-gray-300"
                            >
                                Refresh
                            </button>
                            <input
                                type="text"
                                placeholder="Search orders..."
                                className="border rounded px-3 py-1 text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value || '')}
                                className="border rounded px-3 py-1 text-sm"
                            >
                                <option value="">All Statuses</option>
                                <option value="PENDING">Pending</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                            <select
                                value={modeFilter}
                                onChange={(e) => setModeFilter(e.target.value || '')}
                                className="border rounded px-3 py-1 text-sm"
                            >
                                <option value="">All Modes</option>
                                <option value="OFFLINE">Offline</option>
                                <option value="ONLINE">Online</option>
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
                    <Table<IOrder, string>
                        columns={columnsWithActions}
                        data={orders}
                        total={total}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={setPage}
                        onRowsPerPageChange={setRowsPerPage}
                        onSearch={handleSearch}
                        onSort={(key, dir) => handleSort(key, dir)}
                        // onRefresh={() => mutate()} // works perfectly with SWR
                        loading={isLoading}
                        config={{
                            enableSearch: false,
                            enablePagination: false,
                            alternateRowColors: true,
                            rowsPerPageOptions: [5, 10, 15]
                        }}
                    />
                }
                {
                    displayType == "grid" &&
                    <div className='grid grid-cols-4 mt-3 gap-3'>
                        {
                            orders.map(order => (
                                <OrderCard
                                    order={order}
                                    key={order.id}
                                    onView={(ordr) =>
                                    {
                                        setSelectedOrder(ordr);
                                        setViewOrderDetails(true);
                                    }}
                                />
                            ))
                        }
                    </div>
                }
                {displayType === "list" && orders.length === 0 && !isLoading && (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-lg font-medium">No orders found.</p>
                        {hasPermission(permissions, "order:create") && (
                            <Button onClick={() => setOrderAddPopup(true)}>Add Order</Button>
                        )}
                    </div>
                )}
            </div>

            <Popup isOpen={orderAddPopup} onClose={() => { setOrderAddPopup(false); router.refresh(); }}>
                <OrderForm mode='add' onSubmitAction={handleOrderAddAction} branchId={branchId} businessId={businessId} customers={customers} products={products} categories={categories} mutate={mutate} />
            </Popup>

            <Popup isOpen={orderEditPopup} onClose={() => { setOrderEditPopup(false); setSelectedOrder(null); router.refresh(); }}>
                {selectedOrder && (
                    <OrderStatusForm order={selectedOrder} onUpdateAction={handleOrderEditAction} mutate={mutate} />
                )}
            </Popup>

            <Popup isOpen={viewOrderDetails} onClose={() => { setViewOrderDetails(false); setSelectedOrder(null); }}>
                {selectedOrder && (
                    <ViewOrderDetialsPopup selectedOrder={selectedOrder} onClose={() => { setViewOrderDetails(false); setSelectedOrder(null); }} permissions={permissions} />
                )}
            </Popup>

        </Page>
    );
}
