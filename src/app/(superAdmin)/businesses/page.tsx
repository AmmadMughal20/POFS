import BusinessClientComponent from '@/components/Business/BusinessClientComponent/BusinessClientComponent'
import { getUserSession } from '@/server/getUserSession'
import { getBusinesses } from '@/server/BusinessFormHandlers'
import React from 'react'
import { getUsers } from '@/server/UserFormHandlers'


const page = async () =>
{
    const { items, total } = await getBusinesses(0, 50)
    const { permissions } = await getUserSession()
    const { items: ownersToSuggest, total: totalUsers } = await getUsers(undefined, undefined, undefined, { roleId: 5 })

    console.log(ownersToSuggest, 'printing in page')

    return (
        <BusinessClientComponent initialBusinesses={items} permissions={permissions} initialTotal={total} ownersToSuggest={ownersToSuggest} />
    )
}

export default page