import { useSidebar } from '@/context/SidebarContext'
import React from 'react'

interface IPage
{
    children?: React.ReactNode,
    className?: string
}

const Page: React.FC<IPage> = ({ children = "No Content", className }) =>
{
    const { isSidebarCollapsed } = useSidebar()
    return (
        <div className={`mt-26.5 mr-5 w-auto ${isSidebarCollapsed ? 'pl-20' : 'pl-38'} transition-all ${className}`}>
            {children}
        </div>
    )
}

export default Page