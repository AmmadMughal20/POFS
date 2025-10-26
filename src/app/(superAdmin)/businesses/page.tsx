import BusinessClientComponent from '@/components/Business/BusinessClientComponent/BusinessClientComponent'
import { getUserSession } from '@/server/getUserSession'
import { getBusinesses } from '@/server/BusinessFormHandlers'
import React from 'react'


const page = async () =>
{
    const { items, total } = await getBusinesses(0, 50)
    const { permissions } = await getUserSession()

    return (
        <BusinessClientComponent initialBusinesses={items} permissions={permissions} initialTotal={total} />
    )
}

export default page