import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function getUserSession()
{
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email)
    {
        throw new Error("Unauthorized");
    }

    // Fetch latest user data with permissions
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            Role: {
                include: {
                    rolePerms: {
                        include: {
                            Permission: true,
                        },
                    },
                },
            },
        },
    });

    if (!user) throw new Error("Unauthorized");

    const permissions = user.Role.rolePerms.map((rp) => rp.Permission.code);
    return { user, permissions };
}


export function hasPermission(
    permissions: string[],
    requiredPermission: string
)
{
    return permissions.includes(requiredPermission);
}