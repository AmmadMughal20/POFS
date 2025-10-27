import Form from '@/components/ui/Form/Form'
import FormGroup from '@/components/ui/FormGroup/FormGroup'
import Input from '@/components/ui/Input/Input'
import Label from '@/components/ui/Label/Label'
import React, { useActionState, useTransition } from 'react'
import { OrdersState } from '@/server/OrderFormHandlers'
import Button from '@/components/ui/Button/Button'
import { IOrder } from '@/schemas/OrderSchema'

type OrderFormProps = {
    initialData?: Partial<IOrder>;
    businessId: string,
    mode: "add" | "edit",
    onSubmitAction: (prevState: OrdersState, formData: FormData) => Promise<OrdersState>;
}

const OrderFrom = ({ businessId, mode, onSubmitAction }: OrderFormProps) =>
{
    const initialState = { errors: {} }

    const [isPending, startTransition] = useTransition();
    const [state, formAction] = useActionState(
        async (prevState: OrdersState, formData: FormData) =>
        {
            return await onSubmitAction(prevState, formData);
        },
        initialState
    );
    return (
        <Form title='Add Order' onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
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
                <Label htmlFor='name'>Name</Label>
                <Input name='name' />
                {state.errors?.name && (
                    <p className="text-error">{state.errors.name[0]}</p>
                )}
            </FormGroup>

            {/* Error Message */}
            {!state.success && state.message ? (
                <div className="text-center mb-4">
                    <p className="text-error font-medium">{state.message}</p>

                    {/* Show any unknown field errors */}
                    {Object.entries(state.errors || {}).map(([key, value]) =>
                    {
                        if (['businessId', 'name'].includes(key)) return null;
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
                        {state.message ?? 'Order added successfully.'}
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

export default OrderFrom