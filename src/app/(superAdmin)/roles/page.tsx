import RoleClientComponent from '@/components/Role/RoleClientComponent/RoleClientComponent'
import { getUserSession } from '@/server/getUserSession'
import { getPermissions } from '@/server/PermissionFormHandlers'
import { getRoles } from '@/server/RoleFormHandlers'
import React from 'react'


const page = async () =>
{
    const { items, total } = await getRoles(0, 50)
    const { permissions } = await getUserSession()

    const allPerms = await getPermissions()
    const permList = allPerms.items

    return (
        <RoleClientComponent initialRoles={items} permissions={permissions} initialTotal={total} allPerms={permList} />
    )
}

export default page