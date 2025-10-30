'use client';
import React from 'react';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import { IOrder } from '@/schemas/OrderSchema';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import Image from 'next/image';
import { formatDate } from 'date-fns';

interface OrderCardProps
{
    order: IOrder;
    onView?: (order: IOrder) => void;
}

const getStatusStyle = (status: string) =>
{
    switch (status?.toUpperCase())
    {
        case 'PENDING':
            return { color: 'text-amber-600', bg: 'bg-amber-100', icon: <Clock size={16} /> };
        case 'CONFIRMED':
            return { color: 'text-blue-600', bg: 'bg-blue-100', icon: <CheckCircle size={16} /> };
        case 'COMPLETED':
            return { color: 'text-green-600', bg: 'bg-green-100', icon: <CheckCircle size={16} /> };
        case 'CANCELLED':
            return { color: 'text-red-600', bg: 'bg-red-100', icon: <XCircle size={16} /> };
        default:
            return { color: 'text-gray-600', bg: 'bg-gray-100', icon: <Clock size={16} /> };
    }
};

const OrderCard: React.FC<OrderCardProps> = ({ order, onView }) =>
{
    const { color, bg, icon } = getStatusStyle(order.status);

    return (
        <Card className="overflow-hidden rounded-xl shadow-md hover:shadow-lg transition bg-white border border-gray-100 p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
                <h5 className="text-lg font-semibold text-gray-800">Order #{order.id}</h5>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bg} ${color}`}>
                    {icon}
                    <span className="capitalize">{order.status}</span>
                </div>
            </div>

            {/* Basic Info */}
            <div className="text-sm text-gray-700 space-y-1">
                <p>
                    <span className="font-medium text-gray-500">Customer:</span>{' '}
                    {order.Customer?.User?.name ?? '-'}
                </p>
                <p>
                    <span className="font-medium text-gray-500">Phone:</span>{' '}
                    {order.Customer?.User?.phoneNo ?? '-'}
                </p>
                <p>
                    <span className="font-medium text-gray-500">Amount:</span>{' '}
                    {order.totalAmount ?? '-'}
                </p>
                <p>
                    <span className="font-medium text-gray-500">Mode:</span>{' '}
                    {order.orderMode ?? '-'}
                </p>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
                <p>Created: {order.createdAt ? formatDate(new Date(order.createdAt), 'dd/mm/yy HH:MM:SS') : ''}</p>
                <Button
                    variant="secondary"
                    onClick={() => onView?.(order)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                    <Eye size={16} />
                    View Details
                </Button>
            </div>
        </Card>
    );
};

export default OrderCard;
