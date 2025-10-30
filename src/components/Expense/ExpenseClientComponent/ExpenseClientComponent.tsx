'use client'

import ExpenseForm from '@/components/Expense/ExpenseForm/ExpenseForm';
import ViewExpenseDetialsPopup from '@/components/Expense/ViewExpenseDetailsPopup/ViewExpenseDetialsPopup';
import Button from '@/components/ui/Button/Button';
import Card from '@/components/ui/Card/Card';
import Page from '@/components/ui/Page/Page';
import Popup from '@/components/ui/Popup/Popup';
import RowActions from '@/components/ui/RowActions/RowActions';
import Table, { Align, Column } from '@/components/ui/Table/Table';
import { IExpense } from '@/schemas/ExpenseSchema';
import
{
    handleExpenseAddAction,
    handleExpenseDeleteAction,
    handleExpenseEditAction,
} from '@/server/ExpensesFormHandlers';
import { hasPermission } from '@/server/getUserSession';
import { Grid, List, PencilIcon, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ExpenseCard from '../ExpenseCard/ExpenseCard';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

interface Props
{
    initialExpenses: IExpense[];
    permissions: string[];
    initialTotal: number
    businessId: string,
    branchId: string,
}

export default function ExpensesPageClient({ initialExpenses, permissions, initialTotal, businessId, branchId }: Props)
{
    const router = useRouter()
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [displayType, setDisplayType] = useState<'list' | 'grid'>('list')
    const [selectedExpense, setSelectedExpense] = useState<IExpense | null>(null);
    const [expenseAddPopup, setExpenseAddPopup] = useState(false);
    const [expenseEditPopup, setExpenseEditPopup] = useState(false);
    const [viewExpenseDetails, setViewExpenseDetails] = useState(false);
    const [orderBy, setOrderBy] = useState('id');
    const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    const skip = (page - 1) * rowsPerPage;

    const query = new URLSearchParams({
        branchId: branchId || '',
        skip: skip.toString(),
        take: rowsPerPage.toString(),
        orderBy,
        orderDirection,
        ...(searchTerm ? { search: searchTerm } : {}),
        ...(dateFilter ? { date: dateFilter } : {}),
    });

    const { data, error, isLoading, mutate } = useSWR(
        `/api/expenses?${query.toString()}`,
        fetcher,
        {
            fallbackData: { items: initialExpenses, total: initialTotal },
            revalidateOnFocus: true,
        }
    );

    useEffect(() =>
    {
        const timer = setTimeout(() =>
        {
            handleSearch(searchTerm);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const expenses: IExpense[] = data?.items ?? [];
    const total = data?.total ?? 0;

    const handleDelete = async (id?: number) =>
    {
        if (confirm(`Delete expense ${id}?`))
        {
            const formData = new FormData();
            formData.append('id', id?.toString() || '');
            formData.append('branchId', branchId || '');
            await handleExpenseDeleteAction({}, formData);
            alert(`Expense ${id} deleted successfully!`);
            mutate()
        }
    };

    const expenseCols: Column<IExpense>[] = [{
        key: "id",
        label: "Id",
        sortable: true,
        align: Align.CENTER,
        headerStyle: { textAlign: Align.CENTER },
        bodyStyle: { textAlign: Align.CENTER },
    }, {
        key: "title",
        label: "Title",
        sortable: true,
        align: Align.CENTER,
        headerStyle: { textAlign: Align.CENTER },
        bodyStyle: { textAlign: Align.CENTER },
    }, {
        key: "notes",
        label: "Notes",
        sortable: true,
        align: Align.CENTER,
        headerStyle: { textAlign: Align.CENTER },
        bodyStyle: { textAlign: Align.CENTER },
    }, {
        key: "amount",
        label: "Amount",
        sortable: true,
        align: Align.CENTER,
        headerStyle: { textAlign: Align.CENTER },
        bodyStyle: { textAlign: Align.CENTER },
    },
    ]

    const columnsWithActions: Column<IExpense, string>[] = [
        ...expenseCols,
        {
            key: 'actions', // ✅ now allowed
            label: 'ACTIONS',
            align: Align.CENTER,
            render: (row) => (
                <RowActions
                    onView={() =>
                    {
                        const expense = expenses.find((b: IExpense) => b.id === row.id);
                        if (expense) setSelectedExpense(expense);
                        setViewExpenseDetails(true);
                    }}
                    onEdit={() =>
                    {
                        const expense = expenses.find(b => b.id === row.id);
                        if (expense) setSelectedExpense(expense);
                        setExpenseEditPopup(true);
                    }}
                    onDelete={() => handleDelete(row.id)}
                    showView={hasPermission(permissions, "expense:view")}
                    showEdit={hasPermission(permissions, "expense:update")}
                    showDelete={hasPermission(permissions, "expense:delete")}
                />
            )
            ,
        },
    ];

    const handleSearch = async (searchTerm: string) =>
    {
        setSearchTerm(searchTerm);

        // Build new query params
        const query = new URLSearchParams({
            branchId: branchId || '',
            skip: '0',
            take: rowsPerPage.toString(),
            orderBy,
            orderDirection,
            ...(searchTerm ? { search: searchTerm } : {}),
            ...(dateFilter ? { date: dateFilter } : {}),
        });

        // Ask SWR to revalidate with the new key
        await mutate(fetcher(`/api/expenses?${query.toString()}`), {
            revalidate: true,
        });
    };

    const handleSort = async (key: string, dir: 'asc' | 'desc') =>
    {
        setOrderBy(key);
        setOrderDirection(dir);

        const query = new URLSearchParams({
            branchId: branchId || '',
            skip: skip.toString(),
            take: rowsPerPage.toString(),
            orderBy: key,
            orderDirection: dir,
            ...(searchTerm ? { search: searchTerm } : {}),
            ...(dateFilter ? { date: dateFilter } : {}),
        });

        await mutate(fetcher(`/api/expenses?${query.toString()}`), {
            revalidate: true,
        });
    }

    if (error)
    {
        return (
            <Page>
                <div className="text-center py-10">
                    <p className="text-red-500 font-semibold text-lg">
                        Failed to load expenses.
                    </p>
                    <p className="text-gray-500 text-sm">
                        {error?.message || 'Something went wrong while fetching expenses.'}
                    </p>
                    <Button onClick={() => mutate()}>Retry</Button>
                </div>
            </Page>
        );
    }

    return (
        <Page>
            <div className='flex justify-between items-center'>
                <Card className='flex w-full items-center justify-between'>
                    <div className='flex gap-5 items-center'>
                        <h5>Expenses  {'(' + total + ')'}</h5>
                        {
                            hasPermission(permissions, "expense:create") ?
                                <Button className='!rounded-full !p-0' onClick={() => setExpenseAddPopup(true)}>
                                    <Plus />
                                </Button> : <></>
                        }
                    </div>
                    <div className='flex justify-between items-center gap-2'>
                        <div className='flex gap-2 items-center'>
                            <button
                                onClick={() => { setSearchTerm(''); setDateFilter(''); setTimeout(() => mutate(undefined, { revalidate: true }), 0) }}
                                className="px-3 py-1.5 text-sm rounded bg-gray-100 hover:bg-gray-200 border border-gray-300"
                            >
                                Refresh
                            </button>
                            <input
                                type="text"
                                placeholder="Search expenses..."
                                className="border rounded px-3 py-1 text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            <input
                                type="date"
                                className="border rounded px-3 py-1 text-sm"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />

                        </div>

                        <div className="flex items-center gap-3">
                            {/* Rows per page selector */}
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                <span>Rows per page:</span>
                                <select
                                    value={rowsPerPage}
                                    onChange={(e) =>
                                    {
                                        setRowsPerPage(Number(e.target.value));
                                        setPage(1); // reset to first page when rows per page changes
                                    }}
                                    className="border rounded px-2 py-1 text-sm"
                                >
                                    {[5, 10, 15, 20, 25, 50].map((size) => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Page number and navigation */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">
                                    Page {page} of {Math.ceil(total / rowsPerPage)}
                                </span>
                                <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>
                                    Prev
                                </Button>
                                <Button
                                    disabled={skip + rowsPerPage >= total}
                                    onClick={() => setPage(page + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        <div className={`p-1 rounded cursor-pointer ${displayType == 'list' && 'bg-accent'}`} onClick={() => setDisplayType('list')}>
                            <List />
                        </div>
                        <div className={`p-1 rounded cursor-pointer ${displayType == 'grid' && 'bg-accent'}`} onClick={() => setDisplayType('grid')}>
                            <Grid />
                        </div>
                    </div>
                </Card>
            </div>
            <div className='pt-3'>
                {
                    displayType == "list" &&
                    <Table<IExpense, string>
                        columns={columnsWithActions}
                        data={expenses}
                        total={total}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={setPage}
                        onRowsPerPageChange={setRowsPerPage}
                        onSearch={handleSearch}
                        onSort={handleSort}
                        loading={isLoading}
                        config={{
                            enableSearch: false,
                            enablePagination: false,
                            defaultRowsPerPage: rowsPerPage,
                            rowsPerPageOptions: [5, 10, 15],
                        }}
                    />
                }
                {
                    displayType == "grid" &&
                    <div className='grid grid-cols-4 gap-4 mt-3'>
                        {
                            expenses.map(expense => (
                                <ExpenseCard
                                    expense={expense}
                                    key={expense.id}
                                    permissions={permissions}
                                    onEdit={(expense) =>
                                    {
                                        if (expense)
                                        {
                                            setSelectedExpense(expense);
                                            setExpenseEditPopup(true);
                                        }
                                    }}
                                    onView={(expense) =>
                                    {
                                        if (expense)
                                        {
                                            setSelectedExpense(expense);
                                            setViewExpenseDetails(true);
                                        }
                                    }}
                                    onDelete={(expense) => handleDelete(expense.id)}
                                />
                            ))
                        }
                    </div>
                }
                {displayType === "list" && expenses.length === 0 && !isLoading && (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-lg font-medium">No expenses found.</p>
                        {hasPermission(permissions, "expense:create") && (
                            <Button onClick={() => setExpenseAddPopup(true)}>Add Expense</Button>
                        )}
                    </div>
                )}
            </div>

            <Popup isOpen={expenseAddPopup} onClose={() => { setExpenseAddPopup(false); router.refresh(); }}>
                <ExpenseForm mode='add' onSubmitAction={handleExpenseAddAction} businessId={businessId} branchId={branchId}
                    mutate={mutate} />
            </Popup>

            <Popup isOpen={expenseEditPopup} onClose={() => { setExpenseEditPopup(false); setSelectedExpense(null); router.refresh(); }}>
                {selectedExpense && (
                    <ExpenseForm mode='edit' initialData={selectedExpense}
                        onSubmitAction={handleExpenseEditAction}
                        businessId={businessId} branchId={branchId} mutate={mutate} />
                )}
            </Popup>

            <Popup isOpen={viewExpenseDetails} onClose={() => { setViewExpenseDetails(false); setSelectedExpense(null); }}>
                {selectedExpense && (
                    <ViewExpenseDetialsPopup selectedExpense={selectedExpense} onClose={() => { setViewExpenseDetails(false); setSelectedExpense(null); }} permissions={permissions} />
                )}
            </Popup>

        </Page>
    );
}
