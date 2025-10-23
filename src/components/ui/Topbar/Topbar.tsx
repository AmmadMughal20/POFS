"use client"
import { BellDot, Menu, Moon, X } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import Searchbar from '../Searchbar/Searchbar'
import Button from '../Button/Button'
import { signOut, useSession } from 'next-auth/react'

interface ITopbar
{
    collapsed?: boolean
}
const Topbar: React.FC<ITopbar> = ({ collapsed }) =>
{
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { data: session } = useSession()

    return (
        <header className={`p-5 flex w-screen gap-10 items-center transition-all justify-between ${mobileMenuOpen ? 'z-46' : '41'} fixed top-0 ${collapsed ? 'pl-20' : 'pl-38'}`}>
            <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <button
                    className="sm:hidden p-2 rounded-lg hover:bg-primary  hover:text-white transition"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <Menu size={24} />
                </button>

                {/* Searchbar - visible only on md+ */}
                <div className="hidden sm:block ">
                    <div className='!w-auto min-w-[25vw]'>
                        <Searchbar />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
                {/* User Info */}
                <div className="flex items-center gap-3 ml-6">
                    <Image
                        src={session?.user.image ?? "file.svg"}
                        width={40}
                        height={40}
                        alt="username"
                        className="w-10 h-10 rounded-full bg-amber-200 object-cover"
                    />
                    <div className="hidden sm:block">
                        <h6 className="hidden sm:flex sm:gap-2 text-sm md:text-base font-medium">
                            <span className='hidden lg:block'>Welcome, </span><span className="font-semibold"> {session?.user.name}</span>
                        </h6>
                        <p className='text-right'>{session?.user.roleTitle}</p>
                    </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-primary hover:text-white transition">
                    <BellDot size={22} />
                </button>
                <button className="p-2 rounded-lg hover:bg-primary hover:text-white transition">
                    <Moon size={22} />
                </button>
                <Button onClick={() => signOut()}>
                    Logout
                </Button>
            </div>

            {/* Mobile Menu Overlay (optional placeholder) */}
            {mobileMenuOpen && (
                <div className="absolute top-px left-0 w-full h-screen bg-gray-100 p-4 md:hidden z-50">
                    <div className='flex gap-5 justify-between items-center'>
                        <Searchbar className="!w-screen" />
                        <button className="p-2 rounded-lg hover:bg-primary hover:text-white transition" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            <X size={22} />
                        </button>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Topbar