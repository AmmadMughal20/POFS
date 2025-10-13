import Link from 'next/link'
import React from 'react'
import { ISidebarMenuItem } from './SidebarMenuItem'
import Image from 'next/image'


interface INormalLink extends ISidebarMenuItem
{
    link: string
}
const NormalLink: React.FC<INormalLink> = ({ link, selected, icon, title, isCollapsed, variant }) =>
{
    const isIconString = typeof icon === 'string'
    return (
        <Link href={link} className="block">
            <div
                className={!variant ? `flex gap-2 items-center p-2 rounded cursor-pointer w-full
                  hover:bg-blue-200 transition-all duration-200 hover:text-primary/80
                  ${selected ? 'bg-primary text-white' : 'text-gray-800'}` :
                    `flex gap-2 items-center p-2 rounded cursor-pointer w-full
                  hover:bg-blue-200 transition-all duration-200 hover:text-primary/80
                  ${selected ? 'bg-white text-black' : 'text-gray-200'}`}
            >
                {isIconString ? (
                    <Image
                        src={icon}
                        alt={title}
                        width={20}
                        height={20}
                        className="w-5 h-5 object-contain"
                    />
                ) : (
                    React.cloneElement(icon, {
                        className: !variant ? `w-5 h-5 ${selected ? 'text-white' : ''
                            } transition-colors` : `w-5 h-5 ${selected ? 'text-black' : ''
                            } transition-colors`,
                    })
                )}
                <p
                    className={!variant ? `${isCollapsed ? 'hidden transition-all' : 'block transition-all'} ${selected ? 'text-white font-semibold' : 'hover: hover:text-primary/80'
                        } transition-all ` : `${isCollapsed ? 'hidden transition-all' : 'block transition-all'} ${selected ? 'text-black font-semibold' : 'hover: hover:text-primary/80'
                        } transition-all`}
                >
                    {title}
                </p>
            </div>
        </Link>
    )
}

export default NormalLink