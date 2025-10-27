import Form from '@/components/ui/Form/Form'
import FormGroup from '@/components/ui/FormGroup/FormGroup'
import Input from '@/components/ui/Input/Input'
import Label from '@/components/ui/Label/Label'
import React, { useActionState, useTransition } from 'react'
import { SupplierState, handleSupplierAddAction } from '@/server/SupplierFormHandlers'
import Button from '@/components/ui/Button/Button'

type SupplierFormProps = {
    businessId: string
}

const SupplierFrom = ({ businessId }: SupplierFormProps) =>
{
    const initialState = { errors: {} }

    const [isPending, startTransition] = useTransition();
    const [state, formAction] = useActionState(
        async (prevState: SupplierState, formData: FormData) =>
        {
            return await handleSupplierAddAction(prevState, formData);
        },
        initialState
    );
    return (
        <Form title='Add Supplier' onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
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
                <Label htmlFor='name'>Name <span className='text-red-500'>*</span></Label>
                <Input name='name' placeholder='Enter supplier name e.g. Jameel Masood' />
                {state.errors?.name && (
                    <p className="text-error">{state.errors.name[0]}</p>
                )}
            </FormGroup>

            <FormGroup >
                <Label htmlFor='phoneNo'>Phone No</Label>
                <Input name='phoneNo' placeholder='Enter supplier phone e.g. 03211234567' />
                {state.errors?.phoneNo && (
                    <p className="text-error">{state.errors.phoneNo[0]}</p>
                )}
            </FormGroup>

            <FormGroup >
                <Label htmlFor='email'>Email</Label>
                <Input name='email' type='email' placeholder='Enter supplier email e.g. test@gmail.com' />
                {state.errors?.email && (
                    <p className="text-error">{state.errors.email[0]}</p>
                )}
            </FormGroup>

            <FormGroup >
                <Label htmlFor='address'>Address</Label>
                <Input name='address' placeholder='Enter supplier address e.g. 123 ABC Lahore' />
                {state.errors?.name && (
                    <p className="text-error">{state.errors.address[0]}</p>
                )}
            </FormGroup>

            {/* Error Message */}
            {!state.success && state.message ? (
                <div className="text-center mb-4">
                    <p className="text-error font-medium">{state.message}</p>

                    {/* Show any unknown field errors */}
                    {Object.entries(state.errors || {}).map(([key, value]) =>
                    {
                        if (['businessId', 'name', 'phone', 'email', 'address'].includes(key)) return null;
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
                        {state.message ?? 'Supplier added successfully.'}
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

export default SupplierFrom