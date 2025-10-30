'use client';

import React, { useActionState, useTransition, useEffect, useState } from 'react';
import Form from '@/components/ui/Form/Form';
import FormGroup from '@/components/ui/FormGroup/FormGroup';
import Label from '@/components/ui/Label/Label';
import Input from '@/components/ui/Input/Input';
import Select from '@/components/ui/Select/Select';
import Option from '@/components/ui/Option/Option';
import Button from '@/components/ui/Button/Button';
import { OrdersState } from '@/server/OrderFormHandlers';
import { IOrder } from '@/schemas/OrderSchema';

type OrderStatusFormProps = {
    order: IOrder;
    onUpdateAction: (prevState: OrdersState, formData: FormData) => Promise<OrdersState>;
    mutate: () => void
};

const OrderStatusForm = ({ order, onUpdateAction, mutate }: OrderStatusFormProps) =>
{
    const initialState = { errors: {}, message: '', success: false, values: {} };
    const [isPending, startTransition] = useTransition();
    const [state, formAction] = useActionState(onUpdateAction, initialState);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault(); // prevent page reload

        const formData = new FormData(e.currentTarget);
        startTransition(() =>
        {
            formAction(formData); // call your useActionState handler
        })
    }
    useEffect(() =>
    {
        if (state.success) mutate()
    }, [state.success, mutate])

    return (
        <Form title="Update Order Status" onSubmit={handleSubmit}>
            <FormGroup>
                <Label htmlFor="orderId">Order ID</Label>
                <Input name="orderId" readOnly defaultValue={order.id} />
            </FormGroup>

            <FormGroup>
                <Label htmlFor="customer">Customer</Label>
                <Input name="customer" readOnly defaultValue={order.Customer?.User.name || 'N/A'} />
            </FormGroup>

            <FormGroup>
                <Label htmlFor="status">Status</Label>
                <Select
                    name="status"
                    defaultSelected={order.status}
                >
                    <Option value="PENDING" title="Pending" />
                    <Option value="CONFIRMED" title="Confirmed" />
                    <Option value="COMPLETED" title="Completed" />
                    <Option value="CANCELLED" title="Cancelled" />
                </Select>
            </FormGroup>


            <div className="flex justify-end">
                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Updating...' : 'Update Status'}
                </Button>
            </div>

            {state.message ? (
                <div
                    className={`text-center mt-4 ${state.success ? 'text-success' : 'text-error'}`}
                >
                    {state.message}
                </div>
            ) : <></>}
        </Form>
    );
};

export default OrderStatusForm;
