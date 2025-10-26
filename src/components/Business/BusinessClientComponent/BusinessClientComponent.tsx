'use client'

import BusinessForm from '@/components/Business/BusinessForm/BusinessForm';
import ViewBusinessDetialsPopup from '@/components/Business/ViewBusinessDetailsPopup/ViewBusinessDetialsPopup';
import Button from '@/components/ui/Button/Button';
import Page from '@/components/ui/Page/Page';
import Popup from '@/components/ui/Popup/Popup';
import RowActions from '@/components/ui/RowActions/RowActions';
import Table, { Align, Column } from '@/components/ui/Table/Table';
import { IBusiness } from '@/schemas/BusinessSchema';
import { handleBusinessAddAction, handleBusinessDeleteAction, handleBusinessEditAction } from '@/server/BusinessFormHandlers';
import { hasPermission } from '@/server/getUserSession';
import { Grid, List, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import BusinessCard from '../BusinessCard/BusinessCard';
import Card from '@/components/ui/Card/Card';
import BranchForm from '@/components/Branch/BranchForm/BranchForm';
import { handleBranchAddAction } from '@/server/BranchFormHandlers';

interface Props
{
    initialBusinesses: IBusiness[];
    permissions: string[];
    initialTotal: number
}

export default function BusinessClientComponent({ initialBusinesses, permissions, initialTotal }: Props)
{

    const [data, setData] = useState<IBusiness[]>(initialBusinesses)
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [total, setTotal] = useState(initialTotal)
    const businesses = initialBusinesses;
    const [selectedBusiness, setSelectedBusiness] = useState<IBusiness | null>(null);
    const [businessAddPopup, setBusinessAddPopup] = useState(false);
    const [businessEditPopup, setBusinessEditPopup] = useState(false);
    const [viewBusinessDetails, setViewBusinessDetails] = useState(false);
    const [displayType, setDisplayType] = useState<'list' | 'grid'>('list')
    const router = useRouter()

    const [showAddBranchPopup, setShowAddBranchPopup] = useState(false)

    if (businesses.length === 0)
    {
        return (
            <Page>
                <div className='flex justify-between items-center mb-6'>
                    <h5>Businesses</h5>
                </div>

                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg font-medium">No businesses found.</p>
                    <p className="text-sm mb-4">Click below to add your first business.</p>
                    <Button onClick={() => setBusinessAddPopup(true)}>Add Business</Button>
                </div>

                <Popup isOpen={businessAddPopup} onClose={() => { setBusinessAddPopup(false); router.refresh() }}>
                    <BusinessForm mode='add' onSubmitAction={handleBusinessAddAction} />
                </Popup>
            </Page>
        )
    }

    const handleDelete = async (id: string) =>
    {
        if (confirm(`Delete business ${id}?`))
        {
            const formData = new FormData();
            formData.append('businessId', id);
            await handleBusinessDeleteAction({}, formData);
            alert(`Business ${id} deleted successfully!`);
            router.refresh()
        }
    };

    const businessCols: Column<IBusiness>[] = [{
        key: 'id',
        label: "Id",
        sortable: true,
        align: Align.CENTER,
    }, {
        key: "name",
        label: "Name",
        sortable: true,
        align: Align.CENTER,
    }, {
        key: "type",
        label: "Type",
        sortable: true,
        align: Align.CENTER,
    },
    ];

    const columnsWithActions: Column<IBusiness>[] = [
        ...businessCols,
        {
            key: 'actions', // ✅ now allowed
            label: 'ACTIONS',
            align: Align.CENTER,
            render: (row) => (
                <RowActions
                    onView={() =>
                    {
                        const business = businesses.find((b: IBusiness) => b.id === row.id);
                        if (business) setSelectedBusiness(business);
                        setViewBusinessDetails(true);
                    }}
                    onEdit={() =>
                    {
                        const business = businesses.find(b => b.id === row.id);
                        if (business) setSelectedBusiness(business);
                        setBusinessEditPopup(true);
                    }}
                    onDelete={() => handleDelete(row.id)}
                    showView={hasPermission(permissions, "business:view")}
                    showEdit={hasPermission(permissions, "business:update")}
                    showDelete={hasPermission(permissions, "business:delete")}

                    onAddChild={() =>
                    {
                        const business = businesses.find(b => b.id === row.id);
                        if (business) setSelectedBusiness(business); setShowAddBranchPopup(true)
                    }}
                    showAddChild={hasPermission(permissions, 'branch:create')}
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
                        <h5>Businesses</h5>
                        {
                            hasPermission(permissions, "business:create") ?
                                <Button className='!rounded-full !p-0' onClick={() => setBusinessAddPopup(true)}>
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
                    <Table<IBusiness>
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
                            businesses.map(business => (
                                <BusinessCard
                                    key={business.id}
                                    id={business.id}
                                    name={business.name}
                                    type={business.type}
                                    ownerId={business.ownerId}
                                    status={business.status}
                                    description={business.description}
                                    email={business.email}
                                    phone={business.phone}
                                    website={business.website}
                                    address={business.address}
                                    city={business.city}
                                    province={business.province}
                                    country={business.country}
                                    logoUrl={business.logoUrl}
                                    coverImageUrl={business.coverImageUrl}
                                    establishedYear={business.establishedYear}
                                    isVerified={business.isVerified}
                                    createdBy={business.createdBy}
                                    createdAt={business.createdAt}
                                    updatedBy={business.updatedBy}
                                    updatedAt={business.updatedAt}
                                />
                            ))
                        }
                    </div>
                }
            </div>

            <Popup isOpen={businessAddPopup} onClose={() => { setBusinessAddPopup(false); router.refresh(); }}>
                <BusinessForm mode='add' onSubmitAction={handleBusinessAddAction} />
            </Popup>

            <Popup isOpen={businessEditPopup} onClose={() => { setBusinessEditPopup(false); setSelectedBusiness(null); router.refresh(); }}>
                {selectedBusiness && (
                    <BusinessForm mode='edit' initialData={selectedBusiness} onSubmitAction={handleBusinessEditAction} />
                )}
            </Popup>

            <Popup isOpen={viewBusinessDetails} onClose={() => setViewBusinessDetails(false)}>
                {selectedBusiness && (
                    <ViewBusinessDetialsPopup selectedBusiness={selectedBusiness} onClose={() => { setViewBusinessDetails(false); setSelectedBusiness(null); }} />
                )}
            </Popup>

            <Popup isOpen={showAddBranchPopup} onClose={() => setShowAddBranchPopup(false)}>
                {
                    selectedBusiness &&
                    <BranchForm mode='add' onSubmitAction={handleBranchAddAction} businessId={selectedBusiness.id} />
                }
            </Popup>
        </Page>
    );
}
