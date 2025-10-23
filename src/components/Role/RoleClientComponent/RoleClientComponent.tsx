"use client"
import Button from '@/components/ui/Button/Button'
import Card from '@/components/ui/Card/Card'
import Page from '@/components/ui/Page/Page'
import Popup from '@/components/ui/Popup/Popup'
import RowActions from '@/components/ui/RowActions/RowActions'
import Table, { Align, Column } from '@/components/ui/Table/Table'
import { IRole } from '@/schemas/RoleSchema'
import { hasPermission } from '@/server/getUserSession'
import { Grid, List, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import RoleForm from '../RoleForm/RoleForm'
import { getRoles, handleRoleAddAction, handleRoleDeleteAction, handleRoleEditAction } from '@/server/RoleFormHandlers'
import ViewRoleDetialsPopup from '../ViewRoleDetailsPopup/ViewRoleDetialsPopup'
import { IPermission } from '@/schemas/PermissionSchema'

const RoleClientComponent = ({ initialRoles, permissions, initialTotal, allPerms }: { initialRoles: IRole[], permissions: string[], initialTotal: number, allPerms: IPermission[] }) =>
{
    const [displayType, setDisplayType] = useState<"list" | "grid">("list")
    const [roleAddPopup, setRoleAddPopup] = useState<boolean>(false)
    const [selectedRole, setSelectedRole] = useState<IRole | null>(null);
    const [viewRoleDetails, setViewRoleDetails] = useState<boolean>(false)
    const [roleEditPopup, setRoleEditPopup] = useState<boolean>(false)
    const [data, setData] = useState<IRole[]>([])
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [total, setTotal] = useState(initialTotal)

    const router = useRouter()

    useEffect(() =>
    {
        fetchRoles((page - 1) * rowsPerPage, rowsPerPage);
    }, [page, rowsPerPage]);

    if (initialRoles.length === 0)
    {
        return (
            <Page>
                <div className='flex justify-between items-center mb-6'>
                    <h5>Roles</h5>
                </div>

                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg font-medium">No Role found.</p>
                    <p className="text-sm mb-4">Click below to add first role.</p>
                    <Button onClick={() => setRoleAddPopup(true)}>Add Role</Button>
                </div>

                <Popup isOpen={roleAddPopup} onClose={() => { setRoleAddPopup(false); router.refresh() }}>
                    <RoleForm mode='add' onSubmitAction={handleRoleAddAction} allPerms={allPerms} />
                </Popup>
            </Page>
        )
    }

    const roleCols: Column<IRole>[] = [{
        key: 'id',
        label: "Id",
        sortable: true,
        align: Align.CENTER,
        headerStyle: { textAlign: Align.CENTER },
        bodyStyle: { textAlign: Align.CENTER },
    }, {
        key: 'title',
        label: "Title",
        sortable: true,
        align: Align.CENTER,
        headerStyle: { textAlign: Align.CENTER },
        bodyStyle: { textAlign: Align.CENTER },
    }]

    const columnsWithActions: Column<IRole>[] = [
        ...roleCols,
        {
            key: 'actions', // ✅ now allowed
            label: 'ACTIONS',
            align: Align.CENTER,
            render: (row) => (
                <RowActions
                    onView={() =>
                    {
                        const role = initialRoles.find((b: IRole) => b.id === row.id);
                        if (role) setSelectedRole(role);
                        setViewRoleDetails(true);
                    }}
                    onEdit={() =>
                    {
                        const role = initialRoles.find(b => b.id === row.id);
                        if (role) setSelectedRole(role);
                        setRoleEditPopup(true);
                    }}
                    onDelete={() => { if (row.id) handleDelete(row.id) }}
                    showView
                    ={hasPermission(permissions, "role:view")}
                    showEdit
                    // ={hasPermission(permissions, "role:update")}
                    showDelete
                    ={hasPermission(permissions, "role:delete")}
                />
            )
            ,
        },
    ];

    const handleDelete = async (id: number) =>
    {
        if (confirm(`Delete role ${id}?`))
        {
            const formData = new FormData();
            formData.append('roleId', id.toString());
            await handleRoleDeleteAction({}, formData);
            alert(`Role ${id} deleted successfully!`);
            router.refresh()
        }
    };

    async function fetchRoles(skip: number, take: number)
    {
        const perms = await getRoles(skip, take);
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
                        <h5>Roles</h5>
                        {
                            hasPermission(permissions, "role:create") ?
                                <Button className='!rounded-full !p-0' onClick={() => setRoleAddPopup(true)}>
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
                    <Table<IRole>
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
                            initialRoles.map(perm => (
                                <div key={perm.id}>{perm.title}</div>
                                // <RoleCard
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

            <Popup isOpen={roleAddPopup} onClose={() => { setRoleAddPopup(false); router.refresh(); }}>
                <div></div>
                <RoleForm mode='add' onSubmitAction={handleRoleAddAction} allPerms={allPerms} />
            </Popup>

            <Popup isOpen={roleEditPopup} onClose={() => { setRoleEditPopup(false); setSelectedRole(null); router.refresh(); }}>
                {selectedRole && (
                    <RoleForm mode='edit' initialData={selectedRole} onSubmitAction={handleRoleEditAction} allPerms={allPerms} />
                )}
            </Popup>

            <Popup isOpen={viewRoleDetails} onClose={() => setViewRoleDetails(false)}>
                {selectedRole && (
                    <ViewRoleDetialsPopup selectedRole={selectedRole} onClose={() => { setViewRoleDetails(false); setSelectedRole(null); }} />
                )}
            </Popup>
        </Page>
    )
}

export default RoleClientComponent