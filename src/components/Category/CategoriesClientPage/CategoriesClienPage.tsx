'use client'

import CategoryForm from '@/components/Category/CategoryForm/CategoryForm';
import Button from '@/components/ui/Button/Button';
import Card from '@/components/ui/Card/Card';
import Page from '@/components/ui/Page/Page';
import Popup from '@/components/ui/Popup/Popup';
import RowActions from '@/components/ui/RowActions/RowActions';
import Table, { Align, Column } from '@/components/ui/Table/Table';
import { ICategory } from '@/schemas/CategorySchema';
import { hasPermission } from '@/server/getUserSession';
import { Plus } from 'lucide-react';
import { useState } from 'react';

// export const dynamic = 'force-dynamic' // ✅ forces fresh fetch on refresh


interface Props
{
    initialcategories: ICategory[];
    permissions: string[];
    initialTotal: number
    businessId: string,
}

export default function CategoriesPageClient({ initialcategories, permissions, initialTotal, businessId }: Props)
{

    const data: ICategory[] = (initialcategories)
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const total = initialTotal
    const categories = initialcategories;
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
    const [categoryAddPopup, setCategoryAddPopup] = useState(false);
    const [categoryEditPopup, setCategoryEditPopup] = useState(false);

    if (categories.length === 0)
    {
        return (
            <Page>
                <div className='flex justify-between items-center mb-6'>
                    <h5>Categories</h5>
                </div>

                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg font-medium">No categories found.</p>
                    <p className="text-sm mb-4">Click below to add your first category.</p>
                    <Button onClick={() => setCategoryAddPopup(true)}>Add Category</Button>
                </div>

                <Popup isOpen={categoryAddPopup} onClose={() => { setCategoryAddPopup(false); }}>
                    <CategoryForm
                        businessId={businessId}
                    />
                </Popup>
            </Page>
        )
    }

    const handleDelete = async (id?: number) =>
    {
        if (confirm(`Delete category ${id}?`))
        {
            const formData = new FormData();
            formData.append('categoryId', id?.toString() || '');
            // await handleCategoryDeleteAction({}, formData);
            alert(`Category ${id} deleted successfully!`);

        }
    };

    const categoryCols: Column<ICategory>[] = [{
        key: "id",
        label: "Id",
        sortable: true,
        align: Align.CENTER,
        headerStyle: { textAlign: Align.CENTER },
        bodyStyle: { textAlign: Align.CENTER },
    }, {
        key: "name",
        label: "Name",
        sortable: true,
        align: Align.CENTER,
        headerStyle: { textAlign: Align.CENTER },
        bodyStyle: { textAlign: Align.CENTER },
    }
    ]

    const columnsWithActions: Column<ICategory, string>[] = [
        ...categoryCols,
        {
            key: 'actions', // ✅ now allowed
            label: 'ACTIONS',
            align: Align.CENTER,
            render: (row) => (
                <RowActions
                    onEdit={() =>
                    {
                        const category = categories.find(b => b.id === row.id);
                        if (category) setSelectedCategory(category);
                        setCategoryEditPopup(true);
                    }}
                    onDelete={() => handleDelete(row.id)}
                    showView={false}
                    showEdit={hasPermission(permissions, "category:update")}
                    showDelete={hasPermission(permissions, "category:delete")}
                />
            )
            ,
        },
    ];

    const handleSearch = (searchTerm: string) =>
    {
        // await
        console.log(searchTerm)
        return undefined
    }

    return (
        <Page>
            <div className='flex justify-between items-center'>
                <Card className='flex w-full items-center justify-between'>
                    <div className='flex gap-5 items-center'>
                        <h5>Categories</h5>
                        {
                            hasPermission(permissions, "category:create") ?
                                <Button className='!rounded-full !p-0' onClick={() => setCategoryAddPopup(true)}>
                                    <Plus />
                                </Button> : <></>
                        }
                    </div>
                </Card>
            </div>
            <div className='pt-3'>

                <Table<ICategory, string>
                    columns={columnsWithActions}
                    data={data}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    total={total}
                    onPageChange={setPage}
                    onRowsPerPageChange={setRowsPerPage}
                    onSearch={handleSearch}
                    config={{
                        enableSearch: true,
                        enablePagination: true,
                        defaultRowsPerPage: rowsPerPage,
                        rowsPerPageOptions: [5, 10, 15],
                    }}
                />
            </div>

            <Popup isOpen={categoryAddPopup} onClose={() => { setCategoryAddPopup(false);; }}>
                <CategoryForm
                    businessId={businessId}
                />
            </Popup>

            {/* <Popup isOpen={categoryEditPopup} onClose={() => { setCategoryEditPopup(false); setSelectedCategory(null); ; }}>
                {selectedCategory && (
                    <CategoryForm mode='edit' initialData={selectedCategory}
                        // onSubmitAction={handleCategoryEditAction}
                        businessId={businessId} branchId={branchId} businessCategories={businessCategories} businessSuppliers={businessSuppliers} />
                )}
            </Popup> */}


        </Page>
    );
}
