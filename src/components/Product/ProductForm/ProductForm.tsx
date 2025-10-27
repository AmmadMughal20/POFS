import Form from '@/components/ui/Form/Form'
import FormGroup from '@/components/ui/FormGroup/FormGroup'
import Input from '@/components/ui/Input/Input'
import Label from '@/components/ui/Label/Label'
import React, { useActionState, useTransition } from 'react'
import { ProductState, handleProductAddAction } from '@/server/ProductFormHandlers'
import Button from '@/components/ui/Button/Button'
import Select from '@/components/ui/Select/Select'
import Option from '@/components/ui/Option/Option'
import { IProduct } from '@/schemas/ProductSchema'
import { ICategory } from '@/schemas/CategorySchema'
import { ISupplier } from '@/schemas/SupplierSchema'

type ProductFormProps = {
    mode?: 'add' | 'edit';
    businessId: string,
    branchId: string,
    initialData?: Partial<IProduct>;
    onSubmitAction: (prevState: ProductState, formData: FormData) => Promise<ProductState>;
    businessCategories: ICategory[]
    businessSuppliers: ISupplier[]
}

const ProductForm = ({ businessId, branchId, businessCategories, businessSuppliers }: ProductFormProps) =>
{
    const initialState = { errors: {} }

    const [isPending, startTransition] = useTransition();
    const [state, formAction] = useActionState(
        async (prevState: ProductState, formData: FormData) =>
        {
            return await handleProductAddAction(prevState, formData);
        },
        initialState
    );
    return (
        <Form title='Add Product' onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
        {
            e.preventDefault(); // prevent page reload

            const formData = new FormData(e.currentTarget);
            startTransition(() =>
            {
                formAction(formData); // call your useActionState handler
            })
        }}>
            <FormGroup >
                <Label htmlFor='businessId'>Business</Label>
                <Input name='businessId' readOnly defaultValue={state.values?.businessId || businessId} />
                {state.errors?.businessId && (
                    <p className="text-error">{state.errors.businessId[0]}</p>
                )}
            </FormGroup>
            <FormGroup >
                <Label htmlFor='branchId'>Branch</Label>
                <Input name='branchId' readOnly defaultValue={state.values?.branchId || branchId} />
                {state.errors?.branchId && (
                    <p className="text-error">{state.errors.branchId[0]}</p>
                )}
            </FormGroup>
            <FormGroup >
                <Label htmlFor='title'>Title</Label>
                <Input name='title' placeholder='Enter product title e.g. Fridge' />
                {state.errors?.title && (
                    <p className="text-error">{state.errors.title[0]}</p>
                )}
            </FormGroup>
            <FormGroup >
                <Label htmlFor='description'>Description</Label>
                <Input name='description' placeholder='Enter product description e.g. 15 cbft black color double-door' />
                {state.errors?.description && (
                    <p className="text-error">{state.errors.description[0]}</p>
                )}
            </FormGroup>
            <FormGroup >
                <Label htmlFor='sku'>SKU</Label>
                <Input name='sku' placeholder='Enter stock keeping unit e.g. No.' />
                {state.errors?.sku && (
                    <p className="text-error">{state.errors.sku[0]}</p>
                )}
            </FormGroup>
            <FormGroup >
                <Label htmlFor='rate'>Rate</Label>
                <Input name='rate' type='number' placeholder='Enter rate e.g. 50' />
                {state.errors?.rate && (
                    <p className="text-error">{state.errors.rate[0]}</p>
                )}
            </FormGroup>

            <FormGroup >
                <Label htmlFor='categoryId'>Category</Label>
                <Select name='categoryId'>
                    <Option key={'sample-category'} value={''} title={'Select Category'} />
                    {
                        businessCategories && businessCategories.map((cat) => (
                            <Option key={cat.id} value={cat.id} title={cat.name} />
                        ))
                    }
                </Select>
                {state.errors?.categoryId && (
                    <p className="text-error">{state.errors.categoryId[0]}</p>
                )}
            </FormGroup>

            <FormGroup >
                <Label htmlFor='supplierId'>Supplier</Label>
                <Select name='supplierId'>
                    <Option key={'samplet-supplier'} value={''} title={'Select Supplier'} />
                    {
                        businessSuppliers && businessSuppliers.map((supplier) => (
                            <Option key={supplier.id} value={supplier.id} title={supplier.name} />
                        ))
                    }
                </Select>
                {state.errors?.supplierId && (
                    <p className="text-error">{state.errors.supplierId[0]}</p>
                )}
            </FormGroup>

            {/* Error Message */}
            {!state.success && state.message ? (
                <div className="text-center mb-4">
                    <p className="text-error font-medium">{state.message}</p>

                    {/* Show any unknown field errors */}
                    {Object.entries(state.errors || {}).map(([key, value]) =>
                    {
                        if (['title', 'description', 'rate', 'sku', 'businessId', 'branchId'].includes(key)) return null;
                        return (
                            <p key={key} className="text-error text-sm">
                                {value?.[0]}
                            </p>
                        );
                    })}
                </div>
            ) : <></>}

            {/* Success Message */}
            {state.success ? (
                <div className="text-center mt-3">
                    <p className="text-success font-bold text-lg">
                        {state.message ?? 'Product added successfully.'}
                    </p>
                </div>
            ) : <></>}


            <FormGroup>
                <Button disabled={isPending}>
                    {isPending ? 'Processing...' : 'Submit'}
                </Button>
            </FormGroup>
        </Form>
    )
}

export default ProductForm