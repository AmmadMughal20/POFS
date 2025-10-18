import { NextResponse } from 'next/server';
import { getToken, JWT } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';


const routePermissions: Record<string, string[]> = {
    '/dashboard': ['view_dashboard'],
    '/branch-management': ['branch:view'],
    '/branch-management/edit': ['edit_branch'],
};

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


function hasPermission(path: string, userPermissions: string[] = [])
{
    // find a route that matches the path prefix
    const matchedRoute = Object.keys(routePermissions).find(route =>
        path.startsWith(route)
    );

    if (!matchedRoute) return true; // if route not listed, it's public or unprotected

    const requiredPermissions = routePermissions[matchedRoute];
    return requiredPermissions.every(p => userPermissions.includes(p));
}


export async function middleware(req: NextRequest)
{

    const token = await getToken({ req });
    const path = req.nextUrl.pathname;
    const isAuth = checkAuthPage(path);

    if (isAuth && token)
    {
        return NextResponse.redirect(new URL('/', req.url));
    }

    if (!token && !isAuth)
    {
        return NextResponse.redirect(new URL('login', req.url));
    }

    if (token && !isAuth)
    {
        const userPermissions = (token as JWT).permissions || [];
        if (!hasPermission(path, userPermissions))
        {
            return NextResponse.redirect(new URL('/unauthorized', req.url)); // or a 403 page
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/login',
        '/dashboard/:path*',
        '/branch-management:path*',
        '/',
        '/forgot-password',
        '/otp-verification',
        '/update-password',
        '/unauthorized'
    ],
};
