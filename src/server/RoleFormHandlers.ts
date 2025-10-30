'use server'
import { prisma } from "@/lib/prisma"
import { revalidatePath } from 'next/cache'
import { getUserSession, hasPermission } from "@/server/getUserSession";
import { IRole, AddRoleSchema, EditRoleSchema } from "@/schemas/RoleSchema";
import { IPermission } from "@/schemas/PermissionSchema";
import { Prisma } from "@prisma/client";
import { Tag } from "@/components/ui/TagInput/TagInput";

export interface RolesState
{
    errors?: Record<string, string[]>;
    success?: boolean;
    message?: string;
    values?: Partial<IRole>
}

export async function getRoles(
    skip?: number,
    take?: number,
    orderBy?: Prisma.RoleOrderByWithRelationInput,
    filter?: Prisma.RoleWhereInput
): Promise<{ items: (IRole & { permissions: IPermission[] })[]; total: number }>
{
    const { permissions } = await getUserSession();
    if (!hasPermission(permissions, 'role:view'))
    {
        throw new Error("Forbidden: You don’t have permission to view roles list.");
    }

    type RoleWithPerms = Prisma.RoleGetPayload<{
        include: {
            rolePerms: {
                include: {
                    Permission: true;
                };
            };
        };
    }>;

    const [roles, total] = await Promise.all([
        prisma.role.findMany({
            skip,
            take,
            orderBy: orderBy ?? { id: 'asc' },
            where: filter,
            include: {
                rolePerms: {
                    include: {
                        Permission: true,
                    },
                },
            },
        }),
        prisma.role.count({ where: filter }),
    ]);

    const items: (IRole & { permissions: IPermission[] })[] = (roles as RoleWithPerms[]).map((role) => ({
        ...role,
        permissions: role.rolePerms
            .map((rp) => rp.Permission)
            .filter((p): p is IPermission => Boolean(p)),
    }));

    return { items, total };
}


export async function handleRoleAddAction(
    prevState: RolesState,
    formData: FormData
): Promise<RolesState>
{
    try
    {
        // 🧩 1️⃣ Check permission
        const { user, permissions } = await getUserSession();
        if (!hasPermission(permissions, "role:create"))
        {
            throw new Error("Forbidden: You don’t have permission to create roles.");
        }

        const createdBy = user.id

        // 🧩 2️⃣ Extract data
        const title = formData.get('title')?.toString().trim() || '';
        let permissionsForm: Tag[] = [];

        try
        {
            const raw = formData.get('permissions');
            if (raw) permissionsForm = JSON.parse(raw.toString()) as Tag[];
        } catch
        {
            permissionsForm = formData.getAll('permissions') as unknown as Tag[];
        }
        const newRole: IRole = { title, createdBy };


        // 🧩 3️⃣ Validate with schema
        const result = AddRoleSchema.safeParse(newRole);
        if (!result.success)
        {
            return {
                errors: result.error.flatten().fieldErrors,
                values: newRole,
                success: false,
                message: 'Validation failed. Please check the inputs.',
            };
        }

        // 🧩 4️⃣ Create role with relations
        const createdRole = await prisma.role.create({
            data: {
                title,
                createdBy,
                rolePerms: {
                    create: permissionsForm.map((perm) => ({
                        Permission: { connect: { id: Number(perm.id) } },
                    })),
                },

            },
            include: {
                rolePerms: {
                    include: {
                        Permission: true,
                    },
                },
            },
        });

        // 🧩 5️⃣ Revalidate page or cache
        revalidatePath('/roles');

        // 🧩 6️⃣ Return success response
        return {
            success: true,
            message: `Role "${createdRole.title}" added successfully.`,
            values: createdRole,
        };
    } catch (error: unknown)
    {
        console.error('Error adding role:', error);

        let message = 'Something went wrong while adding the role.';

        if (error instanceof Error)
        {
            message = error.message;
        } else if (typeof error === 'string')
        {
            message = error;
        }

        return {
            success: false,
            message,
        };
    }
}

