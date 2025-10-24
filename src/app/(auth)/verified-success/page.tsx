// app/verified-success/page.tsx
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import Card from "@/components/ui/Card/Card";
import Button from "@/components/ui/Button/Button";

export default function VerifiedSuccessPage()
{
    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
            <Card className="flex flex-col justify-center items-center p-10 m-auto gap-3 rounded-2xl bg-white">
                <CheckCircle className="w-16 h-16  text-green-500 mx-auto mb-4" />

                <h2 className="text-2xl w-100 text-center font-semibold text-gray-900 mb-2">
                    Email Verified Successfully
                </h2>
                <h2 className="text-2xl w-100 text-center font-semibold text-gray-900 mb-2">
                    🎉
                </h2>
                <p className="text-gray-600 mb-6">
                    Your email has been verified. You can now sign in to your account.
                </p>
                <Link
                    href="/login"
                >
                    <Button>
                        Go to Login
                    </Button>
                </Link>
            </Card>
        </div>
    );
}
