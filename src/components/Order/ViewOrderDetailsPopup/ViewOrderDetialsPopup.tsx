'use client'

import { IOrder } from '@/schemas/OrderSchema'
import { IOrderItem } from '@/schemas/OrderItem'
import { getOrderItems } from '@/server/OrderItemsHandlers'
import { useEffect, useState } from 'react'
import Card from '../../ui/Card/Card'
import Button from '../../ui/Button/Button'

type ViewOrderProps = {
    selectedOrder: IOrder
    onClose: () => void
    permissions: string[]
}

const ViewOrderDetailsPopup = ({ selectedOrder, onClose, permissions }: ViewOrderProps) =>
{
    const [orderItems, setOrderItems] = useState<IOrderItem[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() =>
    {
        if (selectedOrder.id)
        {
            console.log(selectedOrder, 'printing selectedorder')
            const fetchOrderItems = async (orderId: number) =>
            {
                try
                {
                    setLoading(true)
                    const { items } = await getOrderItems(undefined, undefined, undefined, { orderId })

                    setOrderItems(items ?? [])
                } catch (err)
                {
                    console.error('Error fetching order items:', err)
                } finally
                {
                    setLoading(false)
                }
            }
            fetchOrderItems(selectedOrder.id)
        }
    }, [selectedOrder.id])

    return (
        <div className="p-3 w-full max-w-4xl mx-auto">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h4 className="text-2xl font-semibold text-gray-800">Order Details</h4>
            </div>

            {/* Order Info */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-700">
                <div className="font-medium text-gray-500">Order ID:</div>
                <div>{selectedOrder.id ?? '-'}</div>

                <div className="font-medium text-gray-500">Business Name:</div>
                <div>{selectedOrder.Business?.name ?? '-'}</div>

                <div className="font-medium text-gray-500">Branch Area:</div>
                <div>{selectedOrder.Branch?.area ?? '-'}</div>



                <div className="font-medium text-gray-500">Status:</div>
                <div className="capitalize">{selectedOrder.status ?? '-'}</div>

                <div className="font-medium text-gray-500">Created At:</div>
                <div>{selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : '-'}</div>

                <div className="font-medium text-gray-500">Updated At:</div>
                <div>{selectedOrder.updatedAt ? new Date(selectedOrder.updatedAt).toLocaleString() : '-'}</div>
            </div>

            <div className="flex justify-between items-center border-b pb-3 mb-4 mt-6">
                <h5 className="text-2xl font-semibold text-gray-800">Customer Details</h5>
            </div>
            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-700">
                <div className="font-medium text-gray-500">Customer Name:</div>
                <div>{selectedOrder.Customer?.User.name ?? '-'}</div>

                <div className="font-medium text-gray-500">Customer Phone:</div>
                <div>{selectedOrder.Customer?.User.phoneNo ?? '-'}</div>

                <div className="font-medium text-gray-500">Customer Email:</div>
                <div>{selectedOrder.Customer?.User.email ?? '-'}</div>
            </div>

            {/* Order Items */}
            <div className="mt-6">
                <h5 className="text-lg font-semibold border-b pb-2 mb-3 text-gray-800">
                    Order Items
                </h5>

                {loading ? (
                    <p className="text-gray-500 text-sm">Loading items...</p>
                ) : orderItems.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full text-sm text-left border-collapse">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="py-2 px-4 border-b">#</th>
                                    <th className="py-2 px-4 border-b">Product Name</th>
                                    <th className="py-2 px-4 border-b text-right">Quantity</th>
                                    <th className="py-2 px-4 border-b text-right">Price</th>
                                    <th className="py-2 px-4 border-b text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderItems.map((item, index) => (
                                    <tr key={item.id ?? index} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b">{index + 1}</td>
                                        <td className="py-2 px-4 border-b">{item.Product?.title ?? '-'}</td>
                                        <td className="py-2 px-4 border-b text-right">{item.qty ?? 0}</td>
                                        <td className="py-2 px-4 border-b text-right">
                                            {Number(item.Product?.rate ?? 0).toFixed(2)}
                                        </td>
                                        <td className="py-2 px-4 border-b text-right">
                                            {(Number(item.Product?.rate ?? 0) * Number(item.qty ?? 0)).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">No items found for this order.</p>
                )}
            </div>
        </div>
    )
}

export default ViewOrderDetailsPopup
