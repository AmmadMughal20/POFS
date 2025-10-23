import PermissionClientComponent from '@/components/Permission/PermissionClientComponent/PermissionClientComponent'
import { getUserSession } from '@/server/getUserSession'
import { getPermissions } from '@/server/PermissionFormHandlers'
import React from 'react'


const page = async () =>
{
    const { items, total } = await getPermissions(0, 50)
    const { permissions } = await getUserSession()

    return (
        <PermissionClientComponent initialPerms={items} permissions={permissions} initialTotal={total} />
    )
}

export default page