import React from 'react'
import Button from '../../ui/Button/Button'
import Card from '../../ui/Card/Card'
import { IRole } from '@/schemas/RoleSchema'

type VB = {
    selectedRole: IRole,
    onClose: () => void
}
const ViewRoleDetialsPopup = ({ selectedRole, onClose }: VB) =>
{
    return (
        <Card>
            <div className="p-4 sm:p-6 w-full max-w-md">
                <h4 className="text-xl font-semibold mb-4 text-center border-b pb-2">
                    Role Details
                </h4>

                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                    <div className="font-medium text-gray-600">Role ID:</div>
                    <div className="text-gray-900">{selectedRole.id ?? "-"}</div>

                    <div className="font-medium text-gray-600">Title:</div>
                    <div className="text-gray-900">{selectedRole.title ?? "-"}</div>

                    <div className="font-medium text-gray-600">Permissions:</div>
                    <div>

                        {
                            selectedRole.permissions &&
                            selectedRole?.permissions.map((item, index) =>
                            (
                                <div className="text-gray-900" key={index}>{item.title ?? "-"}</div>

                            ))
                        }
                    </div>
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

export default ViewRoleDetialsPopup