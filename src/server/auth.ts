"use server";

import { prisma } from "@/lib/prisma"; // example: your DB client
import bcrypt from "bcrypt";
import crypto from 'crypto'

export async function authenticateUser(email: string, password: string)
{
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    return {
        id: user.id.toString(), // <-- convert to string
        name: user.name,
        email: user.email
    };
}


export async function generateOTP(email: string)
{
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
    {
        return { errors: { email: ["User not found with this email."] } };
    }
    const userId = user.id
    await prisma.oTP.deleteMany({ where: { userId: userId } })
    // Generate OTP
    const otpCode = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // valid for 10 min

    // Save OTP in DB
    await prisma.oTP.create({
        data: {
            code: otpCode,
            expiresAt: expiry,
            userId: user.id,
        },
    });

    const response = { otpGenerated: true, value: otpCode }

    return response
}


export async function verifyOTP(email: string, otp: string)
{
    try
    {
        let otpFromDB;
        const user = await prisma.user.findFirst({ where: { email } })
        if (user)
        {
            const otpRecord = await prisma.oTP.findFirst({ where: { userId: user.id } })
            otpFromDB = otpRecord?.code
            if (otpFromDB === otp)
            {
                return true
            }
        }
        else
        {
            return false
        }
    } catch (e)
    {
        throw e
    }
}

export const updatePassword = async (email: string, new_password: string) =>
{
    const user = await prisma.user.findFirst({ where: { email } });

    const salts = await bcrypt.genSalt(10)
    const enc_password = await bcrypt.hash(new_password, salts)

    if (user)
    {
        await prisma.user.update({ where: { email }, data: { password: enc_password } })
        return true
    }
    return false
} 
