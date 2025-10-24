'use client'

import BranchForm from '@/components/Branch/BranchForm/BranchForm';
import ViewBranchDetialsPopup from '@/components/Branch/ViewBranchDetailsPopup/ViewBranchDetialsPopup';
import Button from '@/components/ui/Button/Button';
import Page from '@/components/ui/Page/Page';
import Popup from '@/components/ui/Popup/Popup';
import RowActions from '@/components/ui/RowActions/RowActions';
import Table, { Align, Column } from '@/components/ui/Table/Table';
import { Branch } from '@/schemas/BranchSchema';
import { handleBranchAddAction, handleBranchDeleteAction, handleBranchEditAction } from '@/server/BranchFormHandlers';
import { hasPermission } from '@/server/getUserSession';
import { Grid, List, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import BranchCard from '../BranchCard/BranchCard';
import Card from '@/components/ui/Card/Card';

// export const dynamic = 'force-dynamic' // ✅ forces fresh fetch on refresh

const config = {
    enableSearch: true,
    enablePagination: true,
    defaultRowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 15, 20],
    alternateRowColors: true,
};


interface Props
{
    initialBranches: Branch[];
    permissions: string[];
    initialTotal: number
}

export default function BranchesPageClient({ initialBranches, permissions, initialTotal }: Props)
{

    const [data, setData] = useState<Branch[]>(initialBranches)
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [total, setTotal] = useState(initialTotal)
    const branches = initialBranches;
    const branchesToDisplay = branches.map(branch =>
    {
        return {
            ...branch,
            openingTimeToDisplay: branch.openingTime.toString().substring(16, 21)
        }
    })
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
    const [branchAddPopup, setBranchAddPopup] = useState(false);
    const [branchEditPopup, setBranchEditPopup] = useState(false);
    const [viewBranchDetails, setViewBranchDetails] = useState(false);
    const [displayType, setDisplayType] = useState<'list' | 'grid'>('list')
    const router = useRouter()

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
                    <BranchForm mode='add' onSubmitAction={handleBranchAddAction} />
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

    const branchCols: Column<Branch>[] = Object.keys(branches[0] as Branch)
        .map((key) =>
        {
            return {
                key: key as keyof Branch,
                label: key.toUpperCase(),
                sortable: true,
                align: Align.CENTER,
                headerStyle: { textAlign: Align.CENTER },
                bodyStyle: { textAlign: Align.CENTER },
            };
        })
        .sort((a, b) =>
        {
            if (a.key === 'id') return -1;
            if (b.key === 'id') return 1;
            return a.key.localeCompare(b.key);
        });

    const filteredBranchCols = branchCols.filter(
        col => col.key !== "openingTime" && col.key !== "closingTime"
    );

    const columnsWithActions: Column<Branch>[] = [
        ...filteredBranchCols,
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
                        const branch = branches.find((b: Branch) => b.id === row.id);
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
                    <Table<Branch>
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
                                />
                            ))
                        }
                    </div>
                }
            </div>

            <Popup isOpen={branchAddPopup} onClose={() => { setBranchAddPopup(false); router.refresh(); }}>
                <BranchForm mode='add' onSubmitAction={handleBranchAddAction} />
            </Popup>

            <Popup isOpen={branchEditPopup} onClose={() => { setBranchEditPopup(false); setSelectedBranch(null); router.refresh(); }}>
                {selectedBranch && (
                    <BranchForm mode='edit' initialData={selectedBranch} onSubmitAction={handleBranchEditAction} />
                )}
            </Popup>

            <Popup isOpen={viewBranchDetails} onClose={() => setViewBranchDetails(false)}>
                {selectedBranch && (
                    <ViewBranchDetialsPopup selectedBranch={selectedBranch} onClose={() => { setViewBranchDetails(false); setSelectedBranch(null); }} />
                )}
            </Popup>
        </Page>
    );
}
