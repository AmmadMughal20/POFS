import { NextResponse } from 'next/server';
import { getToken, JWT } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

// 🧩 Define route-level permissions
const routePermissions: Record<string, string[]> = {
    '/dashboard': ['dashboard:view'],
    '/admin/[businessId]/dashboard': ['dashboard:view'],
    '/branch-manager/[branchId]/dashboard': ['dashboard:view'],
    '/branch-management': ['branch:view'],
    '/users': ['user:view'],
    '/roles': ['role:view'],
    '/permissions': ['permission:view'],
};

// 🧩 Public/auth pages (accessible without token)
const authPathNames = [
    '/login',
    '/forgot-password',
    '/otp-verification',
    '/update-password',
];

// 🔍 Helper: check if current path is an auth/public page
function isAuthPage(pathName: string)
{
    return authPathNames.includes(pathName);
}

// 🔍 Helper: check if user has permission for given path
function hasPermission(path: string, userPermissions: string[] = []): boolean
{
    const matchedRoute = Object.keys(routePermissions).find(route =>
    {
        // Replace [param] with wildcard pattern (e.g., /admin/[businessId]/dashboard → /admin/[^/]+/dashboard)
        const pattern = route.replace(/\[.*?\]/g, '[^/]+');
        const regex = new RegExp(`^${pattern}$`);
        return regex.test(path);
    });

    if (!matchedRoute) return true; // route not listed = public/unrestricted

    const requiredPermissions = routePermissions[matchedRoute];
    return requiredPermissions.every(p => userPermissions.includes(p));
}

// 🚦 Main Middleware
export async function middleware(req: NextRequest)
{
    const token = await getToken({ req });
    const path = req.nextUrl.pathname;

    const isAuth = isAuthPage(path);
    const isIndex = path === '/';

    // 🧭 Case 1: Logged-in user trying to access auth pages
    if (isAuth && token)
    {
        return redirectToDashboard(token as JWT, req);
    }

    // 🧭 Case 2: Unauthenticated user trying to access protected route
    if (!token && !isAuth)
    {
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('redirect', path); // optional: for redirect-back
        return NextResponse.redirect(loginUrl);
    }

    // 🧭 Case 3: Authenticated user accessing index `/`
    if (token && isIndex)
    {
        return redirectToDashboard(token as JWT, req);
    }

    // 🧭 Case 4: Permission validation for protected routes
    if (token && !isAuth)
    {
        const userPermissions = (token as JWT).permissions || [];
        if (!hasPermission(path, userPermissions))
        {
            return NextResponse.redirect(new URL('/unauthorized', req.url));
        }
    }

    return NextResponse.next();
}

// 🔁 Helper: Redirect user to correct dashboard based on role
function redirectToDashboard(token: JWT, req: NextRequest)
{
    const { roleId, businessId, branchId } = token;

    let redirectUrl = '/dashboard'; // fallback default

    switch (String(roleId))
    {
        case '4': // Super Admin
            redirectUrl = '/dashboard';
            break;
        case '5': // Admin
            redirectUrl = `/admin/${businessId}/dashboard`;
            break;
        case '6': // Branch Manager
            redirectUrl = `/branch-manager/${branchId}/dashboard`;
            break;
        default:
            redirectUrl = '/dashboard';
    }

    return NextResponse.redirect(new URL(redirectUrl, req.url));
}

// 🧩 Apply to these routes
export const config = {
    matcher: [
        '/',
        '/login',
        '/forgot-password',
        '/otp-verification',
        '/update-password',
        '/unauthorized',
        '/dashboard/:path*',
        '/admin/:path*',
        '/branch-manager/:path*',
        '/branch-management/:path*',
        '/users/:path*',
        '/roles/:path*',
        '/permissions/:path*',
        '/businesses/:path*'
    ],
};
