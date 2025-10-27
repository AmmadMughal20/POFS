import React from 'react'
import Button from '../../ui/Button/Button'
import Card from '../../ui/Card/Card'
import { IUser } from '@/schemas/UserSchema'

type VB = {
    selectedUser: IUser,
    onClose: () => void
}
const ViewUserDetialsPopup = ({ selectedUser, onClose }: VB) =>
{
    return (
        <Card>
            <div className="p-4 sm:p-6 w-full max-w-md">
                <h4 className="text-xl font-semibold mb-4 text-center border-b pb-2">
                    User Details
                </h4>

                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                    <div className="font-medium text-gray-600">User ID:</div>
                    <div className="text-gray-900">{selectedUser.id ?? "-"}</div>

                    <div className="font-medium text-gray-600">Name:</div>
                    <div className="text-gray-900">{selectedUser.name as string ?? "-"}</div>

                    <div className="font-medium text-gray-600">Phone No:</div>
                    <div className="text-gray-900">{selectedUser.phoneNo ?? "-"}</div>

                    <div className="font-medium text-gray-600">Email:</div>
                    <div className="text-gray-900">{selectedUser.email ?? "-"}</div>

                    <div className="font-medium text-gray-600">Role:</div>
                    <div className="text-gray-900">{selectedUser.Role?.title ?? "-"}</div>

                    <div className="font-medium text-gray-600">Status:</div>
                    <div className="text-gray-900">{selectedUser.status ?? "-"}</div>
                </div>

                <div className="mt-6 flex justify-center">
                    <Button
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </div>
            </div>
        </Card>
    )
}

export default ViewUserDetialsPopup