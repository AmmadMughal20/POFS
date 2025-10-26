import React from 'react'
import Button from '../../ui/Button/Button'
import Card from '../../ui/Card/Card'
import { IBranch } from '@/schemas/BranchSchema'

type VB = {
    selectedBranch: IBranch,
    onClose: () => void
}
const ViewBranchDetialsPopup = ({ selectedBranch, onClose }: VB) =>
{
    return (
        <Card>
            <div className="p-4 sm:p-6 w-full max-w-md">
                <h4 className="text-xl font-semibold mb-4 text-center border-b pb-2">
                    Branch Details
                </h4>

                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                    <div className="font-medium text-gray-600">Branch ID:</div>
                    <div className="text-gray-900">{selectedBranch.id ?? "-"}</div>

                    <div className="font-medium text-gray-600">Area:</div>
                    <div className="text-gray-900">{selectedBranch.area ?? "-"}</div>

                    <div className="font-medium text-gray-600">City:</div>
                    <div className="text-gray-900">{selectedBranch.city ?? "-"}</div>

                    <div className="font-medium text-gray-600">Address:</div>
                    <div className="text-gray-900">{selectedBranch.address ?? "-"}</div>

                    <div className="font-medium text-gray-600">Phone No:</div>
                    <div className="text-gray-900">{selectedBranch.phoneNo ?? "-"}</div>

                    <div className="font-medium text-gray-600">Business:</div>
                    <div className="text-gray-900">{selectedBranch.businessId ?? "-"}</div>

                    <div className="font-medium text-gray-600">Branch Manager:</div>
                    <div className="text-gray-900">{selectedBranch.branchManager ?? "-"}</div>

                    <div className="font-medium text-gray-600">Opening Time:</div>
                    <div className="text-gray-900">{selectedBranch.openingTime.toString().substring(16, 21) ?? "-"}</div>

                    <div className="font-medium text-gray-600">Closing Time:</div>
                    <div className="text-gray-900">{selectedBranch.closingTime.toString().substring(16, 21) ?? "-"}</div>

                    <div className="font-medium text-gray-600">Status:</div>
                    <div className="text-gray-900">{selectedBranch.status ?? "-"}</div>
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

export default ViewBranchDetialsPopup