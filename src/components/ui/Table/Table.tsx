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
    align?: Align;
}

export interface Column
{
    key: string;
    label: string;
    sortable?: boolean;
    align?: Align;
    width?: string | number;
    headerStyle?: StyleConfig;
    bodyStyle?: StyleConfig;
    render?: (value: any, row: Record<string, any>, rowIndex: number) => React.ReactNode;
}

interface TableConfig
{
    enableSearch?: boolean;
    enablePagination?: boolean;
    defaultRowsPerPage?: number;
    rowsPerPageOptions?: number[];
    alternateRowColors?: boolean;
}

interface ITable
{
    columns: Column[];
    data: Record<string, any>[];
    className?: string;
    config?: TableConfig;
}

const Table: React.FC<ITable> = ({ data, columns, className = '', config = {} }) =>
{
    const {
        enableSearch = true,
        enablePagination = true,
        defaultRowsPerPage = 5,
        rowsPerPageOptions = [5, 10, 20],
        alternateRowColors = true,
    } = config;

    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortAsc, setSortAsc] = useState(true);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

    // handle sort click
    const handleSort = (col: Column) =>
    {
        if (!col.sortable) return;
        if (sortKey === col.key) setSortAsc(!sortAsc);
        else
        {
            setSortKey(col.key);
            setSortAsc(true);
        }
    };

    // filtering
    const filteredData = useMemo(() =>
    {
        return data.filter((row) =>
            Object.values(row).join(' ').toLowerCase().includes(search.toLowerCase())
        );
    }, [data, search]);

    // sorting
    const sortedData = useMemo(() =>
    {
        if (!sortKey) return filteredData;
        const col = columns.find((c) => c.key === sortKey);
        if (!col || !col.sortable) return filteredData;

        return [...filteredData].sort((a, b) =>
        {
            if (a[sortKey] < b[sortKey]) return sortAsc ? -1 : 1;
            if (a[sortKey] > b[sortKey]) return sortAsc ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortKey, sortAsc, columns]);

    // pagination
    const paginatedData = useMemo(() =>
    {
        if (!enablePagination) return sortedData;
        const start = (page - 1) * rowsPerPage;
        return sortedData.slice(start, start + rowsPerPage);
    }, [sortedData, page, rowsPerPage, enablePagination]);

    const totalPages = Math.ceil(sortedData.length / rowsPerPage);

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
                                    key={col.key}
                                    onClick={() => handleSort(col)}
                                    className={`
  px-4 py-3 select-none cursor-${col.sortable ? 'pointer' : 'default'}
  uppercase text-xs border-b border-gray-200
  ${col.headerStyle?.bgColor ?? 'bg-gray-100'}
  ${col.headerStyle?.textColor ?? 'text-gray-800'}
  ${col.headerStyle?.fontWeight ?? 'font-semibold'}
  ${col.headerStyle?.align === Align.CENTER
                                            ? 'text-center'
                                            : col.headerStyle?.align === Align.RIGHT
                                                ? 'text-right'
                                                : 'text-left'
                                        }
`}
                                    style={{ width: col.width || `${100 / columns.length}%` }}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{col.label}</span>
                                        {col.sortable && sortKey === col.key && (
                                            <span className="ml-1 text-gray-500">
                                                {sortAsc ? '▲' : '▼'}
                                            </span>
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
                                    className={`${alternateRowColors && idx % 2 === 1 ? 'bg-gray-50' : 'bg-white'
                                        } hover:bg-gray-100 transition`}
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className={`
  px-4 py-3 border-b border-gray-100
  ${col.headerStyle?.textColor ?? 'text-gray-700'}
  ${col.headerStyle?.fontWeight ?? 'font-normal'}
  ${col.headerStyle?.align === Align.CENTER
                                                    ? 'text-center'
                                                    : col.headerStyle?.align === Align.RIGHT
                                                        ? 'text-right'
                                                        : 'text-left'
                                                }
`}
                                        >
                                            {col.render
                                                ? col.render(row[col.key], row, idx)
                                                : row[col.key] ?? '-'}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="text-center py-6 text-gray-500"
                                >
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {enablePagination && (
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
                        {totalPages > 1 && (
                            <>
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
                            </>
                        )}
                        <span>
                            Page {page} of {totalPages}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Table;
