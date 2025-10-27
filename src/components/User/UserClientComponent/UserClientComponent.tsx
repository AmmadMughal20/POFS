'use client'

import UserForm from '@/components/User/UserForm/UserForm';
import ViewUserDetialsPopup from '@/components/User/ViewUserDetailsPopup/ViewUserDetialsPopup';
import Button from '@/components/ui/Button/Button';
import Page from '@/components/ui/Page/Page';
import Popup from '@/components/ui/Popup/Popup';
import RowActions from '@/components/ui/RowActions/RowActions';
import Table, { Align, Column } from '@/components/ui/Table/Table';
import { IUser } from '@/schemas/UserSchema';
import { handleUserAddAction, handleUserDeleteAction, handleUserEditAction } from '@/server/UserFormHandlers';
import { hasPermission } from '@/server/getUserSession';
import { Grid, List, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import UserCard from '../UserCard/UserCard';
import Card from '@/components/ui/Card/Card';
import { IRole } from '@/schemas/RoleSchema';

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
    initialUsers: IUser[];
    permissions: string[];
    initialTotal: number,
    roles: IRole[]
}

export default function UsersPageClient({ initialUsers, permissions, initialTotal, roles }: Props)
{
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [total, setTotal] = useState(initialTotal)
    const users = initialUsers;
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [userAddPopup, setUserAddPopup] = useState(false);
    const [userEditPopup, setUserEditPopup] = useState(false);
    const [viewUserDetails, setViewUserDetails] = useState(false);
    const [displayType, setDisplayType] = useState<'list' | 'grid'>('list')
    const router = useRouter()

    if (users.length === 0)
    {
        return (
            <Page>
                <div className='flex justify-between items-center mb-6'>
                    <h5>Users</h5>
                </div>

                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg font-medium">No users found.</p>
                    <p className="text-sm mb-4">Click below to add your first user.</p>
                    <Button onClick={() => setUserAddPopup(true)}>Add User</Button>
                </div>

                <Popup isOpen={userAddPopup} onClose={() => { setUserAddPopup(false); router.refresh() }}>
                    <UserForm mode='add' onSubmitAction={handleUserAddAction} roles={roles} />
                </Popup>
            </Page>
        )
    }

    const handleDelete = async (id: string) =>
    {
        if (confirm(`Delete user ${id}?`))
        {
            const formData = new FormData();
            formData.append('userId', id);
            await handleUserDeleteAction({}, formData);
            alert(`User ${id} deleted successfully!`);
            router.refresh()
        }
    };

    const userCols: Column<IUser>[] = [{
        key: 'id',
        label: 'Id',
        align: Align.CENTER,
        sortable: true,
    },
    {
        key: 'name',
        label: 'Name',
        align: Align.CENTER,
        sortable: true,
    },
    {
        key: 'phoneNo',
        label: 'Phone No',
        align: Align.CENTER,
        sortable: true,
    },
    {
        key: 'email',
        label: 'Email',
        align: Align.CENTER,
        sortable: true,
    },
    {
        key: 'status',
        label: 'Status',
        align: Align.CENTER,
        sortable: true,
    },
    ]


    const columnsWithActions: Column<IUser>[] = [
        ...userCols,
        {
            key: 'roleId',
            label: 'Role ',
            align: Align.CENTER,
            sortable: true,
            render: (row: IUser) => (
                <p>{row.Role?.title}</p>
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
                        const user = users.find((b: IUser) => b.id === row.id);
                        if (user) setSelectedUser(user);
                        setViewUserDetails(true);
                    }}
                    onEdit={() =>
                    {
                        const user = users.find(b => b.id === row.id);
                        if (user) setSelectedUser(user);
                        setUserEditPopup(true);
                    }}
                    onDelete={() => handleDelete(row.id?.toString() ?? '')}
                    showView={hasPermission(permissions, "user:view")}
                    showEdit={hasPermission(permissions, "user:update")}
                    showDelete={hasPermission(permissions, "user:delete")}
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
                        <h5>Users</h5>
                        {
                            hasPermission(permissions, "user:create") ?
                                <Button className='!rounded-full !p-0' onClick={() => setUserAddPopup(true)}>
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
                    <Table<IUser>
                        columns={columnsWithActions}
                        data={initialUsers}
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
                            users.map(user => (
                                <UserCard
                                    key={user.id}
                                    id={user.id}
                                    email={user.email}
                                    phoneNo={user.phoneNo}
                                    roleId={user.roleId}
                                    name={user.name}
                                    status={user.status}
                                />
                            ))
                        }
                    </div>
                }
            </div>

            <Popup isOpen={userAddPopup} onClose={() => { setUserAddPopup(false); router.refresh(); }}>
                <UserForm mode='add' onSubmitAction={handleUserAddAction} roles={roles} />
            </Popup>

            <Popup isOpen={userEditPopup} onClose={() => { setUserEditPopup(false); setSelectedUser(null); router.refresh(); }}>
                {selectedUser && (
                    <UserForm mode='edit' initialData={selectedUser} onSubmitAction={handleUserEditAction} roles={roles} />
                )}
            </Popup>

            <Popup isOpen={viewUserDetails} onClose={() => setViewUserDetails(false)}>
                {selectedUser && (
                    <ViewUserDetialsPopup selectedUser={selectedUser} onClose={() => { setViewUserDetails(false); setSelectedUser(null); }} />
                )}
            </Popup>
        </Page>
    );
}
