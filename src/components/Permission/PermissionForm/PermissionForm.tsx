'use client'
import { PermissionsState } from '@/server/PermissionFormHandlers'
import React, { startTransition, useActionState } from 'react'
import Button from '../../ui/Button/Button'
import Form from '../../ui/Form/Form'
import FormGroup from '../../ui/FormGroup/FormGroup'
import Input from '../../ui/Input/Input'
import Label from '../../ui/Label/Label'

interface PermissionFormProps
{
    mode?: 'add' | 'edit';
    initialData?: Partial<{
        id?: number
        title: string;
        code: string;
        description?: string | null;
    }>;
    onSubmitAction: (prevState: PermissionsState, formData: FormData) => Promise<PermissionsState>;
}

const PermissionForm: React.FC<PermissionFormProps> = ({
    mode = 'add',
    initialData = {},
    onSubmitAction,
}) =>
{

    const initialState = { errors: {} }

    const [state, formAction] = useActionState(
        async (prevState: PermissionsState, formData: FormData) =>
        {
            return await onSubmitAction(prevState, formData);
        },
        initialState
    );

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

            {/* Success message */}
            {state.success ? (
                <div className='text-center'>
                    <p className='text-success font-bold text-lg'>
                        {mode === "add" ? "Permission Added Successfully" : "Permission Updated Successfully"}
                    </p>
                </div>
            ) : <></>}

            <FormGroup>
                <Button>{mode === 'add' ? 'Submit' : 'Update'}</Button>
            </FormGroup>
        </Form>
    )
}

export default PermissionForm
