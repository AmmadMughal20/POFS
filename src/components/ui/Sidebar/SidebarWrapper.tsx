"use client"
import React, { useState } from 'react'
import Sidebar from './Sidebar'
import SidebarMenuItem, { ISidebarMenuItem } from '../SidebarMenuItem/SidebarMenuItem'
import { ArrowLeft, ArrowRight, Globe, Home, LogOut, MenuIcon, Phone, Settings } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '../Button/Button'

export const sidebarMenuItems: ISidebarMenuItem[] = [
    {
        title: 'Home',
        link: '/',
        icon: <Home />,
        selected: true,
    },
    {
        title: 'About Us',
        link: '/',
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
    collapsed: boolean,
    variant?: 'primary'
}

const SidebarWrapper: React.FC<ISidebarWrapper> = ({ collapsed, variant }) =>
{

    const [collapsedSideBar, setCollapsedSideBar] = useState<boolean>(collapsed)


    const handleSideBarCollapse = () =>
    {
        setCollapsedSideBar(collapsedSideBar ? false : true)
    }

    return (
        <Sidebar isCollapsed={collapsedSideBar} variant={variant}>
            <div className='flex flex-col items-center justify-between'>
                <Link href="/">
                    <Image src={"globe.svg"} width={1000} height={1000} className='max-w-10 max-h-10' alt="logo" />
                </Link>
            </div>
            <div className='flex flex-col items-center justify-between'>
                <Button onClick={handleSideBarCollapse} variant='secondary' className={`!rounded-full absolute w-10 h-10 flex justify-center items-center ${collapsedSideBar ? 'left-15 top-16' : 'left-25 top-16'}`}>
                    {collapsedSideBar ? <ArrowRight /> : <ArrowLeft />}
                </Button>
            </div>
            <hr className='my-2 text-primary mb-6' />
            {
                sidebarMenuItems.map((item, index) => (
                    <SidebarMenuItem key={index} title={item.title} link={item.link} icon={item.icon} selected={item.selected} />
                ))
            }
        </Sidebar>
    )
}

export default SidebarWrapper