import Button from '@/components/ui/Button/Button'
import Form from '@/components/ui/Form/Form'
import FormGroup from '@/components/ui/FormGroup/FormGroup'
import Input from '@/components/ui/Input/Input'
import Label from '@/components/ui/Label/Label'
import { ISalesman } from '@/schemas/SalesmanSchema'
import { SalesmanState, handleSalesmanAddAction, handleSalesmanEditAction } from '@/server/SalesmanFormHandlers'
import React, { useActionState, useEffect, useTransition } from 'react'

type SalesmanFormProps = {
    mode?: 'add' | 'edit';
    branchId: string,
    businessId: string,
    initialData?: Partial<ISalesman>;
    onSubmitAction: (prevState: SalesmanState, formData: FormData) => Promise<SalesmanState>;
    mutate: () => void
}

const SalesmanForm = ({ initialData, branchId, mode, mutate, businessId }: SalesmanFormProps) =>
{
    const initialState = { errors: {} }

    const [isPending, startTransition] = useTransition();
    const [state, formAction] = useActionState(
        async (prevState: SalesmanState, formData: FormData) =>
        {
            if (mode == "add")
            {
                return await handleSalesmanAddAction(prevState, formData);
            } else
            {
                return await handleSalesmanEditAction(prevState, formData);
            }
        },
        initialState
    );

    useEffect(() =>
    {
        if (state.success) mutate()
    }, [state.success, mutate])

    return (
        <Form title='Add Salesman' onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
        {
            e.preventDefault(); // prevent page reload

            const formData = new FormData(e.currentTarget);
            startTransition(() =>
            {
                formAction(formData); // execute server action
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

            {mode === "edit" ?
                <FormGroup>
                    <Label htmlFor='id'>Id</Label>
                    <Input
                        name='id'
                        readOnly={mode === 'edit'}
                        defaultValue={state?.values?.id ?? initialData?.id ?? ''}
                    />
                    {state.errors?.id && (
                        <p className="text-error">{state.errors.id[0]}</p>
                    )}
                </FormGroup> : <></>
            }

            {/* Name */}
            <FormGroup>
                <Label htmlFor='name'>Name</Label>
                <Input
                    name='name'
                    placeholder='Enter name e.g. John Doe'
                    defaultValue={state?.values?.User?.name as string ?? initialData?.User?.name ?? ''}
                />
                {state.errors?.name && (
                    <p className="text-error">{state.errors.name[0]}</p>
                )}
            </FormGroup>

            {/* Phone */}
            <FormGroup>
                <Label htmlFor='email'>Email</Label>
                <Input
                    name='email'
                    placeholder='Enter Email e.g. 03214561237'
                    defaultValue={state?.values?.User?.email ?? initialData?.User?.email ?? ''}
                />
                {state.errors?.email && (
                    <p className="text-error">{state.errors.email[0]}</p>
                )}
            </FormGroup>

            {/* Phone */}
            <FormGroup>
                <Label htmlFor='phoneNo'>Phone</Label>
                <Input
                    name='phoneNo'
                    placeholder='Enter Phone e.g. 03214561237'
                    defaultValue={state?.values?.User?.phoneNo ?? initialData?.User?.phoneNo ?? ''}
                />
                {state.errors?.phoneNo && (
                    <p className="text-error">{state.errors.phoneNo[0]}</p>
                )}
            </FormGroup>

            {/* Error Message */}
            {!state.success && state.message ? (
                <div className="text-center mb-4">
                    <p className="text-error font-medium">{state.message}</p>

                    {/* Show any unknown field errors */}
                    {Object.entries(state.errors || {}).map(([key, value]) =>
                    {
                        if (['id', 'name', 'branchId', 'businessId', 'phoneNo', 'email'].includes(key)) return null;
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
                        {state.message ?? 'Salesman added successfully.'}
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

export default SalesmanForm