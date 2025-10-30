import Form from '@/components/ui/Form/Form'
import FormGroup from '@/components/ui/FormGroup/FormGroup'
import Input from '@/components/ui/Input/Input'
import Label from '@/components/ui/Label/Label'
import React, { useActionState, useEffect, useTransition } from 'react'
import Button from '@/components/ui/Button/Button'
import Select from '@/components/ui/Select/Select'
import Option from '@/components/ui/Option/Option'
import { IStock } from '@/schemas/StockSchema'
import { StockState, handleStockAddAction, handleStockEditAction } from '@/server/StockFormHandlers'
import { IProduct } from '@/schemas/ProductSchema'

type StockFormProps = {
    mode?: 'add' | 'edit';
    branchId: string,
    initialData?: Partial<IStock>;
    onSubmitAction: (prevState: StockState, formData: FormData) => Promise<StockState>;
    businessProducts?: IProduct[] | null,
    mutate: () => void
}

const StockForm = ({ initialData, branchId, businessProducts, mode, mutate }: StockFormProps) =>
{
    const initialState = { errors: {} }

    const [isPending, startTransition] = useTransition();
    const [state, formAction] = useActionState(
        async (prevState: StockState, formData: FormData) =>
        {
            if (mode == "add")
            {
                return await handleStockAddAction(prevState, formData);
            } else
            {
                return await handleStockEditAction(prevState, formData);
            }
        },
        initialState
    );

    useEffect(() =>
    {
        if (state.success) mutate()
    }, [state.success, mutate])

    return (
        <Form title='Add Stock' onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
        {
            e.preventDefault(); // prevent page reload

            const formData = new FormData(e.currentTarget);
            startTransition(() =>
            {
                formAction(formData); // execute server action
            })
        }}>
            <FormGroup >
                <Label htmlFor='branchId'>Branch</Label>
                <Input name='branchId' readOnly defaultValue={state.values?.branchId || branchId} />
                {state.errors?.branchId && (
                    <p className="text-error">{state.errors.branchId[0]}</p>
                )}
            </FormGroup>

            <FormGroup >
                <Label htmlFor='productId'>Product</Label>
                {
                    mode === "add" ?
                        <Select name='productId' defaultSelected={initialData?.productId}>
                            <Option key={'sample-product'} value={''} title={'Select Product'} />
                            {
                                businessProducts && businessProducts.map((prod) => (
                                    <Option key={prod.id} value={prod.id} title={prod.title} />
                                ))
                            }
                        </Select>
                        :
                        <>
                            <Input
                                type='text'
                                defaultValue={initialData?.Product?.title}
                                readOnly
                            />
                            <Input type='hidden' name="productId" defaultValue={initialData?.Product?.id} readOnly />
                        </>
                }

                {state.errors?.productId && (
                    <p className="text-error">{state.errors.productId[0]}</p>
                )}
            </FormGroup>

            <FormGroup >
                <Label htmlFor='stockUnits'>Stock Units</Label>
                <Input name='stockUnits' defaultValue={state.values?.stockUnits || initialData?.stockUnits} />
                {state.errors?.stockUnits && (
                    <p className="text-error">{state.errors.stockUnits[0]}</p>
                )}
            </FormGroup>

            {/* Error Message */}
            {!state.success && state.message ? (
                <div className="text-center mb-4">
                    <p className="text-error font-medium">{state.message}</p>

                    {/* Show any unknown field errors */}
                    {Object.entries(state.errors || {}).map(([key, value]) =>
                    {
                        if (['branchId', 'productId', 'stockUnits'].includes(key)) return null;
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
                        {state.message ?? 'Stock added successfully.'}
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

export default StockForm