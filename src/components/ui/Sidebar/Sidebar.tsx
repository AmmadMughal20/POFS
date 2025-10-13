import React from 'react'



interface ISidebarChildProps
{
    isCollapsed?: boolean
    variant?: 'primary' | 'secondary'
}

interface ISidebar
{
    children: React.ReactNode,
    className?: string
    isCollapsed?: boolean
    variant?: 'primary'
}
const Sidebar: React.FC<ISidebar> = ({ children, className = '', variant, isCollapsed }) =>
{
    const enhancedChildren = React.Children.map(children, (child) =>
    {
        if (!React.isValidElement(child)) return child

        // 🧠 Only clone *custom components*, not DOM elements
        if (typeof child.type === 'string') return child

        return React.cloneElement(child as React.ReactElement<ISidebarChildProps>, {
            variant,
            isCollapsed,
        })
    })

    return (
        <div
            className={`flex flex-col gap-2 h-screen shadow-md px-5 py-5 top-0 left-0 max-w-50 fixed z-50
      ${className} ${variant ? 'bg-primary' : ''}`}
        >
            {enhancedChildren}
        </div>
    )
}

export default Sidebar