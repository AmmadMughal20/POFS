'use client';

import { IExpense } from '@/schemas/ExpenseSchema';
import React from 'react';

type ViewExpenseProps = {
    selectedExpense: IExpense;
    onClose: () => void;
    permissions: string[];
};

const ViewExpenseDetailsPopup = ({ selectedExpense, onClose, permissions }: ViewExpenseProps) =>
{
    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center border-b px-6 py-4 bg-secondary/10 rounded-t">
                <h5 className="text-xl font-semibold text-gray-800">Expense Details</h5>
            </div>

            {/* Body */}
            <div className="p-6 max-h-[80vh] overflow-y-auto space-y-8">
                {/* Expense Info Section */}
                <section>
                    <h6 className="text-lg font-semibold text-gray-800 mb-3">Expense Information</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-sm text-gray-700">
                        <Info label="Expense ID" value={selectedExpense.id} />
                        <Info label="Title" value={selectedExpense.title} />
                        <Info label="Notes" value={selectedExpense.notes ?? '-'} />
                        <Info label="Amount" value={`Rs. ${selectedExpense.amount?.toFixed(2)}`} />
                        <Info label="Date" value={selectedExpense.date ? formatDate(selectedExpense.date) : '-'} />
                        <Info label="Created By" value={selectedExpense.createdByUser?.name ?? '-'} />
                        <Info label="Updated By" value={selectedExpense.updatedByUser?.name ?? '-'} />
                        <Info
                            label="Created At"
                            value={selectedExpense.createdAt ? formatDateTime(selectedExpense.createdAt) : '-'}
                        />
                        <Info
                            label="Updated At"
                            value={selectedExpense.updatedAt ? formatDateTime(selectedExpense.updatedAt) : '-'}
                        />
                    </div>
                </section>

                {/* Description */}
                {selectedExpense.notes && (
                    <section>
                        <h6 className="text-lg font-semibold text-gray-800 mb-3">Additional Notes</h6>
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                            {selectedExpense.notes}
                        </p>
                    </section>
                )}
            </div>
        </div>
    );
};

// 🔹 Reusable info field component
const Info = ({ label, value }: { label: string; value?: string | number | null }) => (
    <div>
        <div className="font-medium text-gray-500">{label}</div>
        <div className="text-gray-800">{value ?? '-'}</div>
    </div>
);

// 🔹 Helper functions
function formatDate(dateString: string | Date): string
{
    const d = new Date(dateString);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
}

function formatDateTime(dateString: string | Date): string
{
    const d = new Date(dateString);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${hours}:${minutes} ${day}-${month}-${year}`;
}

export default ViewExpenseDetailsPopup;
