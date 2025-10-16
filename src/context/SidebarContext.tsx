"use client";

import React, { createContext, useContext, useState } from "react";

interface SidebarContextType
{
    isSidebarCollapsed: boolean;
    toggleSidebar: () => void;
    setSidebarCollapsed: (value: boolean) => void;
}

// Default empty context
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Provider Component
export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) =>
{
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);

    const setSidebarCollapsed = (value: boolean) => setIsSidebarCollapsed(value);

    return (
        <SidebarContext.Provider
            value={{
                isSidebarCollapsed,
                toggleSidebar,
                setSidebarCollapsed
            }
            }
        >
            {children}
        </SidebarContext.Provider>
    );
};

// Custom hook for easy access
export const useSidebar = () =>
{
    const context = useContext(SidebarContext);
    if (!context)
    {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
};
