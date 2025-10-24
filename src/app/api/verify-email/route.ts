import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request)
{
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token)
    {
        return NextResponse.json({ success: false, message: 'Missing token.' }, { status: 400 });
    }

    const record = await prisma.verificationToken.findUnique({ where: { token } });
    if (!record)
    {
        return NextResponse.json({ success: false, message: 'Invalid or expired token.' }, { status: 400 });
    }

    if (record.expiresAt < new Date())
    {
        return NextResponse.json({ success: false, message: 'Token expired.' }, { status: 400 });
    }

    await prisma.user.update({
        where: { email: record.email },
        data: { status: 'ACTIVE' },
    });

    await prisma.verificationToken.delete({ where: { token } });

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/verified-success`);
}
