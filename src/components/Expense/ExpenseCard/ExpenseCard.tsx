'use client';

import React from 'react';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import { IExpense } from '@/schemas/ExpenseSchema';
import { Pencil } from 'lucide-react';
import { format } from 'date-fns';
import RowActions from '@/components/ui/RowActions/RowActions';
import { hasPermission } from '@/server/getUserSession';

interface ExpenseCardProps
{
    expense: IExpense;
    onEdit?: (expense: IExpense) => void;
    onView?: (expense: IExpense) => void;
    onDelete?: (expense: IExpense) => void;
    permissions: string[];
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onEdit, onView, onDelete, permissions }) =>
{
    const { title, notes, amount, date, createdAt, updatedAt, createdByUser, updatedByUser } = expense;

    // Format date nicely
    const formattedDate = date
        ? format(new Date(date), 'HH:mm dd-MM-yyyy')
        : createdAt ? format(createdAt?.toString(), 'HH:mm dd-MM-yyyy') : '';

    return (
        <Card className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all bg-white group" >
            {/* Header Section */}
            <div className="p-1 flex justify-between items-start">
                <div>
                    <h6 className="text-lg font-semibold text-gray-900 truncate">{title.length > 17 ? title.slice(0, 16) + "..." : title} </h6>
                    <p className="text-sm text-gray-500">{formattedDate}</p>
                </div>
                <RowActions
                    className='!gap-0'
                    onView={() =>
                    {
                        if (expense)
                        {
                            onView?.(expense)
                        }
                    }}
                    onEdit={() =>
                    {
                        if (expense)
                        {
                            onEdit?.(expense)
                        }
                    }}
                    onDelete={() =>
                    {
                        onDelete?.(expense)
                    }}
                    showView={hasPermission(permissions, "expense:view")}
                    showEdit={hasPermission(permissions, "expense:update")}
                    showDelete={hasPermission(permissions, "expense:delete")}
                />
            </div>

            {/* Content Section */}
            <div className="px-4 pb-4 space-y-3">
                {notes && (
                    <p className="text-sm text-gray-600 line-clamp-3 border-l-2 border-gray-300 pl-2 italic">
                        {notes.length > 35 ? notes.slice(0, 35) + '...' : notes}
                    </p>
                )}

                <div className="text-sm text-gray-700 space-y-2">
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Amount:</span>
                        <span className="text-green-600 font-semibold">Rs. {Number(amount).toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Created By:</span>
                        <span>{createdByUser?.name ?? "-"}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Updated By:</span>
                        <span>{updatedByUser?.name ?? "-"}</span>
                    </div>

                    {updatedAt &&
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Last Updated:</span>
                            <span>{format(new Date(updatedAt), 'dd MMM yyyy, HH:mm')}</span>
                        </div>
                    }
                </div>
            </div>
        </Card>
    );
};

export default ExpenseCard;
