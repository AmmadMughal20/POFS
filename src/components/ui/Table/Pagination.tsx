// src/components/ui/Table/Pagination.tsx
'use client';
import React from 'react';

interface PaginationProps
{
    total: number;
    page: number;
    rowsPerPage: number;
    onPageChange?: (page: number) => void;
    onRowsPerPageChange?: (rows: number) => void;
    rowsPerPageOptions?: number[];
}

const Pagination: React.FC<PaginationProps> = ({
    total,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    rowsPerPageOptions = [5, 10, 20],
}) =>
{
    const totalPages = Math.ceil(total / rowsPerPage);

    return (
        <div className="flex items-center justify-between px-4 py-2 gap-2 rounded text-sm text-gray-700">
            <div>
                Page {page} of {totalPages || 1}
            </div>

            <div className="flex items-center gap-3">
                <select
                    value={rowsPerPage}
                    onChange={(e) => onRowsPerPageChange?.(Number(e.target.value))}
                    className="border rounded px-2 py-1 text-sm"
                >
                    {rowsPerPageOptions.map((option) => (
                        <option key={option} value={option}>
                            {option} / page
                        </option>
                    ))}
                </select>

                <div className="flex gap-2">
                    <button
                        disabled={page <= 1}
                        onClick={() => onPageChange?.(page - 1)}
                        className="px-2 py-1 border rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <button
                        disabled={page >= totalPages}
                        onClick={() => onPageChange?.(page + 1)}
                        className="px-2 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pagination;
