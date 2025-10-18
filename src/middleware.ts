import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest)
{

    const authPathNames = [
        '/login',
        '/forgot-password',
        '/otp-verification',
        '/update-password'
    ]

    const checkAuthPage = (pathName: string) =>
    {
        if (authPathNames.includes(pathName)) return true
    }
    const token = await getToken({ req });

    const isAuthPage = checkAuthPage(req.nextUrl.pathname)

    if (isAuthPage && token)
    {
        return NextResponse.redirect(new URL('/', req.url));
    }

    if (!token && !isAuthPage)
    {
        return NextResponse.redirect(new URL('login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/login', '/dashboard/:path*', '/branch-management:path*', '/', '/forgot-password', '/otp-verification', '/update-password'],
};
