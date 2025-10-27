'use client'

import OrderForm from '@/components/Order/OrderForm/OrderForm';
import ViewOrderDetialsPopup from '@/components/Order/ViewOrderDetailsPopup/ViewOrderDetialsPopup';
import Button from '@/components/ui/Button/Button';
import Page from '@/components/ui/Page/Page';
import Popup from '@/components/ui/Popup/Popup';
import RowActions from '@/components/ui/RowActions/RowActions';
import Table, { Align, Column } from '@/components/ui/Table/Table';
import { IOrder } from '@/schemas/OrderSchema';
import
{
    handleOrderAddAction,
    // handleOrderDeleteAction, handleOrderEditAction
} from '@/server/OrderFormHandlers';
import { hasPermission } from '@/server/getUserSession';
import { Grid, List, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import OrderCard from '../OrderCard/OrderCard';
import Card from '@/components/ui/Card/Card';
import ProductForm from '@/components/Product/ProductForm/ProductForm';
import { ICategory } from '@/schemas/CategorySchema';
import { handleProductAddAction } from '@/server/ProductFormHandlers';
import { ISupplier } from '@/schemas/SupplierSchema';

// export const dynamic = 'force-dynamic' // ✅ forces fresh fetch on refresh


interface Props
{
    initialOrders: IOrder[];
    permissions: string[];
    initialTotal: number
    businessId: string,
    branchId: string,
}

export default function OrdersPageClient({ initialOrders, permissions, initialTotal, businessId, branchId }: Props)
{

    const data: IOrder[] = (initialOrders)
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const total = initialTotal
    const orders = initialOrders;
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const [orderAddPopup, setOrderAddPopup] = useState(false);
    const [orderEditPopup, setOrderEditPopup] = useState(false);
    const [viewOrderDetails, setViewOrderDetails] = useState(false);
    const [displayType, setDisplayType] = useState<'list' | 'grid'>('list')
    const [showAddProductPopup, setShowAddProductPopup] = useState(false)
    const router = useRouter()

    if (orders.length === 0)
    {
        return (
            <Page>
                <div className='flex justify-between items-center mb-6'>
                    <h5>Orders</h5>
                </div>

                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg font-medium">No orders found.</p>
                    <p className="text-sm mb-4">Click below to add your first order.</p>
                    <Button onClick={() => setOrderAddPopup(true)}>Add Order</Button>
                </div>

                <Popup isOpen={orderAddPopup} onClose={() => { setOrderAddPopup(false); router.refresh() }}>
                    <OrderForm mode='add' onSubmitAction={handleOrderAddAction} businessId={businessId} />
                </Popup>
            </Page>
        )
    }

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
        key: "status",
        label: "Status",
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
    {
        key: "customerId",
        label: "Customer",
        sortable: true,
        align: Align.CENTER,
        headerStyle: { textAlign: Align.CENTER },
        bodyStyle: { textAlign: Align.CENTER },
    }]

    const columnsWithActions: Column<IOrder>[] = [
        ...orderCols,
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
                    showDelete={hasPermission(permissions, "order:delete")}
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

    const handleViewOrders = (businessId: string, orderId: string) =>
    {
        router.push(`/businesses/orders/${businessId}/${orderId}/orders`)
    }

    const handleViewProducts = (businessId: string, orderId: string) =>
    {
        router.push(`/businesses/orders/${businessId}/${orderId}/products`)
    }

    const handleViewStocks = (businessId: string, orderId: string) =>
    {
        router.push(`/businesses/orders/${businessId}/${orderId}/stocks`)
    }

    return (
        <Page>
            <div className='flex justify-between items-center'>
                <Card className='flex w-full items-center justify-between'>
                    <div className='flex gap-5 items-center'>
                        <h5>Orders</h5>
                        {
                            hasPermission(permissions, "order:create") ?
                                <Button className='!rounded-full !p-0' onClick={() => setOrderAddPopup(true)}>
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
                    <Table<IOrder>
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
                    <div className='grid grid-cols-4 mt-3'>
                        {
                            orders.map(order => (
                                <OrderCard
                                    createdBy={order.createdBy}
                                    createdAt={order.createdAt}
                                    updatedBy={order.updatedBy}
                                    updatedAt={order.updatedAt}
                                    customerId={order.customerId}
                                    branchId={order.branchId}
                                    businessId={order.businessId}
                                    totalAmount={order.totalAmount}
                                    status={order.status}
                                    orderMode={order.orderMode}
                                    orderItems={order.orderItems}
                                    key={order.id}
                                    id={order.id}
                                />
                            ))
                        }
                    </div>
                }
            </div>

            <Popup isOpen={orderAddPopup} onClose={() => { setOrderAddPopup(false); router.refresh(); }}>
                <OrderForm mode='add' onSubmitAction={handleOrderAddAction} businessId={businessId} />
            </Popup>

            {/* <Popup isOpen={orderEditPopup} onClose={() => { setOrderEditPopup(false); setSelectedOrder(null); router.refresh(); }}>
                {selectedOrder && (
                    <OrderForm mode='edit' initialData={selectedOrder} onSubmitAction={handleOrderEditAction} businessId={businessId} />
                )}
            </Popup> */}

            <Popup isOpen={viewOrderDetails} onClose={() => { setViewOrderDetails(false); setSelectedOrder(null); }}>
                {selectedOrder && (
                    <ViewOrderDetialsPopup selectedOrder={selectedOrder} onClose={() => { setViewOrderDetails(false); setSelectedOrder(null); }} permissions={permissions} />
                )}
            </Popup>

        </Page>
    );
}
