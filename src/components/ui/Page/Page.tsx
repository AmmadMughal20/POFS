import { useSidebar } from '@/context/SidebarContext'
import React from 'react'

interface IPage
{
    children?: React.ReactNode
}

const Page: React.FC<IPage> = ({ children = "No Content" }) =>
{
    const { isSidebarCollapsed } = useSidebar()
    return (
        <div className={`mt-17.5 mr-5 w-auto ${isSidebarCollapsed ? 'pl-25' : 'pl-38'} transition-all `}>
            {children}
        </div>
    )
}

export default Page