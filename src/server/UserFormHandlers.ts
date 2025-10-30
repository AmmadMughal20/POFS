'use server'
import { randomUUID } from 'crypto';
import { sendVerificationEmail } from '@/helpers/sendVerificationemail';
import { prisma } from "@/lib/prisma"
import { revalidatePath } from 'next/cache'
import { getUserSession, hasPermission } from "@/server/getUserSession";
import { IUser, AddUserSchema, EditUserSchema } from "@/schemas/UserSchema";
import { Prisma, UserStatus } from '@prisma/client';
import bcrypt from "bcrypt";

export interface UsersState
{
    errors?: Record<string, string[]>;
    success?: boolean;
    message?: string;
    values?: Partial<IUser>
}

export async function getUsers(
    skip?: number,
    take?: number,
    orderBy?: Prisma.UserOrderByWithRelationInput,
    filter?: Prisma.UserWhereInput
): Promise<{ items: IUser[]; total: number }>
{
    const { permissions } = await getUserSession();
    if (!hasPermission(permissions, "user:view"))
    {
        throw new Error("Forbidden: You don’t have permission to view users list.");
    }

    const baseFilter: Prisma.UserWhereInput = {
        isDeleted: false,
        ...(filter ?? {}), // merge any other filters passed in
    };

    const [items, total] = await Promise.all([
        prisma.user.findMany({
            skip,
            take,
            orderBy: orderBy ?? { id: 'asc' },
            where: baseFilter,
            include: {
                Role: true
            }
        }),
        prisma.user.count({
            where: baseFilter,
        }),
    ]);

    return { items, total };
}


export async function handleUserAddAction(prevState: UsersState, formData: FormData): Promise<UsersState>
{
    try
    {
        // 🧩 1️⃣ Check permission
        const { user, permissions } = await getUserSession();
        if (!hasPermission(permissions, "user:create"))
        {
            throw new Error("Forbidden: You don’t have permission to create user.");
        }
        const createdBy = user.id
        const password = "Test@123"
        const email = formData.get("email")?.toString().trim() || ''
        const name = formData.get("name")?.toString().trim() || ''
        const phoneNo = formData.get("phoneNo")?.toString().trim() || ''
        const roleId = parseInt(formData.get("roleId")?.toString().trim() || '0')
        const status = "DISABLED"

        const result = AddUserSchema.safeParse({ email, phoneNo, roleId, status, name, createdBy, password });
        const encPass = await bcrypt.hash(password, await bcrypt.genSalt(10))

        if (!result.success)
        {
            return {
                errors: result.error.flatten().fieldErrors,
                values: { email, name, phoneNo, roleId, status },
                success: false,
                message: 'Validation failed. Please check the inputs.',
            };
        }


        const createdUser = await prisma.user.create({
            data: {
                createdBy,
                email,
                name,
                phoneNo,
                roleId,
                status,
                password: encPass
            },
        });

        const token = randomUUID();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h validity

        await prisma.verificationToken.create({
            data: {
                email,
                token,
                expiresAt,
            },
        });

        const verifyUrl = `${process.env.NEXTAUTH_URL}api/verify-email?token=${token}`;

        await sendVerificationEmail(email, verifyUrl, name);

        revalidatePath('/users');

        return {
            success: true,
            message: `User "${createdUser.name}" added successfully.`,
            values: createdUser,
        };
    } catch (error: unknown)
    {
        console.error('Error adding user:', error);

        let message = 'Something went wrong while adding the user.';
        if (error instanceof Error) message = error.message;

        return {
            success: false,
            message,
        };
    }
}

export async function handleUserEditAction(prevState: UsersState, formData: FormData): Promise<UsersState>
{
    try
    {

        const { user, permissions } = await getUserSession();
        if (!hasPermission(permissions, "user:update"))
        {
            throw new Error("Forbidden: You don’t have permission to update user.");
        }
        const updatedBy = user.id

        const userId = formData.get('userId')?.toString() || ''

        if (!userId) throw Error('User Id isrequired')

        const updatedUserData = {
            email: formData.get("email")?.toString().trim() || '',
            name: formData.get("name")?.toString().trim() || '',
            phoneNo: formData.get("phoneNo")?.toString().trim() || '',
            roleId: parseInt(formData.get("roleId")?.toString().trim() || '0'),
            status: formData.get("status")?.toString().trim() as UserStatus,
            updatedBy
        }

        const result = EditUserSchema.safeParse({ id: parseInt(userId), ...updatedUserData })

        if (!result.success)
        {
            return {
                errors: result.error.flatten().fieldErrors,
                values: { id: parseInt(userId), ...updatedUserData }
            }
        }
        await prisma.user.update({ where: { id: parseInt(userId) }, data: updatedUserData })

        revalidatePath('/users')

        return { success: true, message: 'User updated successfully' }
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

export async function handleUserDeleteAction(prevState: UsersState, formData: FormData): Promise<UsersState>
{
    try
    {

        const { user, permissions } = await getUserSession();
        if (!hasPermission(permissions, "user:delete"))
        {
            throw new Error("Forbidden: You don’t have permission to delete users.");
        }

        const updatedBy = user.id

        const userId = formData.get('userId') as string

        try
        {
            const isUserExist = await prisma.user.findFirst({ where: { id: parseInt(userId) } })
            if (!isUserExist) return { errors: { userId: ['User not found.'] } }

            await prisma.user.update({ where: { id: parseInt(userId) }, data: { isDeleted: true, deletedAt: new Date(), updatedBy } })

            revalidatePath('/users')

            return { success: true, message: 'User deleted successfully' }
        } catch (error)
        {
            console.error('Error deleting user:', error)
            return { success: false, message: 'Failed to delete user' }
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
