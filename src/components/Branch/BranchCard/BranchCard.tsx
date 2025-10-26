import Card from '@/components/ui/Card/Card'
import React from 'react'

import { IBranch } from '@/schemas/BranchSchema'
import { CheckCircle, Pencil, XCircle } from 'lucide-react'
import Button from '@/components/ui/Button/Button'
const BranchCard: React.FC<IBranch> = ({ id, address, phoneNo, status, area, city, openingTime, closingTime, branchManager, businessId }) =>
{
    return (
        <Card className="p-4 space-y-3 rounded-xl shadow hover:shadow-lg transition bg-white">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h6 className="text-lg font-semibold text-gray-800">{`Branch ${id}`}</h6>
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

            {/* Address & Contact */}
            <div className="space-y-1">
                <p className="text-gray-700 text-sm">
                    <span className="font-medium">Address:</span> {address}, {area}, {city}
                </p>
                <p className="text-gray-700 text-sm">
                    <span className="font-medium">Phone:</span> {phoneNo}
                </p>
            </div>

            <div className="space-y-1">
                <p className="text-gray-700 text-sm">
                    <span className="font-medium">Business:</span> {businessId}
                </p>
                <p className="text-gray-700 text-sm">
                    <span className="font-medium">Branch Manager:</span> {branchManager}
                </p>
            </div>

            {/* Timings */}
            <div className="flex items-center justify-start gap-4 text-gray-700 text-sm">
                <div>
                    <span className="font-medium">Opening:</span>{' '}
                    {new Date(openingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div>
                    <span className="font-medium">Closing:</span>{' '}
                    {new Date(closingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>

            {/* Optional: Actions / buttons can go here */}
            <div className="flex justify-end">
                <Button className='!rounded-full !p-1'><Pencil size={'20'} /></Button>
            </div>
        </Card>
    )
}

export default BranchCard