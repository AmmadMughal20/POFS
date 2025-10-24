import Card from '@/components/ui/Card/Card'
import React from 'react'

import { IUser } from '@/schemas/UserSchema'
import { CheckCircle, Pencil, XCircle } from 'lucide-react'
import Button from '@/components/ui/Button/Button'
const UserCard: React.FC<IUser> = ({ id, name, phoneNo, email, roleId, status }) =>
{
    return (
        <Card className="p-4 space-y-3 rounded-xl shadow hover:shadow-lg transition bg-white">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h6 className="text-lg font-semibold text-gray-800">{`User ${id}`}</h6>
                <div className="flex items-center gap-1">
                    {status === 'ACTIVE' ? (
                        <CheckCircle className="text-green-500 w-5 h-5" />
                    ) : (
                        <XCircle className="text-red-500 w-5 h-5" />
                    )}
                    <span className={`text-sm font-medium ${status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}>
                        {status.toUpperCase()}
                    </span>
                </div>
            </div>

            {/* Name */}
            <div className="space-y-1">
                <p className="text-gray-700 text-sm">
                    <span className="font-medium">Name:</span> {name as string}
                </p>
            </div>

            {/* Address & Contact */}
            <div className="space-y-1">
                <p className="text-gray-700 text-sm">
                    <span className="font-medium">Email:</span> {email}
                </p>
                <p className="text-gray-700 text-sm">
                    <span className="font-medium">Phone No:</span> {phoneNo}
                </p>
            </div>

            {/* Timings */}
            <div className="flex items-center justify-start gap-4 text-gray-700 text-sm">
                <div>
                    <span className="font-medium">Role:</span>{' '}
                    {roleId}
                </div>
            </div>

            {/* Optional: Actions / buttons can go here */}
            <div className="flex justify-end">
                <Button className='!rounded-full !p-1'><Pencil size={'20'} /></Button>
            </div>
        </Card>
    )
}

export default UserCard