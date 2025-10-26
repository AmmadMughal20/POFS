"use client"
import logo from '@/assets/images/pofs_logo.svg'
import logoOrg from '@/assets/images/pos_logo_org.svg'
import { useSidebar } from '@/context/SidebarContext'
import { ArrowLeft, ArrowRight, BriefcaseBusiness, GitGraph, Globe, LayoutDashboard, LockKeyhole, LogOut, PersonStanding, ShoppingCart, Star, User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import Button from '../Button/Button'
import SidebarMenuItem, { ISidebarMenuItem } from '../SidebarMenuItem/SidebarMenuItem'
import Topbar from '../Topbar/Topbar'
import Sidebar from './Sidebar'

export const sidebarMenuItems: ISidebarMenuItem[] = [
    {
        title: 'Dashboard',
        link: '/',
        icon: <LayoutDashboard />,
        selected: false,
        permission: 'dashboard:view'
    },
    {
        title: 'Permissions',
        link: '/permissions',
        icon: <LockKeyhole />,
        selected: false,
        permission: 'permission:view'
    },
    {
        title: 'Roles',
        link: '/roles',
        icon: <PersonStanding />,
        selected: false,
        permission: 'role:view'
    },
    {
        title: 'Users',
        link: '/users',
        icon: <User />,
        selected: false,
        permission: 'user:view'
    },
    {
        title: 'Businesses',
        link: '/businesses',
        icon: <BriefcaseBusiness />,
        selected: false,
        permission: 'business:view'
    },
    {
        title: 'Products',
        link: '/products',
        icon: <Star />,
        selected: false,
        permission: 'product:view'
    },

    {
        title: 'Branches',
        link: '/branch-management',
        icon: <Globe />,
        selected: false,
        permission: 'branch:view'
    },
    {
        title: 'Orders',
        link: '/orders',
        icon: <ShoppingCart />,
        selected: false,
        permission: 'order:view'
    },
    {
        title: 'Stocks',
        link: '/stocks',
        icon: <GitGraph />,
        selected: false,
        permission: 'stock:view'
    },
    {
        title: 'Logout',
        link: '/logout',
        icon: <LogOut />,
        selected: false,
    }
]

interface ISidebarWrapper
{
    variant?: 'primary'
}

const SidebarWrapper: React.FC<ISidebarWrapper> = ({ variant }) =>
{
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    const { status } = useSession()
    const pathName = usePathname()
    const { data: session } = useSession();
    const userPermissions = session?.user?.permissions || [];

    if (status != "authenticated") return

    const sideMenuItemsWithSelected = sidebarMenuItems
        .filter(item => !item.permission || userPermissions.includes(item.permission))
        .map(item => ({
            ...item,
            selected: item.link === pathName,
        }));

    return (
        <>
            <Topbar collapsed={isSidebarCollapsed ?? false} />
            <Sidebar isCollapsed={isSidebarCollapsed} variant={variant} className={` ${isSidebarCollapsed ? 'bg-white' : 'bg-primary'} transition-colors`}>
                <div className='flex flex-col items-center justify-between'>
                    <Link href="/">
                        <Image src={isSidebarCollapsed ? logo : logoOrg} width={1000} height={1000} className={`${isSidebarCollapsed ? 'max-w-10 max-h-10' : "max-w-20 max-h-20"} transition-all`} alt="logo" />
                    </Link>
                </div>
                <hr className={`my-1 ${isSidebarCollapsed ? 'text-primary/50' : 'text-gray-300'}`} />
                <div className='flex flex-col items-center justify-between' onClick={toggleSidebar}>
                    <Button className={`!rounded-full w-7.5 h-7.5 !p-0 flex justify-center items-center !bg-accent !shadow-accent`}>
                        {isSidebarCollapsed ? <ArrowRight /> : <ArrowLeft />}
                    </Button>
                </div>
                <hr className={`my-1 ${isSidebarCollapsed ? 'text-primary/50' : 'text-gray-300'}`} />
                <div className={`h-100 overflow-scroll scrollbar-hide flex flex-col gap-2`}>
                    {
                        sideMenuItemsWithSelected.map((item, index) => (
                            <SidebarMenuItem key={index} title={item.title} variant={isSidebarCollapsed ? undefined : variant} link={item.link} icon={item.icon} selected={item.selected} />
                        ))
                    }
                </div>
            </Sidebar>
        </>
    )
}

export default SidebarWrapper