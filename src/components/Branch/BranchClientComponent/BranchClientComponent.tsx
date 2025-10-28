'use client'

import BranchForm from '@/components/Branch/BranchForm/BranchForm';
import ViewBranchDetialsPopup from '@/components/Branch/ViewBranchDetailsPopup/ViewBranchDetialsPopup';
import Button from '@/components/ui/Button/Button';
import Page from '@/components/ui/Page/Page';
import Popup from '@/components/ui/Popup/Popup';
import RowActions from '@/components/ui/RowActions/RowActions';
import Table, { Align, Column } from '@/components/ui/Table/Table';
import { IBranch } from '@/schemas/BranchSchema';
import { handleBranchAddAction, handleBranchDeleteAction, handleBranchEditAction } from '@/server/BranchFormHandlers';
import { hasPermission } from '@/server/getUserSession';
import { Grid, List, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import BranchCard from '../BranchCard/BranchCard';
import Card from '@/components/ui/Card/Card';
import ProductForm from '@/components/Product/ProductForm/ProductForm';
import { ICategory } from '@/schemas/CategorySchema';
import { handleProductAddAction } from '@/server/ProductFormHandlers';
import { ISupplier } from '@/schemas/SupplierSchema';
import ChangeBranchManagerPopup from '@/components/Manager/ChangeBranchManagerPopup';
import { IManager } from '@/schemas/ManagerSchema';
import { ISalesMan } from '@/schemas/SaleManSchems';
import { getManagersByBusiness } from '@/server/ManagerFormHandlers';
import { getSalesmenByBranch } from '@/server/SalemanFormHandlers';

// export const dynamic = 'force-dynamic' // ✅ forces fresh fetch on refresh


interface Props
{
    initialBranches: IBranch[];
    permissions: string[];
    initialTotal: number
    businessId: string,
    categories: ICategory[]
    suppliers: ISupplier[]
}

export default function BranchesPageClient({ initialBranches, permissions, initialTotal, businessId, categories, suppliers }: Props)
{

    const data: IBranch[] = (initialBranches)
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const total = initialTotal
    const branches = initialBranches;
    const [selectedBranch, setSelectedBranch] = useState<IBranch | null>(null);
    const [branchAddPopup, setBranchAddPopup] = useState(false);
    const [branchEditPopup, setBranchEditPopup] = useState(false);
    const [viewBranchDetails, setViewBranchDetails] = useState(false);
    const [displayType, setDisplayType] = useState<'list' | 'grid'>('list')
    const [showAddProductPopup, setShowAddProductPopup] = useState(false)
    const [showBranchManagerChangePopup, setShowBranchManagerPopup] = useState(false)
    const [existingManagers, setExistingManagers] = useState<IManager[]>()
    const [existingSalesmen, setExistingSalesmen] = useState<ISalesMan[]>()
    const router = useRouter()


    useEffect(() =>
    {
        if (selectedBranch?.id)
        {
            const getExistingManagers = async () =>
            {
                const managers = await getManagersByBusiness(selectedBranch.businessId)
                if (managers.length > 0)
                {
                    setExistingManagers(managers)
                }
            }

            const getExistingSalemen = async () =>
            {
                const salesmen = await getSalesmenByBranch(selectedBranch.id)
                if (salesmen.length > 0)
                {
                    setExistingSalesmen(salesmen)
                }
            }

            getExistingManagers()
            getExistingSalemen()
        }
    }, [selectedBranch?.id])

    if (branches.length === 0)
    {
        return (
            <Page>
                <div className='flex justify-between items-center mb-6'>
                    <h5>Branches</h5>
                </div>

                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg font-medium">No branches found.</p>
                    <p className="text-sm mb-4">Click below to add your first branch.</p>
                    <Button onClick={() => setBranchAddPopup(true)}>Add Branch</Button>
                </div>

                <Popup isOpen={branchAddPopup} onClose={() => { setBranchAddPopup(false); router.refresh() }}>
                    <BranchForm mode='add' onSubmitAction={handleBranchAddAction} businessId={businessId} />
                </Popup>
            </Page>
        )
    }

    const handleDelete = async (id: string) =>
    {
        if (confirm(`Delete branch ${id}?`))
        {
            const formData = new FormData();
            formData.append('branchId', id);
            await handleBranchDeleteAction({}, formData);
            alert(`Branch ${id} deleted successfully!`);
            router.refresh()
        }
    };

    const branchCols: Column<IBranch>[] = [{
        key: "id",
        label: "Id",
        sortable: true,
        align: Align.CENTER,
        headerStyle: { textAlign: Align.CENTER },
        bodyStyle: { textAlign: Align.CENTER },
    }, {
        key: "city",
        label: "City",
        sortable: true,
        align: Align.CENTER,
        headerStyle: { textAlign: Align.CENTER },
        bodyStyle: { textAlign: Align.CENTER },
    }, {
        key: "area",
        label: "Area",
        sortable: true,
        align: Align.CENTER,
        headerStyle: { textAlign: Align.CENTER },
        bodyStyle: { textAlign: Align.CENTER },
    }, {
        key: "phoneNo",
        label: "Phone No",
        sortable: true,
        align: Align.CENTER,
        headerStyle: { textAlign: Align.CENTER },
        bodyStyle: { textAlign: Align.CENTER },
    }, {
        key: "status",
        label: "Status",
        sortable: true,
        align: Align.CENTER,
        headerStyle: { textAlign: Align.CENTER },
        bodyStyle: { textAlign: Align.CENTER },
    },]

    const columnsWithActions: Column<IBranch>[] = [
        ...branchCols,
        {
            key: "openingTimeToDisplay",
            label: "OPENING TIME",
            render: (row) => row.openingTime.toString().substring(16, 21)
        },
        {
            key: "closingTimeToDisplay",
            label: "CLOSING TIME",
            render: (row) => row.closingTime.toString().substring(16, 21)
        },
        {
            key: 'actions', // ✅ now allowed
            label: 'ACTIONS',
            align: Align.CENTER,
            render: (row) => (
                <RowActions
                    onView={() =>
                    {
                        const branch = branches.find((b: IBranch) => b.id === row.id);
                        if (branch) setSelectedBranch(branch);
                        setViewBranchDetails(true);
                    }}
                    onEdit={() =>
                    {
                        const branch = branches.find(b => b.id === row.id);
                        if (branch) setSelectedBranch(branch);
                        setBranchEditPopup(true);
                    }}
                    onDelete={() => handleDelete(row.id)}
                    showView={hasPermission(permissions, "branch:view")}
                    showEdit={hasPermission(permissions, "branch:update")}
                    showDelete={hasPermission(permissions, "branch:delete")}
                    onAddChild={() =>
                    {
                        const branch = branches.find(b => b.id === row.id);
                        if (branch) { setSelectedBranch(branch); setShowAddProductPopup(true); }
                    }}
                    showAddChild={hasPermission(permissions, 'product:create')}
                    addTitle="Add Product"
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

    const handleViewOrders = (businessId: string, branchId: string) =>
    {
        router.push(`/businesses/branches/${businessId}/${branchId}/orders`)
    }

    const handleViewProducts = (businessId: string, branchId: string) =>
    {
        router.push(`/businesses/branches/${businessId}/${branchId}/products`)
    }

    const handleViewStocks = (businessId: string, branchId: string) =>
    {
        router.push(`/businesses/branches/${businessId}/${branchId}/stocks`)
    }

    const handleViewSalemen = (businessId: string, branchId: string) =>
    {
        router.push(`/businesses/branches/${businessId}/${branchId}/salemen`)
    }

    const handleChangeManager = (businessId: string, branchId: string) =>
    {
        setShowBranchManagerPopup(true)
    }


    return (
        <Page>
            <div className='flex justify-between items-center'>
                <Card className='flex w-full items-center justify-between'>
                    <div className='flex gap-5 items-center'>
                        <h5>Branches</h5>
                        {
                            hasPermission(permissions, "branch:create") ?
                                <Button className='!rounded-full !p-0' onClick={() => setBranchAddPopup(true)}>
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
                    <Table<IBranch>
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
                            branches.map(branch => (
                                <BranchCard
                                    key={branch.id}
                                    id={branch.id}
                                    phoneNo={branch.phoneNo}
                                    area={branch.area}
                                    address={branch.address}
                                    city={branch.city}
                                    openingTime={branch.openingTime}
                                    closingTime={branch.closingTime}
                                    status={branch.status}
                                    branchManager={branch.branchManager}
                                    businessId={branch.businessId}
                                />
                            ))
                        }
                    </div>
                }
            </div>

            <Popup isOpen={branchAddPopup} onClose={() => { setBranchAddPopup(false); router.refresh(); }}>
                <BranchForm mode='add' onSubmitAction={handleBranchAddAction} businessId={businessId} />
            </Popup>

            <Popup isOpen={branchEditPopup} onClose={() => { setBranchEditPopup(false); setSelectedBranch(null); router.refresh(); }}>
                {selectedBranch && (
                    <BranchForm mode='edit' initialData={selectedBranch} onSubmitAction={handleBranchEditAction} businessId={businessId} />
                )}
            </Popup>

            <Popup isOpen={viewBranchDetails} onClose={() => setViewBranchDetails(false)}>
                {selectedBranch && (
                    <ViewBranchDetialsPopup selectedBranch={selectedBranch} onClose={() => { setViewBranchDetails(false); setSelectedBranch(null); }} permissions={permissions} onViewOrders={handleViewOrders} onViewProducts={handleViewProducts} onViewStocks={handleViewStocks} handleChangeManager={handleChangeManager} onViewSalemen={handleViewSalemen} />
                )}
            </Popup>

            <Popup isOpen={showAddProductPopup} onClose={() => { setShowAddProductPopup(false); setSelectedBranch(null); }}>
                {
                    selectedBranch &&
                    <ProductForm mode='add' onSubmitAction={handleProductAddAction} businessId={selectedBranch.businessId} branchId={selectedBranch.id} businessCategories={categories} businessSuppliers={suppliers} />
                }
            </Popup>

            <Popup isOpen={showBranchManagerChangePopup} onClose={() => setShowBranchManagerPopup(false)}>
                {
                    selectedBranch &&
                    <ChangeBranchManagerPopup selectedBranch={selectedBranch} existingManagers={existingManagers} existingSalesmen={existingSalesmen} />
                }
            </Popup>
        </Page>
    );
}
