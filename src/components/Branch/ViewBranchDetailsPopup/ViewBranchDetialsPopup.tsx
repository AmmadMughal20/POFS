import React from 'react'
import Button from '../../ui/Button/Button'
import Card from '../../ui/Card/Card'
import { IBranch } from '@/schemas/BranchSchema'
import { hasPermission } from '@/server/getUserSession'
import { IPermission } from '@/schemas/PermissionSchema'
import { PencilIcon } from 'lucide-react'

type VB = {
    selectedBranch: IBranch,
    onClose: () => void,
    permissions: string[],
    onViewProducts: (businessId: string, branchId: string) => void,
    onViewStocks: (businessId: string, branchId: string) => void,
    onViewOrders: (businessId: string, branchId: string) => void,
    onViewSalesmen: (businessId: string, branchId: string) => void,
    handleChangeManager: (businessId: string, branchId: string) => void
}

const ViewBranchDetialsPopup = ({ selectedBranch, onClose, permissions, onViewProducts, onViewOrders, onViewSalesmen, onViewStocks, handleChangeManager }: VB) =>
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
                    {
                        selectedBranch.Manager?.User.name ?
                            <div className='flex justify-between'>
                                <div className="text-gray-900">{selectedBranch.Manager?.User.name ?? "-"}</div>
                                <button onClick={() => handleChangeManager(selectedBranch.businessId, selectedBranch.id)}><PencilIcon /></button>
                            </div>
                            : <Button onClick={() => handleChangeManager(selectedBranch.businessId, selectedBranch.id)}> Add Manager</Button>
                    }


                    <div className="font-medium text-gray-600">Opening Time:</div>
                    <div className="text-gray-900">{selectedBranch.openingTime.toString().substring(16, 21) ?? "-"}</div>

                    <div className="font-medium text-gray-600">Closing Time:</div>
                    <div className="text-gray-900">{selectedBranch.closingTime.toString().substring(16, 21) ?? "-"}</div>

                    <div className="font-medium text-gray-600">Status:</div>
                    <div className="text-gray-900">{selectedBranch.status ?? "-"}</div>
                </div>

                <div className="mt-6 flex justify-center gap-2">
                    {hasPermission(permissions, 'product:view') ? <Button onClick={() => onViewProducts(selectedBranch.businessId, selectedBranch.id)}>View Products</Button> : <></>}
                    {hasPermission(permissions, 'stock:view') ? <Button onClick={() => onViewStocks(selectedBranch.businessId, selectedBranch.id)}>View Stocks</Button> : <></>}
                    {hasPermission(permissions, 'order:view') ? <Button onClick={() => onViewOrders(selectedBranch.businessId, selectedBranch.id)}>View Orders</Button> : <></>}
                    {hasPermission(permissions, 'salesman:view') ? <Button onClick={() => onViewSalesmen(selectedBranch.businessId, selectedBranch.id)}>View Salesmen</Button> : <></>}
                </div>
            </div>
        </Card>
    )
}

export default ViewBranchDetialsPopup