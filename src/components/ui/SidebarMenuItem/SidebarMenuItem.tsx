
import React from 'react'
import ButtonLink from './ButtonLink'
import NormalLink from './NormalLink'

export interface ISidebarMenuItem
{
    title?: string
    link: string | (() => void)
    icon: React.ReactElement<React.SVGProps<SVGSVGElement>> | string
    selected?: boolean,
    variant?: 'primary'
}

const SidebarMenuItem: React.FC<ISidebarMenuItem> = ({
    title,
    variant,
    link,
    icon,
    selected = false,
}) =>
{

    const isLink = typeof link === 'string'

    return isLink ? (
        <NormalLink link={link} title={title} icon={icon} variant={variant} selected={selected} />
    ) : (
        <ButtonLink link={link} title={title} icon={icon} variant={variant} selected={selected} />
    )
}

export default SidebarMenuItem
