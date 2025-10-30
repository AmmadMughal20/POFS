'use client'

import SalesmanForm from '@/components/Salesman/SalesmanForm/SalesmanForm';
import Button from '@/components/ui/Button/Button';
import Card from '@/components/ui/Card/Card';
import Page from '@/components/ui/Page/Page';
import Popup from '@/components/ui/Popup/Popup';
import RowActions from '@/components/ui/RowActions/RowActions';
import Table, { Align, Column } from '@/components/ui/Table/Table';
import
{
    handleSalesmanAddAction,
    handleSalesmanDeleteAction,
    handleSalesmanEditAction,
} from '@/server/SalesmanFormHandlers';
import { hasPermission } from '@/server/getUserSession';
import { Grid, List, PencilIcon, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { ISalesman } from '@/schemas/SalesmanSchema';
import SalesmanCard from '../SalesmanCard/SalesmanCard';
import ViewSalesmanDetailsPopup from '../ViewSalesmanDetailsPopup/ViewSalesmanDetialsPopup';

interface Props
{
    initialSalesmen: ISalesman[];
    permissions: string[];
    initialTotal: number
    branchId: string,
    businessId: string,
}

export default function SalesmansPageClient({ initialSalesmen, permissions, initialTotal, branchId, businessId }: Props)
{
    const router = useRouter()
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [displayType, setDisplayType] = useState<'list' | 'grid'>('list')
    const [selectedSalesman, setSelectedSalesman] = useState<ISalesman | null>(null);
    const [salesmanAddPopup, setSalesmanAddPopup] = useState(false);
    const [salesmanEditPopup, setSalesmanEditPopup] = useState(false);
    const [orderBy, setOrderBy] = useState('id');
    const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
    const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
    const [searchTerm, setSearchTerm] = useState('');
    const [viewSalesmanDetails, setViewSalesmanDetails] = useState(false);

    const skip = (page - 1) * rowsPerPage;

    const query = new URLSearchParams({
        branchId: branchId || '',
        skip: skip.toString(),
        take: rowsPerPage.toString(),
        orderBy,
        orderDirection,
        ...(categoryFilter ? { category: categoryFilter } : {}),
        ...(searchTerm ? { search: searchTerm } : {}),
    });

    const { data, error, isLoading, mutate } = useSWR(
        `/api/salesmen?${query.toString()}`,
        fetcher,
        {
            fallbackData: { items: initialSalesmen, total: initialTotal },
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

    const salesmen: ISalesman[] = data?.items ?? [];
    const total = data?.total ?? 0;

    const handleDelete = async (id?: number, branchId?: string) =>
    {
        if (confirm(`Delete salesman ${id} + ${branchId}?`))
        {
            const formData = new FormData();
            formData.append('id', id?.toString() || '');
            formData.append('branchId', branchId?.toString() || '');
            await handleSalesmanDeleteAction({}, formData);
            alert(`Salesman deleted successfully!`);
            mutate()
        }
    };

    const salesmanCols: Column<ISalesman>[] = [
        {
            key: "id",
            label: "Id",
            sortable: true,
            align: Align.LEFT,
            headerStyle: { textAlign: Align.LEFT },
            bodyStyle: { textAlign: Align.LEFT },

        },]

    const columnsWithActions: Column<ISalesman, string>[] = [
        ...salesmanCols, {
            key: "name",
            label: "Name",
            sortable: true,
            align: Align.LEFT,
            headerStyle: { textAlign: Align.LEFT },
            bodyStyle: { textAlign: Align.LEFT },
            render: (row) => (
                <p>{row.User.name}</p>
            )
        },
        {
            key: "phoneNo",
            label: "Phone No",
            sortable: true,
            align: Align.LEFT,
            headerStyle: { textAlign: Align.LEFT },
            bodyStyle: { textAlign: Align.LEFT },
            render: (row) => (
                <p>{row.User.phoneNo}</p>
            )
        },
        {
            key: "email",
            label: "Email",
            sortable: true,
            align: Align.LEFT,
            headerStyle: { textAlign: Align.LEFT },
            bodyStyle: { textAlign: Align.LEFT },
            render: (row) => (
                <p>{row.User.email}</p>
            )
        },
        {
            key: 'actions', // ✅ now allowed
            label: 'ACTIONS',
            align: Align.CENTER,
            headerStyle: { textAlign: Align.CENTER },
            render: (row) => (
                <RowActions
                    onView={() =>
                    {
                        const salesman = salesmen.find((b: ISalesman) => b.id === row.id);
                        if (salesman) setSelectedSalesman(salesman);
                        setViewSalesmanDetails(true);
                    }}
                    onEdit={() =>
                    {
                        const salesman = salesmen.find(b => (b.id === row.id && b.branchId === row.branchId));
                        if (salesman) setSelectedSalesman(salesman);
                        setSalesmanEditPopup(true);
                    }}

                    onDelete={() => handleDelete(row.id ?? undefined, row.branchId)}
                    showView={hasPermission(permissions, "salesman:view")}
                    showEdit={hasPermission(permissions, "salesman:update")}
                    showDelete={hasPermission(permissions, "salesman:delete")}
                />
            )
            ,
        },
    ];

    const handleSearch = async (term: string) =>
    {
        setSearchTerm(term);

        // Build new query params
        const query = new URLSearchParams({
            branchId: branchId || '',
            skip: '0',
            take: rowsPerPage.toString(),
            orderBy,
            orderDirection,
            ...(categoryFilter ? { category: categoryFilter } : {}),
            ...(term ? { search: term } : {}),
        });

        // Ask SWR to revalidate with the new key
        await mutate(fetcher(`/api/salesmen?${query.toString()}`), {
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
            ...(categoryFilter ? { category: categoryFilter } : {}),
            ...(searchTerm ? { search: searchTerm } : {}),
        });

        await mutate(fetcher(`/api/salesmen?${query.toString()}`), {
            revalidate: true,
        });
    }

    if (error)
    {
        return (
            <Page>
                <div className="text-center py-10">
                    <p className="text-red-500 font-semibold text-lg">
                        Failed to load salesmen.
                    </p>
                    <p className="text-gray-500 text-sm">
                        {error?.message || 'Something went wrong while fetching salesmen.'}
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
                        <h5>Salesmans  {'(' + total + ')'}</h5>
                        {
                            hasPermission(permissions, "salesman:create") ?
                                <Button className='!rounded-full !p-0' onClick={() => setSalesmanAddPopup(true)}>
                                    <Plus />
                                </Button> : <></>
                        }
                    </div>
                    <div className='flex justify-between items-center gap-2'>
                        <div className='flex gap-2 items-center'>
                            <button
                                onClick={() => { setSearchTerm(''); setTimeout(() => mutate(undefined, { revalidate: true }), 0) }}
                                className="px-3 py-1.5 text-sm rounded bg-gray-100 hover:bg-gray-200 border border-gray-300"
                            >
                                Refresh
                            </button>
                            <input
                                type="text"
                                placeholder="Search salesmen..."
                                className="border rounded px-3 py-1 text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
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
                    <Table<ISalesman, string>
                        columns={columnsWithActions}
                        data={salesmen}
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
                    <div className='grid grid-cols-4 mt-3 gap-3'>
                        {
                            salesmen.map(salesman => (
                                <SalesmanCard
                                    salesman={salesman}
                                    key={salesman.id}
                                    onView={(salesman) =>
                                    {
                                        setSelectedSalesman(salesman);
                                        setViewSalesmanDetails(true);
                                    }}
                                />
                            ))
                        }
                    </div>
                }
                {salesmen.length === 0 && !isLoading && (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-lg font-medium">No salesmen found.</p>
                        {hasPermission(permissions, "salesman:create") && (
                            <Button onClick={() => setSalesmanAddPopup(true)}>Add Salesman</Button>
                        )}
                    </div>
                )}
            </div>

            <Popup isOpen={salesmanAddPopup} onClose={() => { setSalesmanAddPopup(false); router.refresh(); }}>
                <SalesmanForm mode='add' onSubmitAction={handleSalesmanAddAction} branchId={branchId} businessId={businessId} mutate={mutate} />
            </Popup>

            <Popup isOpen={salesmanEditPopup} onClose={() => { setSalesmanEditPopup(false); setSelectedSalesman(null); router.refresh(); }}>
                {selectedSalesman && (
                    <SalesmanForm mode='edit' initialData={selectedSalesman} onSubmitAction={handleSalesmanEditAction} branchId={branchId} businessId={businessId} mutate={mutate} />
                )}
            </Popup>

            <Popup isOpen={viewSalesmanDetails} onClose={() => { setViewSalesmanDetails(false); setSelectedSalesman(null); }}>
                {selectedSalesman && (
                    <ViewSalesmanDetailsPopup selectedSalesman={selectedSalesman} onClose={() => { setViewSalesmanDetails(false); setSelectedSalesman(null); }} permissions={permissions} />
                )}
            </Popup>
        </Page>
    );
}
