'use client';
import Button from '@/components/ui/Button/Button';
import Page from '@/components/ui/Page/Page';
import { ShieldAlert } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const UnauthorizedPage = () =>
{
    const router = useRouter();

    return (
        <Page className='flex flex-col justify-center items-center'>
            {/* Icon */}
            <div className="flex items-center justify-center bg-red-100 rounded-full p-6 mb-6">
                <ShieldAlert className="text-red-500 w-16 h-16" />
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Access Denied</h1>

            {/* Subtitle */}
            <p className="text-gray-600 mb-8 max-w-md">
                You don’t have permission to view this page. Please contact your administrator if you believe this is a mistake.
            </p>

            {/* Buttons */}
            <div className="flex gap-4">
                <Button onClick={() => router.push('/')} variant="primary">
                    Go Home
                </Button>
                <Button onClick={() => { signOut() }} variant="secondary">
                    Login Again
                </Button>
            </div>
        </Page>
    );
};

export default UnauthorizedPage;
