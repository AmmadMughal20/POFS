'use client'
import { PermissionsState } from '@/server/PermissionFormHandlers'
import React, { useActionState, useEffect, useTransition } from 'react'
import Button from '../../ui/Button/Button'
import Form from '../../ui/Form/Form'
import FormGroup from '../../ui/FormGroup/FormGroup'
import Input from '../../ui/Input/Input'
import Label from '../../ui/Label/Label'
import { handlePermissionAddAction } from '@/server/PermissionFormHandlers'
import { IPermission } from '@/schemas/PermissionSchema'


interface PermissionFormProps
{
    mode?: 'add' | 'edit';
    initialData?: Partial<IPermission>;
    onSubmitAction: typeof handlePermissionAddAction
}

const PermissionForm: React.FC<PermissionFormProps> = ({
    mode = 'add',
    initialData = {},
    onSubmitAction,
}) =>
{

    const initialState = {
        success: false,
        message: '',
        errors: {},
        values: initialData ?? {},
    } as PermissionsState;

    const [isPending, startTransition] = useTransition();

    const [state, formAction] = useActionState(onSubmitAction, initialState);

    useEffect(() =>
    {
        if (state.success && mode === 'add')
        {
            const form = document.querySelector('form');
            if (form) form.reset();
        }
    }, [state.success, mode]);

    return (
        <Form title={mode === 'add' ? 'Add Permission' : 'Edit Permission'} onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
        {
            e.preventDefault(); // prevent page reload

            const formData = new FormData(e.currentTarget);
            startTransition(() =>
            {
                formAction(formData); // call your useActionState handler
            })
        }}>

            {/* ID */}
            {mode === "edit" ?
                <FormGroup>
                    <Label htmlFor='id'>Id</Label>
                    <Input
                        name='id'
                        readOnly={mode === "edit"}
                        defaultValue={initialData.id}
                    />
                    {state.errors?.id && (
                        <p className="text-error">{state.errors.id[0]}</p>
                    )}
                </FormGroup> : <></>
            }

            {/* Title */}
            <FormGroup>
                <Label htmlFor='title'>Title</Label>
                <Input
                    name='title'
                    placeholder='Enter title e.g. Create User'
                    defaultValue={state?.values?.title ?? initialData.title ?? ''}
                />
                {state.errors?.title && (
                    <p className="text-error">{state.errors.title[0]}</p>
                )}
            </FormGroup>

            {/* Code */}
            <FormGroup>
                <Label htmlFor='code'>Code</Label>
                <Input
                    name='code'
                    placeholder='Enter code e.g. user:create'
                    defaultValue={state?.values?.code ?? initialData.code ?? ''}
                />
                {state.errors?.code && (
                    <p className="text-error">{state.errors.code[0]}</p>
                )}
            </FormGroup>

            {/* Description */}
            <FormGroup>
                <Label htmlFor='description'>Description</Label>
                <Input
                    name='description'
                    placeholder='Enter description e.g. permission to create user.'
                    defaultValue={state?.values?.description ?? initialData.description ?? ''}
                />
                {state.errors?.description && (
                    <p className="text-error">{state.errors.description[0]}</p>
                )}
            </FormGroup>

            {/* Error Message */}
            {!state.success && state.message ? (
                <div className="text-center mb-4">
                    <p className="text-error font-medium">{state.message}</p>

                    {/* Show any unknown field errors */}
                    {Object.entries(state.errors || {}).map(([key, value]) =>
                    {
                        if (['title', 'code', 'description', 'id'].includes(key)) return null;
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
                        {state.message ??
                            (mode === 'add'
                                ? 'Permission added successfully.'
                                : 'Permission updated successfully.')}
                    </p>
                </div>
            ) : <></>}

            <FormGroup>
                <Button disabled={isPending}>
                    {isPending ? 'Processing...' : mode === 'add' ? 'Submit' : 'Update'}
                </Button>
            </FormGroup>
        </Form>
    )
}

export default PermissionForm
