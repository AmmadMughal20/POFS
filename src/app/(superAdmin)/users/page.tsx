import UserClientComponent from '@/components/User/UserClientComponent/UserClientComponent'
import { getUserSession } from '@/server/getUserSession'
import { getRoles } from '@/server/RoleFormHandlers'
import { getUsers } from '@/server/UserFormHandlers'
import React from 'react'


const page = async () =>
{
    const { items, total } = await getUsers(0, 50)
    const { permissions } = await getUserSession()
    const { items: roles } = await getRoles()

    return (
        <UserClientComponent initialUsers={items} permissions={permissions} initialTotal={total} roles={roles} />
    )
}

export default page