export async function handleRoleEditAction(
    prevState: RolesState,
    formData: FormData
): Promise<RolesState>
{
    try
    {
        // 🧩 1️⃣ Check permission
        const { user, permissions } = await getUserSession();
        if (!hasPermission(permissions, "role:update"))
        {
            throw new Error("Forbidden: You don’t have permission to update roles.");
        }
        const updatedBy = user.id
        // 🧩 1️⃣ Extract role ID and title
        const roleIdStr = formData.get("id")?.toString() || "";
        const roleId = parseInt(roleIdStr, 10);
        const title = formData.get("title")?.toString() || "";

        // 🧩 2️⃣ Parse permissions from form (TagInput sends JSON)
        let parsedPermissions: { id: number; title: string }[] = [];
        try
        {
            const raw = formData.get("permissions")?.toString() || "[]";
            parsedPermissions = JSON.parse(raw);
        } catch (err)
        {
            parsedPermissions = [];
        }

        const permissionIds = parsedPermissions
            .map((p) => Number(p.id))
            .filter((id) => !isNaN(id));

        // 🧩 3️⃣ Validate role data
        const result = EditRoleSchema.safeParse({ id: roleId, title, updatedBy });
        if (!result.success)
        {
            return {
                errors: result.error.flatten().fieldErrors,
                values: { id: roleId, title },
            };
        }

        // 🧩 4️⃣ Run transaction (array style)
        const transactionQueries = [
            // Delete old permissions
            prisma.rolePermission.deleteMany({ where: { roleId } }),
            // Add new permissions if any
            ...(permissionIds.length > 0
                ? [
                    prisma.rolePermission.createMany({
                        data: permissionIds.map((permId) => ({
                            roleId,
                            permId,
                        })),
                    }),
                ]
                : []),
            // Update role title
            prisma.role.update({
                where: { id: roleId },
                data: { title, updatedBy },
            }),
        ];

        await prisma.$transaction(transactionQueries);

        // 🧩 5️⃣ Optionally fetch updated role with permissions
        const updatedRole = await prisma.role.findUnique({
            where: { id: roleId },
            include: { rolePerms: { include: { Permission: true } } },
        });

        // 🧩 6️⃣ Revalidate path and return success
        revalidatePath("/roles");

        return {
            success: true,
            message: "Role updated successfully",
            values: {
                id: updatedRole?.id,
                title: updatedRole?.title,
                updatedBy
            },
        };
    } catch (error: unknown)
    {
        console.error('Error updating role:', error);

        let message = 'Something went wrong while updating the role.';

        if (error instanceof Error)
        {
            message = error.message;
        } else if (typeof error === 'string')
        {
            message = error;
        }

        return {
            success: false,
            message,
        };
    }
}

export async function handleRoleDeleteAction(
    prevState: RolesState,
    formData: FormData
): Promise<RolesState>
{
    try
    {

        const { permissions } = await getUserSession();
        if (!hasPermission(permissions, "role:delete"))
        {
            throw new Error("Forbidden: You don’t have permission to delete role.");
        }

        const roleIdStr = formData.get("roleId")?.toString() || "";
        const roleId = parseInt(roleIdStr, 10);

        try
        {
            // 🧩 1️⃣ Check if role exists
            const existingRole = await prisma.role.findUnique({ where: { id: roleId } });
            if (!existingRole)
            {
                return { errors: { roleId: ["Role not found."] } };
            }

            // 🧩 2️⃣ Delete related role-permission records and role atomically
            await prisma.$transaction([
                prisma.rolePermission.deleteMany({ where: { roleId } }),
                prisma.role.delete({ where: { id: roleId } }),
            ]);

            // 🧩 3️⃣ Revalidate roles page cache
            revalidatePath("/roles");

            return { success: true, message: "Role deleted successfully" };
        } catch (error: unknown)
        {
            console.error('Error deleting role:', error);

            let message = 'Something went wrong while deleting the role.';

            if (error instanceof Error)
            {
                message = error.message;
            } else if (typeof error === 'string')
            {
                message = error;
            }

            return {
                success: false,
                message,
            };
        }
    } catch (error)
    {

        // ✅ Fallback for other errors
        if (error instanceof Error)
        {
            return {
                success: false,
                message: error.message,
            };
        }

        // ✅ Handle truly unknown errors safely
        return {
            success: false,
            message: 'An unexpected error occurred while adding the category.',
        };
    }
};
