"use client"
import Button from '@/components/ui/Button/Button'
import Card from '@/components/ui/Card/Card'
import Page from '@/components/ui/Page/Page'
import Popup from '@/components/ui/Popup/Popup'
import RowActions from '@/components/ui/RowActions/RowActions'
import Table, { Align, Column } from '@/components/ui/Table/Table'
import { IPermission } from '@/schemas/PermissionSchema'
import { hasPermission } from '@/server/getUserSession'
import { Grid, List, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import PermissionForm from '../PermissionForm/PermissionForm'
import { getPermissions, handlePermissionAddAction, handlePermissionDeleteAction, handlePermissionEditAction } from '@/server/PermissionFormHandlers'

const PermissionClientComponent = ({ initialPerms, permissions, initialTotal }: { initialPerms: IPermission[], permissions: string[], initialTotal: number }) =>
{
    const [displayType, setDisplayType] = useState<"list" | "grid">("list")
    const [permissionAddPopup, setPermissionAddPopup] = useState<boolean>(false)
    const [selectedPermission, setSelectedPermission] = useState<IPermission | null>(null);
    const [viewPermissionDetails, setViewPermissionDetails] = useState<boolean>(false)
    const [permissionEditPopup, setPermissionEditPopup] = useState<boolean>(false)
    const [data, setData] = useState<IPermission[]>([])
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [total, setTotal] = useState(initialTotal)

    const router = useRouter()

    useEffect(() =>
    {
        fetchPermissions((page - 1) * rowsPerPage, rowsPerPage);
    }, [page, rowsPerPage]);

    if (initialPerms.length === 0)
    {
        return (
            <Page>
                <div className='flex justify-between items-center mb-6'>
                    <h5>Permissions</h5>
                </div>

                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg font-medium">No Permission found.</p>
                    <p className="text-sm mb-4">Click below to add first permission.</p>
                    <Button onClick={() => setPermissionAddPopup(true)}>Add Permission</Button>
                </div>

                <Popup isOpen={permissionAddPopup} onClose={() => { setPermissionAddPopup(false); router.refresh() }}>
                    <PermissionForm mode='add' onSubmitAction={handlePermissionAddAction} />
                </Popup>
            </Page>
        )
    }

    const permCols: Column<IPermission>[] = [{
        key: 'id',
        label: "Id",
        sortable: true,
        align: Align.CENTER,
        headerStyle: { textAlign: Align.CENTER },
        bodyStyle: { textAlign: Align.CENTER },
    }, {
        key: 'title',
        label: 'Title',
        sortable: true,
        align: Align.CENTER,
        headerStyle: { textAlign: Align.CENTER },
        bodyStyle: { textAlign: Align.CENTER },
    }, {
        key: 'code',
        label: 'Code',
        sortable: true,
        align: Align.CENTER,
        headerStyle: { textAlign: Align.CENTER },
        bodyStyle: { textAlign: Align.CENTER },
    }, {
        key: 'description',
        label: 'Description',
        sortable: true,
        align: Align.CENTER,
        headerStyle: { textAlign: Align.CENTER },
        bodyStyle: { textAlign: Align.CENTER },
    }]

    const columnsWithActions: Column<IPermission, string>[] = [
        ...permCols,
        {
            key: 'actions', // ✅ now allowed
            label: 'ACTIONS',
            align: Align.CENTER,
            render: (row) => (
                <RowActions
                    onView={() =>
                    {
                        const perm = data.find((b: IPermission) => b.id === row.id);
                        if (perm) setSelectedPermission(perm);
                        setViewPermissionDetails(true);
                    }}
                    onEdit={() =>
                    {
                        const perm = data.find(b => b.id === row.id);
                        if (perm) setSelectedPermission(perm);
                        setPermissionEditPopup(true);
                    }}
                    onDelete={() => { if (row.id) handleDelete(typeof row.id === "string" ? parseInt(row.id) : row.id) }}
                    showView
                    ={hasPermission(permissions, "permission:view")}
                    showEdit
                    ={hasPermission(permissions, "permission:update")}
                    showDelete
                    ={hasPermission(permissions, "permission:delete")}
                />
            )
            ,
        },
    ];

    const handleDelete = async (id: number) =>
    {
        if (confirm(`Delete permission ${id}?`))
        {
            const formData = new FormData();
            formData.append('permId', id.toString());
            await handlePermissionDeleteAction({}, formData);
            alert(`Permission ${id} deleted successfully!`);
            router.refresh()
        }
    };

    async function fetchPermissions(skip: number, take: number)
    {
        const perms = await getPermissions(skip, take);
        setData(perms.items);
        setTotal(perms.total)
    }

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
                        <h5>Permissions</h5>
                        {
                            hasPermission(permissions, "permission:create") ?
                                <Button className='!rounded-full !p-0' onClick={() => setPermissionAddPopup(true)}>
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
                    <Table<IPermission, string>
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
                            data.map(perm => (
                                <div key={perm.id}>{perm.title}</div>
                                // <BranchCard
                                //     key={branch.id}
                                //     id={branch.id}
                                //     phoneNo={branch.phoneNo}
                                //     area={branch.area}
                                //     address={branch.address}
                                //     city={branch.city}
                                //     openingTime={branch.openingTime}
                                //     closingTime={branch.closingTime}
                                //     status={branch.status}
                                // />
                            ))
                        }
                    </div>
                }
            </div>

            <Popup isOpen={permissionAddPopup} onClose={() => { setPermissionAddPopup(false); router.refresh(); }}>
                <div></div>
                <PermissionForm mode='add' onSubmitAction={handlePermissionAddAction} />
            </Popup>

            <Popup isOpen={permissionEditPopup} onClose={() => { setPermissionEditPopup(false); setSelectedPermission(null); router.refresh(); }}>
                {selectedPermission && (
                    <PermissionForm mode='edit' initialData={selectedPermission} onSubmitAction={handlePermissionEditAction} />
                )}
            </Popup>

            <Popup isOpen={viewPermissionDetails} onClose={() => setViewPermissionDetails(false)}>
                {selectedPermission && (
                    <div></div>
                    // <ViewBranchDetialsPopup selectedBranch={selectedBranch} onClose={() => { setViewBranchDetails(false); setSelectedBranch(null); }} />
                )}
            </Popup>
        </Page>
    )
}

export default PermissionClientComponent