'use client'

import { useState } from 'react';
import BranchForm from '@/components/BranchForm/BranchForm';
import Button from '@/components/ui/Button/Button';
import Page from '@/components/ui/Page/Page';
import Popup from '@/components/ui/Popup/Popup';
import RowActions from '@/components/ui/RowActions/RowActions';
import Table, { Align, Column } from '@/components/ui/Table/Table';
import ViewBranchDetialsPopup from '@/components/ViewBranchDetailsPopup/ViewBranchDetialsPopup';
import { handleBranchAddAction, handleBranchDeleteAction, handleBranchEditAction } from '@/server/BranchFormHandlers';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Branch } from '@/schemas/BranchSchema';

export const dynamic = 'force-dynamic' // ✅ forces fresh fetch on refresh

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
}

export default function BranchesPageClient({ initialBranches }: Props)
{
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
                    showView
                    showEdit
                    showDelete
                />
            )
            ,
        },
    ];

    return (
        <Page>
            <div className='flex gap-5 items-center'>
                <h5>Branches</h5>
                <Button className='!rounded-full !p-0' onClick={() => setBranchAddPopup(true)}>
                    <Plus />
                </Button>
            </div>

            <Table<Branch> columns={columnsWithActions} data={branchesToDisplay} config={config} />

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
