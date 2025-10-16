"use client"
import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import SidebarMenuItem, { ISidebarMenuItem } from '../SidebarMenuItem/SidebarMenuItem'
import { ArrowLeft, ArrowRight, Globe, Home, LogOut, MenuIcon, Phone, Settings } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '../Button/Button'
import Topbar from '../Topbar/Topbar'
import { useSidebar } from '@/context/SidebarContext'

export const sidebarMenuItems: ISidebarMenuItem[] = [
    {
        title: 'Home',
        link: '/',
        icon: <Home />,
        selected: true,
    },
    {
        title: 'Branches',
        link: '/branch-management',
        icon: <Globe />,
        selected: false,
    },
    {
        title: 'Contact',
        link: '/',
        icon: <Phone />,
        selected: false,
    },
    {
        title: 'Settings',
        link: '/',
        icon: <Settings />,
        selected: false,
    },
    {
        title: 'Logout',
        link: '/',
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

    return (
        <>
            <Topbar collapsed={isSidebarCollapsed ?? false} />
            <Sidebar isCollapsed={isSidebarCollapsed} variant={variant} className={` ${isSidebarCollapsed ? 'bg-white' : 'bg-primary'} transition-colors`}>
                <div className='flex flex-col items-center justify-between'>
                    <Link href="/">
                        <Image src={"globe.svg"} width={1000} height={1000} className='max-w-7.5 max-h-7.5' alt="logo" />
                    </Link>
                </div>
                <hr className={`my-1 ${isSidebarCollapsed ? 'text-primary/50' : 'text-gray-300'}`} />
                <div className='flex flex-col items-center justify-between' onClick={toggleSidebar}>
                    <Button className={`!rounded-full w-7.5 h-7.5 !p-0 flex justify-center items-center !bg-accent !shadow-accent`}>
                        {isSidebarCollapsed ? <ArrowRight /> : <ArrowLeft />}
                    </Button>
                </div>
                <hr className={`my-1 ${isSidebarCollapsed ? 'text-primary/50' : 'text-gray-300'}`} />
                <div className={`h-100 overflow-scroll scrollbar-hide`}>
                    {
                        sidebarMenuItems.map((item, index) => (
                            <SidebarMenuItem key={index} title={item.title} variant={isSidebarCollapsed ? undefined : variant} link={item.link} icon={item.icon} selected={item.selected} />
                        ))
                    }
                </div>
            </Sidebar>
        </>
    )
}

export default SidebarWrapper