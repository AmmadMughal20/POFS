// src/components/ui/Table/Table.tsx
'use client';
import React, { useState } from 'react';
import Pagination from './Pagination';

export enum Align
{
    LEFT = 'left',
    CENTER = 'center',
    RIGHT = 'right',
}

export interface Column<T, K extends keyof T | string = keyof T>
{
    key: K;
    label: string;
    sortable?: boolean;
    align?: Align;
    render?: (row: T, rowIndex: number) => React.ReactNode;
    headerStyle?: React.CSSProperties;
    bodyStyle?: React.CSSProperties;
    width?: string | number;
}

interface TableConfig
{
    enableSearch?: boolean;
    enablePagination?: boolean;
    defaultRowsPerPage?: number;
    rowsPerPageOptions?: number[];
    alternateRowColors?: boolean;
}

interface TableProps<T, K extends keyof T | string = keyof T>
{
    columns: Column<T, K>[];
    data: T[];
    total?: number;
    page?: number;
    rowsPerPage?: number;
    onPageChange?: (page: number) => void;
    onRowsPerPageChange?: (rows: number) => void;
    onSearch?: (query: string) => void;
    onSort?: (key: K, direction: 'asc' | 'desc') => void;
    onRefresh?: () => void;
    loading?: boolean;
    config?: TableConfig;
    className?: string;
}

export default function Table<T extends object, K extends keyof T | string = keyof T>({
    columns,
    data,
    total = 0,
    page = 1,
    rowsPerPage = 10,
    onPageChange,
    onRowsPerPageChange,
    onSearch,
    onSort,
    onRefresh,
    loading = false,
    config = {
        enablePagination: true,
        enableSearch: true,
        rowsPerPageOptions: [5, 10, 20],
        alternateRowColors: true,
    },
    className = '',
}: TableProps<T, K>)
{
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [searchTerm, setSearchTerm] = useState('');

    const handleSort = (col: Column<T, K>) =>
    {
        if (!col.sortable) return;
        const direction =
            sortKey === col.key && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortKey(col.key.toString());
        setSortDirection(direction);
        onSort?.(col.key, direction);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        const term = e.target.value;
        setSearchTerm(term);
        onSearch?.(term);
        if (onPageChange) onPageChange(1);
    };

    // const totalPages = Math.ceil(total / rowsPerPage);

    return (
        <div
            className={`w-full bg-white rounded-lg shadow border border-gray-200 p-3 space-y-3 ${className}`}
        >
            {/* Header Controls */}
            {
                (config.enableSearch || onRefresh || config.enablePagination) &&
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                    {config.enableSearch && (
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="px-3 py-2 border border-gray-300 bg-white rounded-md text-sm w-full max-w-xs focus:outline-none focus:ring focus:ring-gray-200"
                        />
                    )}

                    <div className="flex items-center gap-2">
                        {onRefresh && (
                            <button
                                onClick={onRefresh}
                                className="px-3 py-1.5 text-sm rounded bg-gray-100 hover:bg-gray-200 border border-gray-300"
                            >
                                Refresh
                            </button>
                        )}

                        {config.enablePagination && onRowsPerPageChange && (
                            <div className="flex items-center gap-2 text-sm">
                                <span>Rows per page:</span>
                                <select
                                    value={rowsPerPage}
                                    onChange={(e) =>
                                    {
                                        onRowsPerPageChange(Number(e.target.value));
                                        onPageChange?.(1);
                                    }}
                                    className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-gray-100"
                                >
                                    {config.rowsPerPageOptions?.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>
            }


            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full text-sm text-left border-collapse">
                    <thead className="bg-primary text-white">
                        <tr>
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    onClick={() => handleSort(col)}
                                    style={{ width: col.width || `${100 / columns.length}%` }}
                                    className={`
                                                        px-4 py-3 select-none cursor-${col.sortable ? 'pointer' : 'default'}
                                                        uppercase text-xs border-b border-gray-200
                                                        ${col.headerStyle?.backgroundColor ?? 'bg-gray-100'}
                                                        ${col.headerStyle?.color ?? 'text-gray-800'}
                                                        ${col.headerStyle?.fontWeight ?? 'font-semibold'}
                                                        ${col.headerStyle?.textAlign === Align.LEFT
                                            ? 'text-center'
                                            : col.headerStyle?.textAlign === Align.RIGHT
                                                ? 'text-right'
                                                : 'text-left'}
                                                      `}
                                >
                                    <div className="flex items-center gap-1">
                                        {col.label}
                                        {col.sortable && (
                                            <span className="text-xs text-white">
                                                {sortKey === col.key
                                                    ? sortDirection === 'asc'
                                                        ? '▲'
                                                        : '▼'
                                                    : '⇵'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="text-center py-6 text-gray-500"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="text-center py-6 text-gray-500"
                                >
                                    No records found.
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className={`${config.alternateRowColors && rowIndex % 2 === 1 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition`}
                                >
                                    {columns.map((col, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className={`
                                                                    px-4 py-3 border-b border-gray-100
                                                                    ${col.bodyStyle?.color ?? 'text-gray-700'}
                                                                    ${col.bodyStyle?.fontWeight ?? 'font-normal'}
                                                                    ${col.bodyStyle?.textAlign === Align.CENTER
                                                    ? 'text-center'
                                                    : col.bodyStyle?.textAlign === Align.RIGHT
                                                        ? 'text-right'
                                                        : 'text-left'}
                                                                  `}
                                            style={col.bodyStyle}
                                        >
                                            {col.render
                                                ? col.render(row, rowIndex)
                                                : (col.key in row
                                                    ? (row[col.key as keyof T] as React.ReactNode)
                                                    : null)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {config.enablePagination && (
                <div className="flex items-center justify-end text-sm text-gray-700">
                    <Pagination
                        total={total}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={onPageChange}
                        onRowsPerPageChange={onRowsPerPageChange}
                        rowsPerPageOptions={config.rowsPerPageOptions ?? [5, 10, 20]}
                    />
                </div>
            )}
        </div>
    );
}
