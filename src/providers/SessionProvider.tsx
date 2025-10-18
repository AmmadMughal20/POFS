// app/providers.tsx
"use client";

import SidebarWrapper from "@/components/ui/Sidebar/SidebarWrapper";
import { SidebarProvider } from "@/context/SidebarContext";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode })
{

    return <SessionProvider>
        <SidebarProvider>
            <SidebarWrapper variant="primary" />
            {children}
        </SidebarProvider>
    </SessionProvider>;
}
