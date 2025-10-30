'use server'
import { prisma } from "@/lib/prisma"
import { IBusiness, AddBusinessSchema, EditBusinessSchema } from "@/schemas/BusinessSchema"
import { revalidatePath } from 'next/cache'
import { getUserSession, hasPermission } from "@/server/getUserSession";
import { BusinessStatus, BusinessType, Prisma, Province } from "@prisma/client";

export interface BusinessesState
{
    errors?: Record<string, string[]>;
    success?: boolean;
    message?: string;
    values?: Partial<IBusiness>
}


export async function getBusinesses(
    skip?: number,
    take?: number,
    orderBy?: Prisma.BusinessOrderByWithRelationInput,
    filter?: Prisma.BusinessWhereInput
): Promise<{ items: IBusiness[]; total: number }>
{
    const { permissions } = await getUserSession();
    if (!hasPermission(permissions, "business:view"))
    {
        throw new Error("Forbidden: You don’t have permission to view businesses list.");
    }

    const findManyArgs: Prisma.BusinessFindManyArgs = {
        skip,
        take,
        orderBy: orderBy ?? { id: 'asc' },
        where: filter,
        include: {
            owner: true,
            createdByUser: true,
            updatedByUser: true
        }
    };

    const countArgs: Prisma.BusinessCountArgs = {
        where: filter,
    };

    const [items, total] = await Promise.all([
        prisma.business.findMany(findManyArgs),
        prisma.business.count(countArgs),
    ]);

    return { items, total };
}

export async function handleBusinessAddAction(prevState: BusinessesState, formData: FormData): Promise<BusinessesState>
{
    try
    {

        const { user, permissions } = await getUserSession();
        if (!hasPermission(permissions, "business:create"))
        {
            throw new Error("Forbidden: You don’t have permission to create businesses.");
        }

        const createdBy = user.id

        const newBusiness: IBusiness = {
            id: formData.get('id')?.toString() || crypto.randomUUID(),
            ownerId: parseInt(formData.get('ownerId')?.toString() || '') || 1,
            name: formData.get('name')?.toString() || '',
            type: formData.get('type')?.toString() as BusinessType || '',
            status: BusinessStatus.ACTIVE,
            email: formData.get('email')?.toString() || '',
            phone: formData.get('phone')?.toString() || '',
            website: formData.get('website')?.toString() || '',
            address: formData.get('address')?.toString() || '',
            city: formData.get('city')?.toString() || '',
            province: formData.get('province')?.toString() as Province || '',
            country: formData.get('country')?.toString() || '',
            logoUrl: formData.get('logoUrl')?.toString() || '',
            coverImageUrl: formData.get('coverImageUrl')?.toString() || '',
            establishedYear: parseInt(formData.get('establishedYear')?.toString() || ''),
            isVerified: true,
            createdBy
        }

        const result = AddBusinessSchema.safeParse(newBusiness)

        if (!result.success)
        {
            return {
                errors: result.error.flatten().fieldErrors,
                values: newBusiness
            }
        }

        await prisma.business.create({
            data: {
                id: newBusiness.id,
                ownerId: newBusiness.ownerId,
                name: newBusiness.name,
                type: newBusiness.type,
                status: newBusiness.status,
                email: newBusiness.email,
                phone: newBusiness.phone,
                website: newBusiness.website,
                address: newBusiness.address,
                city: newBusiness.city,
                province: newBusiness.province,
                country: newBusiness.country,
                logoUrl: newBusiness.logoUrl,
                coverImageUrl: newBusiness.coverImageUrl,
                establishedYear: newBusiness.establishedYear,
                isVerified: true,
                createdBy,

            },
        })

        revalidatePath('/businesses')

        return { success: true, message: 'Business added successfully' }
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

export async function handleBusinessEditAction(prevState: BusinessesState, formData: FormData): Promise<BusinessesState>
{
    try
    {

        const { user, permissions } = await getUserSession();
        if (!hasPermission(permissions, "business:update"))
        {
            throw new Error("Forbidden: You don’t have permission to edit businesses.");
        }

        const updatedBy = user.id

        const businessId = formData.get('id')?.toString() || ''

        const updatedBusinessData: IBusiness = {
            id: formData.get('id')?.toString() || crypto.randomUUID(),
            ownerId: parseInt(formData.get('ownerId')?.toString() || '') || 1,
            name: formData.get('name')?.toString() || '',
            type: formData.get('type')?.toString() as BusinessType || '',
            description: formData.get('description')?.toString() || '',
            status: formData.get('status')?.toString() as BusinessStatus || '',
            email: formData.get('email')?.toString() || '',
            phone: formData.get('phone')?.toString() || '',
            website: formData.get('website')?.toString() || '',
            address: formData.get('address')?.toString() || '',
            city: formData.get('city')?.toString() || '',
            province: formData.get('province')?.toString() as Province || '',
            country: formData.get('country')?.toString() || '',
            logoUrl: formData.get('logoUrl')?.toString() || '',
            coverImageUrl: formData.get('coverImageUrl')?.toString() || '',
            establishedYear: parseInt(formData.get('establishedYear')?.toString() || ''),
            isVerified: true,
            updatedBy
        }

        const result = EditBusinessSchema.safeParse({ ...updatedBusinessData })
        if (!result.success)
        {
            return {
                errors: result.error.flatten().fieldErrors,
                values: { ...updatedBusinessData }
            }
        }
        await prisma.business.update({
            where: { id: businessId }, data: {
                name: updatedBusinessData.name,
                type: updatedBusinessData.type,
                description: updatedBusinessData.description,
                status: updatedBusinessData.status,
                email: updatedBusinessData.email,
                phone: updatedBusinessData.phone,
                website: updatedBusinessData.website,
                address: updatedBusinessData.address,
                city: updatedBusinessData.city,
                province: updatedBusinessData.province,
                country: updatedBusinessData.country,
                logoUrl: updatedBusinessData.logoUrl,
                coverImageUrl: updatedBusinessData.coverImageUrl,
                establishedYear: updatedBusinessData.establishedYear,
                isVerified: updatedBusinessData.isVerified,
                ownerId: updatedBusinessData.ownerId,
            }
        })

        revalidatePath('/businesses')

        return { success: true, message: 'Business updated successfully' }
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


export async function handleBusinessDeleteAction(prevState: BusinessesState, formData: FormData): Promise<BusinessesState>
{
    try
    {
        const { permissions } = await getUserSession();
        if (!hasPermission(permissions, "business:delete"))
        {
            throw new Error("Forbidden: You don’t have permission to delete businesses.");
        }

        const businessId = formData.get('businessId') as string

        try
        {
            const isBusinessExist = await prisma.business.findFirst({ where: { id: businessId } })
            if (!isBusinessExist) return { errors: { businessId: ['Business not found.'] } }

            await prisma.business.delete({ where: { id: businessId } })

            revalidatePath('/businesses')

            return { success: true, message: 'Business deleted successfully' }
        } catch (error)
        {
            console.error('Error deleting business:', error)
            return { success: false, message: 'Failed to delete business' }
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


export async function getBusiness(businessId: string): Promise<IBusiness | null>
{
    const { user } = await getUserSession();
    if (!(user.roleId == 5))
    {
        throw new Error("Forbidden: You don’t have permission to view business.");
    }

    const business = await prisma.business.findFirst({ where: { id: businessId } })

    return business;
}