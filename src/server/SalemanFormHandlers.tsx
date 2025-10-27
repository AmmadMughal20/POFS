'use server'

import { prisma } from "@/lib/prisma"

export async function getSalesmenByBranch(branchId: string)
{
    const salesmen = await prisma.salesMan.findMany({
        where: { branchId },
        include: {
            User: true
        }
    })
    return salesmen
}