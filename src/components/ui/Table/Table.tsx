import React, { useState, useMemo } from 'react';

export enum Align
{
    LEFT = 'left',
    CENTER = 'center',
    RIGHT = 'right',
}

interface StyleConfig
{
    bgColor?: string;
    textColor?: string;
    fontWeight?: string;
    textAlign?: Align;
}


export interface DataColumn<T, K extends keyof T = keyof T>
{
    key: K; // must be a key of T
    label: string;
    sortable?: boolean;
    align?: Align;
    width?: string | number;
    headerStyle?: StyleConfig;
    bodyStyle?: StyleConfig;
    render?: (value: T[K], row: T, rowIndex: number) => React.ReactNode;
}

export interface CustomColumn<T>
{
    key: string; // can be anything not in keyof T
    label: string;
    align?: Align;
    sortable?: boolean;
    width?: string | number;
    headerStyle?: StyleConfig;
    bodyStyle?: StyleConfig;
    render: (row: T, rowIndex: number) => React.ReactNode; // only row is passed
}

export type Column<T> = DataColumn<T> | CustomColumn<T>;

interface TableConfig
{
    enableSearch?: boolean;
    enablePagination?: boolean;
    defaultRowsPerPage?: number;
    rowsPerPageOptions?: number[];
    alternateRowColors?: boolean;
}

interface TableProps<T>
{
    columns: Column<T>[];
    data: T[];
    className?: string;
    config?: TableConfig;
}

function isDataColumn<T>(col: Column<T>): col is DataColumn<T>
{
    return typeof col.render === 'function' && col.render.length === 3;
}

function Table<T extends object>({
    data,
    columns,
    className = '',
    config = {},
}: TableProps<T>)
{
    const {
        enableSearch = true,
        enablePagination = true,
        defaultRowsPerPage = 5,
        rowsPerPageOptions = [5, 10, 20],
        alternateRowColors = true,
    } = config;

    const [search, setSearch] = useState<string>('');
    const [sortKey, setSortKey] = useState<keyof T | null>(null);
    const [sortAsc, setSortAsc] = useState(true);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

    // Sorting handler
    const handleSort = (col: Column<T>) =>
    {
        if (!col.sortable) return;
        if (isDataColumn(col))
        { // only DataColumn has keyof T keys
            if (sortKey === col.key) setSortAsc(!sortAsc);
            else
            {
                setSortKey(col.key);
                setSortAsc(true);
            }
        }
    };

    // Filter data
    const filteredData = useMemo(() =>
    {
        const searchLower = search.toLowerCase();
        return data.filter((row) =>
            Object.values(row as { [key: string]: unknown })
                .map((v) => (v == null ? '' : String(v)))
                .join(' ')
                .toLowerCase()
                .includes(searchLower)
        );
    }, [data, search]);

    // Sort data
    const sortedData = useMemo(() =>
    {
        if (!sortKey) return filteredData;
        const col = columns.find((c) => c.key === sortKey);
        if (!col || !col.sortable) return filteredData;

        return [...filteredData].sort((a, b) =>
        {
            const aValue = a[sortKey];
            const bValue = b[sortKey];

            if (aValue == null) return 1;
            if (bValue == null) return -1;

            if (aValue < bValue) return sortAsc ? -1 : 1;
            if (aValue > bValue) return sortAsc ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortKey, sortAsc, columns]);

    // Pagination
    const paginatedData = useMemo(() =>
    {
        if (!enablePagination) return sortedData;
        const start = (page - 1) * rowsPerPage;
        return sortedData.slice(start, start + rowsPerPage);
    }, [sortedData, page, rowsPerPage, enablePagination]);

    const totalPages = Math.ceil(sortedData.length / rowsPerPage);

    function renderCell(value: unknown): React.ReactNode
    {
        if (value === null || value === undefined) return null;
        if (typeof value === 'boolean') return null; // ignore booleans
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint')
        {
            return value;
        }
        if (React.isValidElement(value)) return value; // already a React node
        if (Array.isArray(value)) return value.map((v, i) => <React.Fragment key={i}>{renderCell(v)}</React.Fragment>);
        // fallback for objects
        return JSON.stringify(value);
    }


    return (
        <div className={`space-y-3 ${className}`}>
            {/* Search */}
            {enableSearch && (
                <div className="flex flex-row-reverse">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) =>
                        {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="px-3 py-2 border border-gray-300 bg-white rounded-md text-sm w-full max-w-xs"
                    />
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl shadow-sm border border-gray-200">
                <table className="min-w-full text-sm border-collapse">
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={String(col.key)}
                                    onClick={() => handleSort(col)}
                                    className={`
                    px-4 py-3 select-none cursor-${col.sortable ? 'pointer' : 'default'}
                    uppercase text-xs border-b border-gray-200
                    ${col.headerStyle?.bgColor ?? 'bg-gray-100'}
                    ${col.headerStyle?.textColor ?? 'text-gray-800'}
                    ${col.headerStyle?.fontWeight ?? 'font-semibold'}
                    ${col.headerStyle?.textAlign === Align.CENTER
                                            ? 'text-center'
                                            : col.headerStyle?.textAlign === Align.RIGHT
                                                ? 'text-right'
                                                : 'text-left'}
                  `}
                                    style={{ width: col.width || `${100 / columns.length}%` }}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{col.label}</span>
                                        {col.sortable && sortKey === col.key && (
                                            <span className="ml-1 text-gray-500">{sortAsc ? '▲' : '▼'}</span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((row, idx) => (
                                <tr
                                    key={idx}
                                    className={`${alternateRowColors && idx % 2 === 1 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition`}
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={String(col.key)}
                                            className={`
                        px-4 py-3 border-b border-gray-100
                        ${col.bodyStyle?.textColor ?? 'text-gray-700'}
                        ${col.bodyStyle?.fontWeight ?? 'font-normal'}
                        ${col.bodyStyle?.textAlign === Align.CENTER
                                                    ? 'text-center'
                                                    : col.bodyStyle?.textAlign === Align.RIGHT
                                                        ? 'text-right'
                                                        : 'text-left'}
                      `}
                                        >
                                            {col.render
                                                ? isDataColumn(col)
                                                    ? col.render(row[col.key as keyof T], row, idx)
                                                    : col.render(row, idx)
                                                : renderCell(col.key in row ? row[col.key as keyof T] : undefined)
                                            }
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-6 text-gray-500">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {enablePagination && totalPages > 1 && (
                <div className="flex items-center justify-between text-sm text-gray-700">
                    <div className="flex items-center space-x-2">
                        <span>Rows per page:</span>
                        <select
                            value={rowsPerPage}
                            onChange={(e) =>
                            {
                                setRowsPerPage(Number(e.target.value));
                                setPage(1);
                            }}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                        >
                            {rowsPerPageOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-x-2 flex items-center">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
                        >
                            Next
                        </button>
                        <span>
                            Page {page} of {totalPages}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Table;
