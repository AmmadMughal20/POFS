"use client"
import logo from '@/assets/images/pofs_logo.svg'
import logoOrg from '@/assets/images/pos_logo_org.svg'
import { useSidebar } from '@/context/SidebarContext'
import { ArrowLeft, ArrowRight, BanknoteArrowDown, BanknoteArrowUp, BriefcaseBusiness, Cable, DollarSign, DollarSignIcon, GitGraph, Globe, IdCard, IdCardLanyard, LayoutDashboard, LockKeyhole, LogOut, Outdent, PersonStanding, Shapes, ShoppingBasket, ShoppingCart, Star, Store, User, User2 } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import Button from '../Button/Button'
import SidebarMenuItem, { ISidebarMenuItem } from '../SidebarMenuItem/SidebarMenuItem'
import Topbar from '../Topbar/Topbar'
import Sidebar from './Sidebar'



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
    const userRoleId = session?.user.roleId
    const userBusinessId = session?.user.businessId
    const userBranchId = session?.user.branchId

    const getDashboardUrl = (roleId?: string | undefined) =>
    {
        if (roleId)
        {
            switch (roleId)
            {
                case '4':
                    return '/dashboard';
                case '5':
                    return `/admin/${userBusinessId}/dashboard`;
                case "6":
                    return `/branch/${userBranchId}/dashboard`;
                default:
                    return '/dashboard'
            }
        } else
        {
            return "/dashboard"
        }
    }

    if (status != "authenticated") return

    const getSideBarMenuItems = (roleId?: string) =>
    {
        if (roleId)
        {
            switch (roleId)
            {
                case '4':
                    return superAdminSidebarMenuItems;
                case '5':
                    return adminSidebarMenuItems;
                case '6':
                    return branchManagerSidebarMenuItems;
                default:
                    return branchManagerSidebarMenuItems;
            }
        } else
        {
            return emptyMenu
        }
    }

    const superAdminSidebarMenuItems: ISidebarMenuItem[] = [{
        title: 'Dashboard',
        link: getDashboardUrl(userRoleId),
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
        title: 'Logout',
        link: () => signOut(),
        icon: <LogOut />,
        selected: false,
    }
    ]
    const adminSidebarMenuItems: ISidebarMenuItem[] = [
        {
            title: 'Dashboard',
            link: getDashboardUrl(userRoleId),
            icon: <LayoutDashboard />,
            selected: false,
            permission: 'dashboard:view'
        }, {
            title: 'Branches',
            link: `/admin/${userBusinessId}/branches`,
            icon: <Store />,
            selected: false,
            permission: 'branch:view'
        }, {
            title: 'Managers',
            link: `/admin/${userBusinessId}/managers`,
            icon: <IdCard />,
            selected: false,
            permission: 'manager:view'
        }, {
            title: 'Categories',
            link: `/admin/${userBusinessId}/categories`,
            icon: <Shapes />,
            selected: false,
            permission: 'category:view'
        }, {
            title: 'Suppliers',
            link: `/admin/${userBusinessId}/suppliers`,
            icon: <Cable />,
            selected: false,
            permission: 'supplier:view'
        }, {
            title: 'Products',
            link: `/admin/${userBusinessId}/products`,
            icon: <Star />,
            selected: false,
            permission: 'product:view'
        }, {
            title: 'Orders',
            link: `/admin/${userBusinessId}/orders`,
            icon: <ShoppingCart />,
            selected: false,
            permission: 'order:view'
        }, {
            title: 'Salesmen',
            link: `/admin/${userBusinessId}/salesmen`,
            icon: <IdCardLanyard />,
            selected: false,
            permission: 'salesman:view'
        }, {
            title: 'Expenses',
            link: `/admin/${userBusinessId}/Expenses`,
            icon: <DollarSign />,
            selected: false,
            permission: 'expense:view'
        }, {
            title: 'Purchases',
            link: `/admin/${userBusinessId}/Purchases`,
            icon: <ShoppingBasket />,
            selected: false,
            permission: 'purchase:view'
        },
        {
            title: 'Logout',
            link: () => signOut(),
            icon: <LogOut />,
            selected: false,
        }
    ]
    const branchManagerSidebarMenuItems: ISidebarMenuItem[] = [
        {
            title: 'Dashboard',
            link: getDashboardUrl(userRoleId),
            icon: <LayoutDashboard />,
            selected: false,
            permission: 'dashboard:view'
        }, {
            title: 'Orders',
            link: `/branch/${userBranchId}/orders`,
            icon: <ShoppingCart />,
            selected: false,
            permission: 'order:view'
        },
        {
            title: 'Products',
            link: `/branch/${userBranchId}/products`,
            icon: <Star />,
            selected: false,
            permission: 'product:view'
        },
        {
            title: 'Stocks',
            link: `/branch/${userBranchId}/stocks`,
            icon: <GitGraph />,
            selected: false,
            permission: 'stock:view'
        },
        {
            title: 'Expenses',
            link: `/branch/${userBranchId}/expenses`,
            icon: <DollarSign />,
            selected: false,
            permission: 'expense:view'
        },
        {
            title: 'Salesmen',
            link: `/branch/${userBranchId}/salesmen`,
            icon: <User2 />,
            selected: false,
            permission: 'salesman:view'
        }, {
            title: 'Logout',
            link: () => signOut(),
            icon: <LogOut />,
            selected: false,
        }
    ]
    const emptyMenu: ISidebarMenuItem[] = [{
        title: 'Logout',
        link: () => signOut(),
        icon: <LogOut />,
        selected: false,
    }]

    const sidebarMenuItems: ISidebarMenuItem[] = getSideBarMenuItems(userRoleId)


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
                <div className={`h-120 overflow-scroll scrollbar-hide flex flex-col gap-2`}>
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